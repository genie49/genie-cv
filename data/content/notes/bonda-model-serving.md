# 서버리스 GPU에서 OCR 모델 서빙하기

발굴보고서 PDF를 텍스트로 바꾸려면 OCR이 필수다. 문제는 OCR 모델(PaddleOCR VL-1.5, 0.9B 파라미터)이 GPU를 요구한다는 점이었다. 상시 GPU 서버를 운영하면 비용이 크고, 보고서 처리는 초기 일괄 인제스션 이후에는 간헐적으로만 발생한다. **안 쓸 때 비용이 0인 구조**가 필요했다.

## Modal 서버리스를 선택한 이유

GPU 서빙 선택지는 크게 세 가지였다.

| 선택지 | 장점 | 단점 |
|--------|------|------|
| AWS EC2 GPU 인스턴스 | 안정적, 커스텀 자유 | 상시 비용, 유휴 시간에도 과금 |
| RunPod/Banana 등 추론 API | 간편한 배포 | 커스텀 파이프라인 제약, 벤더 종속 |
| **Modal 서버리스** | 요청 시만 GPU 할당, 자동 스케일링 | Cold start 존재 |

Modal을 택한 결정적 이유는 **컨테이너 수준의 커스텀이 가능하면서도 서버리스**라는 점이었다. CUDA 베이스 이미지 위에 vLLM과 PaddleOCR을 직접 설치하고, 내부에서 vLLM 서버를 프로세스로 띄우는 구조까지 자유롭게 구성할 수 있었다.

## vLLM을 쓴 이유

PaddleOCR VL-1.5는 내부적으로 VLM(Vision Language Model)을 사용한다. 기본 추론 백엔드 대신 vLLM을 선택한 이유는 **배치 추론 시 throughput 극대화** 때문이었다.

PaddleOCR의 내부 파이프라인은 3단계(입력 준비 → 레이아웃 분석 → VLM 추론)로 동작하며, VLM 단계에서 여러 요청을 자동으로 미니배칭한다. 이때 vLLM의 continuous batching이 배치 효율을 크게 높여준다. `vl_rec_max_concurrency=8`로 VLM 동시 요청을 8개까지 허용하여, 레이아웃 분석이 끝난 블록들이 대기 없이 VLM으로 흘러가도록 했다.

## 추론 최적화 설정

```python
vllm_proc = subprocess.Popen([
    sys.executable, "-m", "vllm.entrypoints.openai.api_server",
    "--model", VLLM_MODEL,
    "--gpu-memory-utilization", "0.9",      # GPU 메모리 90% 활용
    "--kv-cache-dtype", "fp8",              # KV 캐시 메모리 50% 절감
    "--enable-chunked-prefill",             # 긴 시퀀스 레이턴시 개선
    "--max-num-batched-tokens", "16384",    # 배치당 최대 토큰
    "--max-num-seqs", "256",                # 동시 시퀀스 수
    "--no-enable-prefix-caching",           # 메모리 절약 (OCR은 프리픽스 공유 없음)
    "--mm-processor-cache-gb", "0",         # 멀티모달 캐시 비활성화
])
```

각 설정의 판단 근거:

- **fp8 KV-cache**: OCR은 정밀한 생성보다 텍스트 인식이 목적이라 fp8의 미세한 정밀도 손실이 문제되지 않았다. 대신 KV 캐시 메모리가 절반으로 줄어 더 많은 시퀀스를 동시에 처리할 수 있게 됐다.
- **chunked prefill**: 보고서 페이지 이미지는 토큰 수가 많아 프리필 단계가 길다. chunked prefill은 프리필을 청크로 나눠 디코딩과 인터리빙하여 첫 토큰 레이턴시를 줄여준다.
- **prefix caching 비활성화**: 각 페이지 이미지가 모두 다르기 때문에 프리픽스를 공유할 일이 없다. 캐시 오버헤드만 늘어나므로 꺼두었다.
- **gpu-memory-utilization 0.9**: L40S의 48GB VRAM을 최대한 활용한다. 0.9B 모델이라 메모리에 여유가 있어 공격적으로 잡아도 OOM 없이 안정적이었다.

## 스케일링과 Cold Start

```python
@app.cls(
    gpu="L40S",
    scaledown_window=2 * MINUTES,   # 2분 유휴 시 자동 종료
    timeout=10 * MINUTES,            # 요청 타임아웃
    volumes={"/root/.cache": model_cache},  # 모델 가중치 캐싱
)
@modal.concurrent(max_inputs=1)
```

보고서 일괄 처리 시에는 최대 **5인스턴스를 병렬로 활성화**하여 동시에 5개 문서를 처리했다. 각 인스턴스가 독립적인 GPU와 vLLM 서버를 갖고 있어 인스턴스 간 간섭이 없다.

Cold start는 **약 30초**가 소요된다. 모델 가중치(약 1.8GB)는 Modal 영구 볼륨(`bonda-model-cache`)에 캐싱되어 있어 네트워크 다운로드를 건너뛴다. Cold start의 대부분은 vLLM 서버 초기화(모델 로드 + CUDA 커널 컴파일)에 소요된다. `scaledown_window=120초`로 설정하여, 문서 배치 처리 중에는 인스턴스가 유지되고 처리가 끝나면 2분 후 자동으로 꺼진다.

## 성능 수치

100개 PDF 문서(문서당 200~300페이지)를 처리한 결과:

| 지표 | 수치 |
|------|------|
| Cold start | ~30초 |
| 40페이지 추론 | ~1분 30초 (페이지당 ~3.1초) |
| 117페이지 추론 | ~394초 (페이지당 ~3.4초) |
| GPU 비용 | L40S ~$0.83/시간 |
| 월 운영 비용 | Modal 무료 크레딧 $30/월 내 |

페이지 수가 늘어도 페이지당 처리 시간이 크게 변하지 않는 건, vLLM의 continuous batching 덕분에 배치 효율이 일정하게 유지되기 때문이다. 초기 인제스션 이후 신규 보고서가 등록될 때만 간헐적으로 GPU가 켜지므로, 월 $30 무료 크레딧 내에서 충분히 운영 가능했다.

## 돌아보면

서버리스 GPU의 핵심 가치는 **"안 쓸 때 비용이 0"**이라는 점이었다. 상시 GPU 서버였다면 월 수백 달러가 고정 비용으로 나갔을 텐데, Modal 서버리스로 실제 추론 시간에만 과금되는 구조를 만들 수 있었다. Cold start 30초는 실시간 서비스였다면 치명적이겠지만, 배치 처리 파이프라인에서는 문서 수백 건 처리 중 처음 한 번만 발생하므로 문제가 되지 않았다. 워크로드의 특성에 맞는 인프라를 선택하는 것이 중요하다는 걸 다시 한번 느꼈다.
