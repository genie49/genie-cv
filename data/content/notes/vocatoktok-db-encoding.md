# EUC-KR 데이터베이스와의 사투

한국의 오래된 웹 서비스를 운영해 본 사람이라면 EUC-KR이라는 단어에 반사적으로 한숨이 나올 것입니다. 2000년대 초반 구축된 시스템들은 거의 예외 없이 EUC-KR(또는 CP949)로 데이터를 저장했고, VocaTokTok도 예외가 아니었습니다. 10년 넘게 운영된 MySQL 데이터베이스에는 수만 건의 영어 단어와 한글 뜻이 EUC-KR로 인코딩되어 있었습니다. Next.js + Prisma로 전면 리빌드하면서 이 인코딩 문제를 어떻게 해결했는지 정리합니다.

## 문제 상황

VocaTokTok의 구 시스템은 PHP + MySQL 5.x 조합이었습니다. 테이블의 기본 캐릭터셋은 `euckr`, 커넥션 charset도 `euckr`로 설정되어 있었습니다.

| 항목 | 구 시스템 | 목표 |
|---|---|---|
| MySQL 버전 | 5.x | 8.x |
| 캐릭터셋 | euckr / cp949 | utf8mb4 |
| 콜레이션 | euckr_korean_ci | utf8mb4_unicode_ci |
| 한글 저장 | 2byte per char | 3byte per char |
| 이모지 지원 | X | O (utf8mb4) |
| 다국어 지원 | X (한/영만) | O (일본어, 중국어 등) |

문제는 단순히 "한글이 깨진다"에 그치지 않았습니다.

1. **다국어 확장 불가**: VocaTokTok은 영어 학습에서 다국어 학습(`multilingual_base`, `multilingual_total` 테이블)으로 확장하고 있었는데, EUC-KR은 한국어와 영어만 표현 가능합니다. 일본어 가나, 중국어 한자 간체를 저장하려면 UTF-8이 필수였습니다.
2. **Prisma 호환성**: Prisma는 기본적으로 UTF-8 연결을 기대합니다. EUC-KR 데이터베이스에 Prisma를 직접 연결하면 한글 필드가 모두 깨져서 조회됩니다.
3. **CSV/텍스트 파일 임포트**: 학원 관리자들이 업로드하는 단어장 CSV 파일이 EUC-KR로 저장된 경우가 대부분이었습니다. Windows의 Excel이 한글 CSV를 EUC-KR로 내보내기 때문입니다.

## 마이그레이션 계획

DB 인코딩 전환은 데이터 손실 위험이 크기 때문에 단계적으로 진행했습니다.

```mermaid
flowchart LR
    subgraph "1단계: 백업"
        A1[구 MySQL 5.x<br/>euckr] --> A2[mysqldump<br/>--default-character-set=euckr]
        A2 --> A3[dump.sql<br/>EUC-KR 인코딩]
    end

    subgraph "2단계: 변환"
        A3 --> B1[iconv -f euckr -t utf-8<br/>dump_utf8.sql]
        B1 --> B2[sed로 charset 선언 치환<br/>euckr → utf8mb4]
    end

    subgraph "3단계: 복원"
        B2 --> C1[신규 MySQL 8.x<br/>utf8mb4]
        C1 --> C2[Prisma db pull<br/>스키마 재추출]
        C2 --> C3[데이터 검증<br/>한글 깨짐 확인]
    end
```

핵심은 **덤프 시점의 character set 명시**입니다. `mysqldump`에 `--default-character-set=euckr`을 빠뜨리면 덤프 자체가 이중 인코딩(double encoding)된 상태로 생성됩니다.

## EUC-KR에서 UTF-8 전환의 함정

### 함정 1: 이중 인코딩 (Double Encoding)

가장 흔하고 가장 치명적인 문제입니다. MySQL의 `character_set_client`, `character_set_connection`, `character_set_results` 중 하나라도 실제 데이터와 불일치하면 이중 인코딩이 발생합니다.

