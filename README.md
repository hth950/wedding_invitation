# Wedding Invitation Concept Lab

황태환·하효진의 모바일 청첩장을 세 가지 디자인 방향으로 비교하는 앱입니다. 이름, 예식 일시와 사진은 실제 자료를 사용하고 있으며, 아직 확정되지 않은 예식장 상세 정보·연락처·계좌·교통 안내는 화면에 `입력 예정`으로 표시합니다.

## 시안 URL

| URL | 방향 |
| --- | --- |
| `/` | 세 시안 링크 허브 |
| `/concept-a` | First Light Letter — 아이보리 종이와 핑크빛 편지 |
| `/concept-b` | Midnight Cinema — 차콜과 옥스블러드의 영화적 구성 |
| `/concept-c` | Anyang Modern Poster — 코발트와 레드의 현대 포스터 |

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

### 배경음악

음악은 자동 재생하지 않으며 사용자가 상단의 음악 버튼을 눌렀을 때만 시작합니다. 원본 음원이 준비되기 전에는 브라우저가 로컬에서 생성하는 잔잔한 멜로디를 사용합니다. 직접 제작했거나 정식 사용 권한을 보유한 음원으로 교체할 때는 `public/audio/`에 파일을 넣고 빌드 시 공개 경로를 지정합니다.

```bash
VITE_WEDDING_MUSIC_SRC=/audio/wedding-bgm.mp3 npm run build
```

재배포 가능한 라이선스가 확인되지 않은 타사 음원은 저장소에 추가하지 않습니다.

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

1. `127.0.0.1:32778`이 wedding-invitation 컨테이너에만 연결돼 있는지 읽기 전용으로 재확인합니다.
2. 배포할 commit SHA에서 `npm run check`가 통과했는지 확인합니다.
3. `APP_COMMIT_SHA=<검증한 SHA> docker compose up -d --build`는 `/srv/wedding-invitation`에서만 실행합니다.
4. `/healthz`와 세 시안 경로를 모두 확인합니다.
5. 다른 Compose 프로젝트나 컨테이너에는 어떤 명령도 실행하지 않습니다.

## 공개 주소

현재 공개 주소는 `https://hwangha-wedding.com/`이며 Cloudflare Tunnel이 wedding-invitation 전용 Docker 네트워크의 웹 컨테이너로 연결됩니다. loopback 원본 `http://127.0.0.1:32778`과 기존 Tailscale 테스트 주소 `:10000`은 다른 서비스와 분리해 유지합니다.

기존 Funnel 설정을 덮어쓰거나 Traefik, 방화벽, SSH, 기존 서비스 설정을 변경하지 않습니다. Tailscale 변경이 필요하면 실행 전에 사용자에게 영향 범위와 정확한 명령을 먼저 공유합니다.

## 현재 단계

현재 페이지들은 실제 사진을 적용한 **디자인 선택용 시안**입니다. 최종 방향을 고른 뒤 예식장 상세 정보, 가족·연락처·계좌, 교통·주차, 카카오 Developers 공유 키와 실제 RSVP 저장 방식을 순서대로 연결합니다.
