# 떙떙님 이거 안되는데요? 아 환경변수 또 바뀌었어요?

모노레포에 서비스 3개, 환경변수 50개. .env 파일로 관리하다 보면 "이 API 키 어디에 정의돼 있지?", "프로덕션이랑 개발 환경이 다른 건 맞아?" 같은 질문에 답할 수 없게 됩니다. 실제로 환경변수 동기화가 안 맞아 배포 후 서비스가 뻗는 사고를 겪었습니다. AWS SSM Parameter Store를 Single Source of Truth로 삼고 CI/CD에 통합한 전략을 정리합니다.

## 문제 정의

모노레포에 3개 서비스가 있으면 환경변수 관리가 복잡해집니다. GitHub Secrets에 넣으면 키 이름이 충돌하고, `.env` 파일을 공유하면 시크릿이 유출 위험이 있고, 서비스별로 따로 관리하면 동기화가 깨집니다. "이 API 키가 어디에 정의되어 있지?"라는 질문에 즉답할 수 없다면 관리 체계가 잘못된 것입니다.

## 왜 SSM Parameter Store인가

| 대안 | 장점 | 핀구에 부적합한 이유 |
|---|---|---|
| HashiCorp Vault | 강력한 시크릿 관리, 동적 시크릿 | 셀프호스팅 필요, 소규모 팀(1-2명)에 인프라 오버헤드 과다 |
| AWS Secrets Manager | 자동 로테이션, Lambda 통합 | $0.40/secret/month, 50개 시크릿이면 월 $20. SSM은 무료 |
| GitHub Secrets | CI/CD 내장 통합 | 3개 서비스의 키 이름 충돌, 환경(prod/dev) 분리 어려움 |
| .env 파일 공유 | 간단 | 시크릿 유출 위험, 동기화 깨짐, "이 키 어디 정의됐지?" 답변 불가 |

SSM Parameter Store를 선택한 이유는 **무료 + 충분한 기능**입니다. 3개 서비스 × 2 환경 = 약 50개 파라미터를 Standard 티어(무료)로 관리합니다. SecureString으로 암호화, IAM 정책으로 접근 제어, AWS CLI로 간단히 조회 — 소규모 팀에 필요한 모든 것이 갖춰져 있습니다.

## SSM을 Single Source of Truth로

```mermaid
flowchart TB
    SSM[(AWS SSM<br/>Parameter Store)]

    SSM -->|/fingoo/prod/api/*| API[API 서비스<br/>NestJS]
    SSM -->|/fingoo/prod/ai/*| AI[AI 서비스<br/>FastAPI]
    SSM -->|/fingoo/prod/web/*| Web[Web 서비스<br/>Next.js]
    SSM -->|/fingoo/prod/infra/*| Infra[인프라<br/>SSH 키, 배포 설정]

    SSM -->|/fingoo/dev/api/*| DevAPI[Dev API]
    SSM -->|/fingoo/dev/ai/*| DevAI[Dev AI]
```

### 파라미터 경로 규칙

```
/fingoo/{env}/{service}/{KEY}

예시:
/fingoo/prod/api/DATABASE_URL
/fingoo/prod/ai/ANTHROPIC_API_KEY
/fingoo/prod/infra/DEPLOY_HOST
/fingoo/dev/api/DATABASE_URL
```

`env`(prod/dev)와 `service`(api/ai/web/infra)로 네임스페이스를 분리합니다. 같은 키 이름이라도 서비스별로 다른 값을 가질 수 있습니다.

### fetch-params.sh — SSM에서 환경변수 추출

```bash
#!/bin/bash
PREFIX="/fingoo/${ENV}/${SERVICE}/"

aws ssm get-parameters-by-path \
  --path "$PREFIX" \
  --with-decryption \
  --recursive \
  --region "ap-northeast-2" \
  --query 'Parameters[*].[Name,Value]' \
  --output text |
while IFS=$'\t' read -r name value; do
  key="${name#$PREFIX}"
  echo "${key}=${value}"
done
```

`--with-decryption`으로 SecureString 타입 파라미터도 복호화해서 가져옵니다. DB 비밀번호, API 키 같은 민감 정보는 SecureString으로 저장되어 암호화 상태로 보관됩니다.

### generate-compose-env.sh — Docker Compose 환경변수 생성

```mermaid
flowchart TB
    Script[generate-compose-env.sh] --> Infra[인프라 키 수집<br/>/fingoo/prod/infra/*]
    Script --> API[API 키 수집<br/>/fingoo/prod/api/*]
    Script --> AI[AI 키 수집<br/>/fingoo/prod/ai/*]

    Infra --> Dedup[중복 제거<br/>인프라 키 우선]
    API --> Dedup
    AI --> Dedup

    Dedup --> EnvFile[.env.compose 생성<br/>타임스탬프 포함]
    EnvFile --> Compose[docker-compose.prod.yml<br/>env_file 로드]
```