```
원본 한글: "사과"
EUC-KR 바이트: 0xBB E7 0xB0 FA
↓ MySQL이 이걸 latin1으로 해석
UTF-8로 재인코딩: 0xC2 BB 0xC3 A7 0xC2 B0 0xC3 BA
↓ 결과
깨진 문자: "»ç°ú"
```

이 상태에서 다시 `iconv -f utf-8 -t euckr`로 되돌려도 원본 복구가 불가능합니다. 이중 인코딩된 데이터는 `iconv`가 유효한 UTF-8로 인식하기 때문입니다.

### 함정 2: CP949 확장 영역

EUC-KR과 CP949는 다릅니다. CP949(= MS949)는 EUC-KR의 상위 집합으로, EUC-KR에 없는 한글 8,822자를 추가로 포함합니다. "뷁", "쀍" 같은 글자는 EUC-KR에 없지만 CP949에는 있습니다. 구 시스템이 EUC-KR이라고 선언했더라도 실제 데이터에는 CP949 확장 영역 글자가 섞여 있을 수 있습니다.

```bash
# EUC-KR로 변환 시도 → CP949 영역 글자에서 실패
iconv -f euckr -t utf-8 dump.sql > dump_utf8.sql
# iconv: illegal input sequence at position 234567

# CP949로 변환하면 성공
iconv -f cp949 -t utf-8 dump.sql > dump_utf8.sql
```

### 함정 3: NULL 바이트와 제어 문자

10년간 쌓인 데이터에는 예상치 못한 바이트가 섞여 있습니다. 복사-붙여넣기 과정에서 들어간 제어 문자(0x00~0x1F), 워드프로세서에서 넘어온 특수 따옴표(" "), 반각/전각 공백 혼재 등. 이런 바이트들은 인코딩 변환 시 에러를 발생시키거나, 변환은 되지만 애플리케이션에서 파싱 오류를 유발합니다.

### 검증 전략

```bash
# 1. 변환 후 한글 패턴 검증 — UTF-8 한글은 3바이트(0xEA~0xED로 시작)
grep -P '[\xEA-\xED][\x80-\xBF][\x80-\xBF]' dump_utf8.sql | head -20

# 2. 주요 테이블의 샘플 데이터 확인
mysql -u root -e "SELECT eng, kor FROM cham_wordtotal LIMIT 10;"

# 3. 깨진 문자 패턴 탐지 (이중 인코딩의 흔적)
grep -P '[\xC2-\xC3][\x80-\xBF]{2,}' dump_utf8.sql
```

변환 후에는 반드시 `cham_wordtotal` 테이블의 `eng`, `kor` 컬럼과 `cham_member`의 `name` 컬럼을 육안으로 확인했습니다. 이 테이블들이 가장 많은 한글 데이터를 담고 있기 때문입니다.

## 런타임 인코딩 처리

DB 마이그레이션과 별개로, **사용자가 업로드하는 파일**의 인코딩 문제도 해결해야 했습니다. 학원 관리자들이 단어장을 CSV나 텍스트 파일로 업로드하는데, Windows Excel에서 내보낸 CSV는 대부분 EUC-KR입니다.

### jschardet로 인코딩 감지 + iconv-lite로 변환

```typescript
import jschardet from "jschardet";
import iconv from "iconv-lite";

// 파일 업로드 시 인코딩 자동 감지
const arrayBuffer = e.target?.result as ArrayBuffer;
const uint8Array = new Uint8Array(arrayBuffer);
const buffer = Buffer.from(uint8Array);

// 1. jschardet으로 인코딩 추정
const detected = jschardet.detect(buffer);

let content = "";
if (detected.encoding) {
  try {
    // 2. 감지된 인코딩으로 디코딩
    content = iconv.decode(buffer, detected.encoding);
  } catch (error) {
    // 3. 실패 시 UTF-8 폴백
    content = iconv.decode(buffer, "utf-8");
  }
} else {
  // 4. 감지 실패 시 후보 인코딩 순차 시도
  const encodings = ["utf-8", "euc-kr", "cp949", "iso-8859-1"];
  for (const encoding of encodings) {
    try {
      content = iconv.decode(buffer, encoding);
      if (content && !content.includes("\uFFFD")) {
        break;  // 깨진 문자(U+FFFD)가 없으면 성공
      }
    } catch (error) {
      continue;
    }
  }
}
```

