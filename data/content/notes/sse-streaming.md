# SSE 스트리밍 구현기

ElysiaJS에서 Server-Sent Events를 활용한 실시간 채팅 스트리밍 구현 과정을 정리합니다.

## SSE vs WebSocket

채팅 응답은 서버→클라이언트 단방향 스트리밍이므로 SSE가 적합합니다. WebSocket은 양방향 통신이 필요할 때 사용하며, SSE는 HTTP 기반이라 구현이 간단하고 자동 재연결을 지원합니다.

## ElysiaJS에서의 구현

ElysiaJS는 Web Standard Response를 지원하므로 ReadableStream을 직접 반환할 수 있습니다.

```typescript
// SSE 응답 생성
const stream = new ReadableStream({
  async start(controller) {
    for await (const token of agent.stream(message)) {
      controller.enqueue(`data: ${JSON.stringify({ type: "token", data: token })}\n\n`);
    }
    controller.close();
  }
});
```

## 프론트엔드 수신

fetch API의 ReadableStream reader로 SSE 데이터를 파싱합니다. 토큰이 도착할 때마다 UI를 업데이트하여 타이핑 효과를 구현합니다.

## 이벤트 타입

- `token`: LLM이 생성한 토큰 단위 텍스트
- `citations`: 응답 완료 후 인용 정보 배열
- `done`: 스트리밍 종료 신호
- `error`: 에러 발생 시 에러 메시지

## 인사이트

- SSE는 `text/event-stream` Content-Type 필수
- 버퍼링 이슈를 방지하려면 각 이벤트 후 `\n\n`으로 구분
- CORS 설정에서 SSE 엔드포인트도 허용해야 함