인프라 키를 먼저 수집하고, 각 서비스 키 중 인프라에 없는 것만 추가합니다. 이렇게 하면 공통 키(예: `REDIS_URL`)가 중복 정의되지 않습니다.

## CI/CD 파이프라인 통합

### 프로덕션 배포 (main → EC2)

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant AWS as AWS (OIDC)
    participant SSM as SSM Parameter Store
    participant EC2 as EC2 Instance
    participant Discord as Discord

    GH->>GH: main push 감지
    GH->>GH: 변경 경로 필터링<br/>(apps/api, apps/ai, infra 등)

    alt 백엔드 변경
        GH->>AWS: OIDC 인증<br/>(장기 크레덴셜 없음)
        GH->>SSM: 배포 설정 조회<br/>DEPLOY_HOST, SSH_KEY
        GH->>GH: Docker 이미지 빌드<br/>(api + ai)
        GH->>EC2: SSH로 이미지 전송<br/>(gzip 파이프)
        GH->>EC2: docker compose up -d
        GH->>EC2: 헬스체크<br/>curl /api/ && curl /ai/
        EC2-->>GH: 200 OK
    end

    alt 프론트엔드 변경
        GH->>SSM: Vercel 환경변수 동기화
        GH->>GH: Private fork에 push
        GH->>GH: PR 생성 + auto-merge
        Note over GH: Vercel Git 통합이<br/>자동 배포 트리거
    end

    GH->>Discord: 배포 결과 알림
```

### 핵심 보안: AWS OIDC 인증

GitHub Actions에서 AWS에 접근할 때 장기 Access Key를 사용하지 않습니다. OIDC(OpenID Connect) 토큰으로 임시 크레덴셜을 발급받아 사용합니다.

```yaml
- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::role/github-actions-role
    aws-region: ap-northeast-2
```

이 방식의 장점:
- GitHub Secrets에 AWS 키를 저장할 필요 없음
- 임시 토큰이므로 유출되어도 만료 후 무효화
- IAM Role로 최소 권한 원칙 적용

### 변경 감지 기반 조건부 배포

```mermaid
flowchart LR
    Push[main push] --> Filter[paths-filter]
    Filter -->|apps/api 변경| Backend[백엔드 배포]
    Filter -->|apps/ai 변경| Backend
    Filter -->|infra/ 변경| Backend
    Filter -->|apps/web 변경| Frontend[프론트엔드 배포]
    Filter -->|scripts/ 변경| Backend
    Filter -->|변경 없음| Skip[스킵]
```

API만 수정했는데 프론트엔드까지 재배포하면 시간과 비용이 낭비됩니다. `dorny/paths-filter`로 변경된 경로를 감지해 필요한 서비스만 배포합니다.

## Docker 멀티스테이지 빌드

### API (NestJS) Dockerfile

```mermaid
flowchart TB
    subgraph "Stage 1: Builder"
        S1A[turbo prune --scope=api] --> S1B[필요 파일만 추출]
    end

    subgraph "Stage 2: Installer"
        S1B --> S2A[npm ci + BuildKit 캐시]
        S2A --> S2B[turbo run build --filter=api]
        S2B --> S2C[npm prune --production]
    end

    subgraph "Stage 3: Runner"
        S2C --> S3A[빌드 결과물만 COPY]
        S3A --> S3B[non-root user: nestjs:1001]
        S3B --> S3C[max-old-space-size=4096]
    end
```

### AI (FastAPI) Dockerfile

```mermaid
flowchart TB
    subgraph "Stage 1: Builder"
        A1[Python 3.12 slim] --> A2[uv sync --no-dev --frozen]
    end

    subgraph "Stage 2: Runner"
        A2 --> A3[빌드된 패키지만 복사]
        A3 --> A4[uvicorn 실행<br/>port 8001]
    end
```

Python 서비스는 `uv`를 패키지 매니저로 사용합니다. `--frozen`으로 lockfile을 엄격히 따르고, `--no-dev`로 개발 의존성을 제외합니다.

## gzip 파이프 전송 vs Docker Registry

Docker 이미지 배포에 ECR(Elastic Container Registry)을 사용하지 않고, gzip 파이프로 직접 전송하는 방식을 선택했습니다.

```bash
# 빌드 → 압축 → SSH 전송 → 로드를 하나의 파이프로
docker save api:latest ai:latest | gzip | ssh deploy@$HOST 'docker load'
```

| 방식 | 월 비용 | 설정 복잡도 | 멀티 노드 |
|---|---|---|---|
| ECR + docker pull | $10-30 (스토리지 + 전송) | IAM + ECR 정책 설정 필요 | O |
| gzip 파이프 | **$0** | SSH 키만 있으면 됨 | X |

현재 단일 EC2 인스턴스에 배포하므로 gzip 파이프가 충분합니다. 이미지 크기도 gzip 압축으로 평균 500MB → 150MB (70% 압축)로 전송 시간이 약 1분입니다.

단점: 멀티 노드 배포 시 각 노드에 개별 전송해야 합니다. 노드가 3대 이상으로 늘면 ECR로 전환할 계획이지만, 현재 단일 노드 환경에서는 비용 제로의 gzip 파이프가 실용적입니다.

### 프론트엔드: Private Fork 배포 패턴

Vercel 배포를 위해 Private Fork를 활용하는 독특한 패턴입니다.

```mermaid
flowchart LR
    Main[메인 레포<br/>main push] --> Sync[Private Fork에<br/>코드 동기화]
    Sync --> PR[PR 생성]
    PR --> Merge[Auto-merge]
    Merge --> Vercel[Vercel Git 통합<br/>자동 배포]