이 패턴은 VocaTokTok의 단어 임포트(`ImportFromFolderModal`), 커스텀 단어장 임포트(`ImportFromSingleFolderModal`) 등 파일 업로드가 있는 모든 곳에 동일하게 적용했습니다.

### 엣지 케이스: jschardet의 한계

| 상황 | jschardet 결과 | 실제 | 대응 |
|---|---|---|---|
| 짧은 텍스트 (10자 미만) | confidence < 0.5 | 판별 불가 | 후보 순차 시도 |
| 영어만 있는 파일 | ASCII | ASCII (= UTF-8 호환) | 그대로 사용 |
| BOM 있는 UTF-8 | UTF-8-BOM | UTF-8 | BOM 제거 후 처리 |
| EUC-KR과 CP949 혼재 | EUC-KR | CP949 영역 포함 | `cp949`로 재시도 |

jschardet의 인코딩 감지는 확률적입니다. 특히 파일이 짧거나 한글 비율이 낮으면 오탐이 발생합니다. 그래서 감지 결과를 맹신하지 않고, **디코딩 결과에 U+FFFD(replacement character)가 포함되어 있으면 다음 후보로 넘어가는** 방어 로직을 추가했습니다.

### Prisma 연결 시 charset 설정

DB를 UTF-8로 전환한 후에는 Prisma의 DATABASE_URL에 charset을 명시합니다.

```
DATABASE_URL="mysql://user:password@host:3306/dbname?charset=utf8mb4"
```

Prisma schema에서 `provider = "mysql"`로 선언하고, 연결 URL에 `charset=utf8mb4`를 명시하면 Prisma가 커넥션 수준에서 `SET NAMES utf8mb4`를 실행합니다. 이후 `prisma db pull`로 스키마를 재추출하면 `@db.VarChar`, `@db.Text` 등의 타입이 정상적으로 매핑됩니다.

## 배운 점

- **덤프 시 character set을 반드시 명시**: `mysqldump --default-character-set=euckr`을 빠뜨리면 이중 인코딩이 발생하고, 복구가 거의 불가능합니다. 덤프 전에 `SHOW VARIABLES LIKE 'character_set%'`로 서버 설정을 반드시 확인
- **EUC-KR이라고 쓰고 CP949로 읽어라**: 한국의 레거시 시스템이 "EUC-KR"이라고 선언한 것은 대부분 실제로는 CP949입니다. `iconv`에서 `-f cp949`를 먼저 시도하는 것이 안전
- **인코딩 감지는 확률이지 확신이 아님**: jschardet, chardet 등의 감지 라이브러리는 통계 기반입니다. 짧은 텍스트에서는 오탐율이 높으므로, 감지 실패 시 후보 인코딩을 순차 시도하는 폴백 체인이 필수
- **U+FFFD가 검증의 열쇠**: 디코딩 결과에 replacement character(U+FFFD)가 하나라도 있으면 인코딩이 잘못된 것입니다. 이 한 글자를 체크하는 것만으로 대부분의 인코딩 오류를 잡을 수 있음
- **utf8mb4는 utf8이 아님**: MySQL의 `utf8`은 3바이트로 BMP만 지원합니다. 이모지(4바이트)를 저장하려면 반드시 `utf8mb4`를 사용해야 합니다. 2024년 이후 시스템이라면 `utf8mb4_unicode_ci`가 기본
- **런타임 인코딩 처리는 DB 마이그레이션과 별개**: DB를 UTF-8로 전환해도 사용자가 업로드하는 파일은 여전히 EUC-KR일 수 있습니다. 파일 업로드 경로에는 항상 인코딩 감지 + 변환 로직이 필요
