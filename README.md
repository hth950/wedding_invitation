# Wedding Invitation Concept Lab

개인 모바일 청첩장을 만들기 전에 레퍼런스를 비교하고 방향을 고르기 위한 세 가지 시안 대기용 앱입니다. 현재 이름, 날짜, 장소, 이미지와 문구는 모두 가상 예시이며 최종 콘텐츠가 아닙니다.

## 시안 URL

| URL | 방향 |
| --- | --- |
| `/` | 세 시안 링크 허브 |
| `/concept-a` | Black Cinema — 영화 포스터와 챕터형 서사 |
| `/concept-b` | Peach Family Archive — 가족사진과 손편지 기록물 |
| `/concept-c` | Minimal Handwritten Editorial — 여백과 손글씨 중심 편집물 |

모든 시안은 모바일 우선으로 설계했으며 데스크톱에서는 약 420px 너비로 가운데 표시됩니다. 알 수 없는 경로에는 앱 내부 404 안내가 표시됩니다.

## 로컬 실행

Node.js 22 이상을 권장합니다.

```bash
npm ci
npm run dev
```

검증 명령:

```bash
npm run check
```

## Docker 실행

```bash
APP_COMMIT_SHA="$(git rev-parse HEAD)" docker compose build
APP_COMMIT_SHA="$(git rev-parse HEAD)" docker compose up -d
docker compose ps
curl --fail http://127.0.0.1:32778/healthz
```

- Compose 프로젝트명: `wedding-invitation`
- 컨테이너명: `wedding-invitation-web-1`
- 전용 네트워크: `wedding-invitation-internal`
- 호스트 바인딩: `127.0.0.1:32778` (외부 인터페이스에 직접 공개하지 않음)
- 컨테이너 상태 확인: `/healthz`

## hermes-vps 배포 원칙

배포 경로는 `/srv/wedding-invitation`을 사용하고, 테스트를 통과한 정확한 Git commit SHA만 checkout/build합니다. 이 프로젝트의 소스, 설정, 출력물, 백업과 네트워크는 모두 독립적으로 유지합니다.

운영 변경 전에는 다음을 반드시 확인합니다.

1. `127.0.0.1:32778`이 비어 있는지 읽기 전용으로 재확인합니다.
2. 배포할 commit SHA에서 `npm run check`가 통과했는지 확인합니다.
3. `APP_COMMIT_SHA=<검증한 SHA> docker compose up -d --build`는 `/srv/wedding-invitation`에서만 실행합니다.
4. `/healthz`와 세 시안 경로를 모두 확인합니다.
5. 다른 Compose 프로젝트나 컨테이너에는 어떤 명령도 실행하지 않습니다.

## 향후 Tailscale 공개 메모

현재 앱의 loopback 원본은 `http://127.0.0.1:32778`입니다. 외부 공개가 필요할 때는 **기존 서비스와 겹치지 않는 별도 HTTPS/Funnel 포트 `10000`**을 사용할 예정입니다.

```text
# 운영 계획 메모 — 지금 실행하지 않음
# 별도 Funnel :10000  ->  http://127.0.0.1:32778
# 실제 명령은 배포 당일 설치된 Tailscale 버전의 `tailscale funnel --help`로 확인하고,
# 사용자 승인 후 wedding-invitation 대상만 추가한다.
```

기존 Funnel 설정을 덮어쓰거나 Traefik, 방화벽, SSH, 기존 서비스 설정을 변경하지 않습니다. Tailscale 변경이 필요하면 실행 전에 사용자에게 영향 범위와 정확한 명령을 먼저 공유합니다.

## 현재 단계

현재 페이지들은 최종 디자인이 아닌 **레퍼런스 반영 대기용 초안**입니다. 새로운 시안 링크나 이미지를 받은 뒤 각 레퍼런스의 장점만 분석하여 세 방향을 우리만의 구성으로 다시 발전시킵니다.