```

왜 직접 Vercel API를 호출하지 않는가? Vercel의 Git 통합 기능(Preview Deploy, 브랜치별 환경변수 등)을 그대로 활용하면서, 배포 트리거를 CI/CD에서 제어하기 위함입니다.

## Vercel 환경변수 SSM 동기화

Vercel의 환경변수도 SSM에서 관리합니다. CI/CD에서 SSM의 web 파라미터를 Vercel에 동기화하고, SSM에 없는 Vercel 변수는 자동 삭제합니다.

```mermaid
flowchart TB
    SSM[SSM<br/>/fingoo/prod/web/*] --> Sync[동기화 스크립트]
    Vercel[Vercel 현재 환경변수] --> Sync

    Sync --> Compare{비교}
    Compare -->|SSM에 있고 Vercel에 없음| Add[Vercel에 추가]
    Compare -->|값이 다름| Update[Vercel에 업데이트]
    Compare -->|Vercel에만 있음| Delete[Vercel에서 삭제]
```

이렇게 하면 SSM이 유일한 진실의 원천(Single Source of Truth)이 됩니다. "이 환경변수 어디에 있지?"에 대한 답은 항상 "SSM"입니다.

## 트러블슈팅: Vercel 환경변수 동기화 실패

### 문제

SSM → Vercel 동기화 스크립트 실행 후, Vercel 배포가 실패했습니다. 원인은 `VERCEL_URL`, `VERCEL_ENV` 같은 **Vercel 시스템 변수**가 동기화 스크립트에 의해 삭제된 것이었습니다.

### 원인 분석

동기화 스크립트가 SSM을 유일한 source of truth로 간주하고, "SSM에 없는 Vercel 변수는 삭제"하는 로직이 Vercel 시스템 변수까지 삭제했습니다.

### 해결

```python
# 보호 목록 — 동기화에서 제외할 Vercel 시스템 변수
PROTECTED_PREFIXES = ["VERCEL_", "NEXT_RUNTIME_"]

def should_sync(key: str) -> bool:
    return not any(key.startswith(prefix) for prefix in PROTECTED_PREFIXES)
```

`VERCEL_` 접두사가 붙은 시스템 변수는 동기화 대상에서 제외합니다. 추가로 보호 목록을 SSM의 `/fingoo/prod/infra/SYNC_PROTECTED_KEYS`에 관리하여, 코드 수정 없이도 보호 대상을 추가할 수 있게 했습니다.

**결과**: 동기화 실패율 0%, SSM이 진정한 Single Source of Truth로 동작하면서도 Vercel 시스템 변수는 보호.

## 핵심 인사이트

- **SSM 중앙화 = "여기만 보면 됨"**: 환경변수가 GitHub Secrets, Vercel, EC2 `.env`에 분산되면 "이 키 어디 있지?"에 답할 수 없음. SSM을 유일한 출처로 삼으면 50개 파라미터를 한 곳에서 관리
- **OIDC > Access Key**: OIDC 임시 토큰은 15분 후 만료. 장기 크레덴셜 유출 시 피해가 무제한인 반면, OIDC는 최악의 경우에도 15분 노출. 보안 사고의 blast radius를 최소화
- **gzip 파이프 = 실용적 미니멀리즘**: ECR 없이도 `docker save | gzip | ssh docker load`로 충분히 실용적인 배포. 월 비용 $0, 전송 70% 압축. 인프라는 필요할 때 확장
- **변경 감지 = 비용 절감**: paths-filter로 변경된 서비스만 배포하면 불필요한 빌드/배포 50% 감소. 모노레포에서 전체 빌드는 시간과 비용의 낭비
- **동기화의 함정**: 자동화 스크립트가 "없는 것은 삭제"하는 로직이면, 보호해야 할 대상(시스템 변수)까지 삭제할 수 있음. 보호 목록을 명시적으로 관리하는 것이 방어적 자동화의 핵심
- **Private Fork 패턴**: Vercel의 Git 통합(Preview Deploy, 브랜치별 환경변수)과 CI/CD 제어를 양립시키는 실용적 방법. 직접 Vercel API를 호출하면 이 장점을 잃음
