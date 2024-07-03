<p align="center">
  <img src="./logo.webp" />
</p>

<p align="center">
  항해 플러스 백엔드 5기 (19조).
</p>

## Projects

프로젝트 일정은 <a href="https://github.com/users/boy672820/projects/4">Github Projects</a>에서 확인하실 수 있습니다.

## Description

- `콘서트 예약 서비스`를 구현해 봅니다.
- 대기열 시스템을 구축하고, 예약 서비스는 작업가능한 유저만 수행할 수 있도록 해야합니다.
- 사용자는 좌석예약 시에 미리 충전한 잔액을 이용합니다.
- 좌석 예약 요청시에, 결제가 이루어지지 않더라도 일정 시간동안 다른 유저가 해당 좌석에 접근할 수 없도록 합니다.

## Requirements

- 아래 5가지 API 를 구현합니다.
  - 유저 토큰 발급 API
  - 예약 가능 날짜 / 좌석 API
  - 좌석 예약 요청 API
  - 잔액 충전 / 조회 API
  - 결제 API
- 각 기능 및 제약사항에 대해 단위 테스트를 반드시 하나 이상 작성하도록 합니다.
- 다수의 인스턴스로 어플리케이션이 동작하더라도 기능에 문제가 없도록 작성하도록 합니다.
- 동시성 이슈를 고려하여 구현합니다.
- 대기열 개념을 고려해 구현합니다.

# 요구사항 분석

## 목차

 - [예약가능 날짜 ∙ 좌석 조회 API](#예약가능-날짜--좌석-조회-api)
 - [잔액 충전 ∙ 조회 API](#잔액-충전--조회-api)
 - [대기열 토큰 발급 후 예약 API](#대기열-토큰-발급-후-예약-api)
 - [예약 결제 API](#예약-결제-api)
 - [대기열 토큰 발행 API](#대기열-토큰-발행-api)
 - [대기열 검증 API](#대기열-검증-api)

## 예약가능 날짜 ∙ 좌석 조회 API

- 예약가능한 날짜와 해당 날짜의 좌석을 조회하는 API 를 각각 작성합니다.
- 예약 가능한 날짜 목록을 조회할 수 있습니다.
- 날짜 정보를 입력받아 예약가능한 좌석정보를 조회할 수 있습니다.

> 좌석 정보는 1 ~ 50 까지의 좌석번호로 관리됩니다.

```mermaid
sequenceDiagram

actor u as 사용자

participant availableDates as GET /schedules/available
participant seatsByDate as GET /schedules/:date/seats
participant t as Schedule

u->>+availableDates: 예약가능 날짜 조회 요청
availableDates->>+t: 예약 가능 날짜 조회
t-->>-availableDates: 예약 가능 날짜 반환
availableDates-->>-u: HTTP/1.1 200 OK<br />Content-Type: application/json<br /><br />{ "dates": ["2024-07-03"] }

u->>+seatsByDate: 해당 날짜에 예약가능한 좌석 조회 요청
seatsByDate->>+t: 예약가능한 좌석 조회
t-->>-seatsByDate: (1~50까지의 번호) 예약가능한 좌석 반환
seatsByDate-->>-u: HTTP/1.1 200 OK<br />Content-Type: application/json<br /><br />{ "seats": [1, 2, 3, 4, 5, ...] }
```

## 잔액 충전 ∙ 조회 API

- 결제에 사용될 금액을 API 를 통해 충전하는 API 를 작성합니다.
- 사용자 식별자 및 충전할 금액을 받아 잔액을 충전합니다.
- 사용자 식별자를 통해 해당 사용자의 잔액을 조회합니다.

```mermaid
sequenceDiagram

actor u as 사용자

participant balanceApi as GET /users/account/balance
participant chargeApi as PATCH /users/account/charge
participant account as Account

u->>+balanceApi: 계정 잔액 조회 요청<br />"GET /users/account/balance<br />Authorization: Bearer {userToken}"
balanceApi->>+account: 계정 잔액 조회
account->>account: 계정 조회
  alt 계정이 존재하지 않음
    account-->>balanceApi: Throw UnauthorizedException
    balanceApi-->>u: HTTP/1.1 401 Unauthorized<br /><br />계정이 존재하지 않습니다.
  else 계정이 존재할 경우
    account-->>-balanceApi: 계정 잔액 반환
    balanceApi-->>-u: HTTP/1.1 200 OK<br />Content-Type: application/json<br /><br />{ "balance": 1000 }
  end

u->>+chargeApi: 계정 잔액 충전 요청<br />"PATCH /users/account/charge<br />Authorization: Bearer {base64}<br /><br />{ "amount": 100 }"
chargeApi->>+account: 잔액 충전
account->>account: 계정 조회
  alt 계정이 존재하지 않음
    account-->>chargeApi: Throw UnauthorizedException
    chargeApi-->>u: HTTP/1.1 401 Unauthorized<br /><br />계정이 존재하지 않습니다.
  else 계정이 존재할 경우
    account->>account: account.balance += amount
    account-->>-chargeApi: 잔액 충전 완료
    chargeApi-->>-u: HTTP/1.1 204 No Content<br />Content-Type: application/json
  end
```

## 대기열 토큰 발급 후 예약 API

### 대기열 토큰 발급

- 서비스를 이용할 토큰을 발급받는 API를 작성합니다.
- 토큰은 유저의 UUID 와 해당 유저의 대기열을 관리할 수 있는 정보 ( 대기 순서 or 잔여 시간 등 )를 포함합니다.
- 이후 모든 API 는 위 토큰을 이용해 대기열 검증을 통과해야 이용 가능합니다.

### 좌석 예약

- 날짜와 좌석 정보를 입력받아 좌석을 예약 처리하는 API 를 작성합니다.
- 좌석 예약과 동시에 해당 좌석은 그 유저에게 약 5분간 임시 배정됩니다. ( 시간은 정책에 따라 자율적으로 정의합니다. )
- 만약 배정 시간 내에 결제가 완료되지 않는다면 좌석에 대한 임시 배정은 해제되어야 하며 다른 사용자는 예약할 수 없어야 합니다.

> 기본적으로 폴링으로 본인의 대기열을 확인한다고 가정하며, 다른 방안 또한 고려해보고 구현해 볼 수 있습니다.

```mermaid
sequenceDiagram

actor u as 사용자

participant token as POST /queue-token
participant queue as Queue
participant reserve as POST /reservations
participant schedule as Schedule
participant seat as Seat
participant reservation as Reservation

u->>+token: 대기열 토큰 생성 요청<br />"POST /queue-token<br />Authorization: Bearer {base64}"
token->>+queue: Enqueue()
queue->>queue: 대기열 토큰 생성
queue-->>-token: 대기열 토큰 반환
token-->>-u: HTTP/1.1 201 Created<br />Content-Type: application/json<br />{ "queueToken": "..." }

u->>+reserve: 좌석 예약 요청<br />"POST /schedules/:date/seats/:seatNumber/reservations<br />Authorization: Bearer {queueToken}"
reserve->>+reserve: 대기열 토큰이 존재하는가?
  alt 대기열 토큰이 존재하지 않을 경우
    reserve-->>-u: HTTP/1.1 403 Forbidden<br />대기열 토큰이 존재하지 않습니다.
  end
reserve->>+queue: 내 차례임?
  alt 아직 순서가 아닐 경우
    queue-->>-reserve: ㄴㄴ 너 차례아님
    reserve-->>u: HTTP/1.1 429 Too Many Requests<br />아직 대기 순서가 아닙니다. 나중에 다시 시도해주세요.
  end

reserve->>+schedule: 해당 날짜의 좌석 조회

  alt 예약 가능일이 아님
    schedule-->>reserve: Throw UnprocessableException
    reserve-->>u: HTTP/1.1 422 Unprocessable Content<br />해당 날짜는 예약이 불가능합니다.
  else 이미 예약되어 예약할 수 없음
    schedule-->>reserve: Throw  ConflictException
    reserve-->>u: HTTP/1.1 409 Conflict<br />이미 예약된 좌석입니다.
  end

schedule->>+seat: 좌석 임시 배정
seat->>+reservation: 예약내역 생성
reservation-->>-seat: 예약 생성 완료
seat-->>-schedule: 임시배정 완료

schedule-->>-reserve: 임시배정 및 예약 정보

reserve-->>-u: HTTP/1.1 201 Created<br />Content-Type: application/json<br /><br />{ "reservationId": "1", "schedule": "2024-07-03", "seat": 1 }

alt 예약 후 5분이 지나면 임시 배정 해제
  seat->>+seat: 임시배정 시간 만료
  seat->>+reservation: 예약내역 삭제
  reservation-->>-seat: 삭제 완료
  seat->>-seat: 임시배정 해제
end
```

## 예약 결제 API

- 결제 처리하고 결제 내역을 생성하는 API 를 작성합니다.
- 결제가 완료되면 해당 좌석의 소유권을 유저에게 배정하고 대기열 토큰을 만료시킵니다.

```mermaid
sequenceDiagram

actor u as 사용자

participant api as POST /reservations/:reservationId/pay
participant r as Reservation
participant p as Payment
participant q as Queue

u->>+api: 예약 좌석 결제<br />"POST /reservations/:reservationId/pay

api->>+r: 예약 조회
  alt 예약이 존재하지 않을 경우
    r->>api: Throw NotFoundException
    api->>u: HTTP/1.1 404 Not Found<br />Content-Type: application/json<br /><br />결제할 예약 건을 찾을 수 없습니다.
  end
r->>+p: 결제 요청
p->>p: 결제 처리
p->>-r: 결제 완료
r->>r: 예약 완료 처리
r-->>+q: (이벤트) 대기열 토큰 만료 요청
r->>-api: 예약 내역
q->>-q: 대기열 토큰 만료 처리
api-->>-u: HTTP/1.1  201 Created<br />Content-Type: application/json<br /><br />{ "reservationId": 1 }
```

## 대기열 토큰 발행 API

```mermaid
sequenceDiagram

actor u as 사용자

participant api as POST /queue-token
participant q as 대기열 시스템
participant db as 데이터베이스

u->>+api: 토큰 발행<br />"POST /queue-token<br />Authroization: Bearer {userToken}"
api->>+q: 대기열 토큰 발행 요청
q->>+db: 해당 유저의 대기열 토큰 조회
db-->>-q: 대기열 토큰 반환
alt 토큰이 만료되지 않았을 경우
  q-->>api: 예외처리: "대기열 토큰이 만료되지 않았습니다."
  api-->>u: HTTP/1.1 403 Forbidden<br />대기열 토큰을 생성할 수 없습니다.(Token Alive)
else 토큰이 만료되었을 경우
  q->>q: 대기열 토큰 생성
  q->>+db: 대기열에 유저 생성
  db->>db: 유저 순번과 만료시간(1분) 부여
  db-->>-q: 생성 성공
  q->>q: 토큰에 순번 부여<br />(base64(ulid, sequence))
  q-->>-api: 대기열 토큰 반환
  api-->>-u: HTTP/1.1 201 Created<br />Content-Type: application/json<br /><br />{ "queueToken": base64 }
end
```

## 대기열 검증 API

>[!INFO]
>대기열 검증에서 [예약 API](#좌석-예약)에서 요청이 이루어졌을 때, 대기열 토큰을 이용한 검증이 어떻게 이루어지는지 자세하게 설명합니다.

```mermaid
sequenceDiagram

actor u as 사용자

participant api as API
participant q as 대기열 시스템
participant db as 데이터베이스
participant s as 스케줄링

u->>+api: HTTP Request<br />Authorization: Bearer {queueToken}
api->>+q: queueToken 검증
q->>+db: 대기열에서 사용자 조회
db-->>-q: 첫번째 사용자 반환
q->>q: 대기열의 첫번째 사용자가 요청한 사용자인가?
alt ❌ 대기열 첫번째 사용자가 요청한 사용자가 아님
  q->>api: 아직 순번이 아님
  api->>u: HTTP/1.1 429 Too Many Requests<br />Retry-After: Maybe 60?<br />아직 순번이 아닙니다. 1분 정도 기다렸다가 다시 요청하세요.
else ✅
q->>-api: 얘 차례 맞음
api-->>-u: HTTP Response
end
s->>+s: 스케줄링 작업
s->>+db: 대기열의 첫번째 사용자 조회
db->>-s: 첫번째 사용자 반환
alt 첫번째 사용자가 만료시간이 초과됨
  s->>+db: 토큰 파기
  s->>s: 매초마다 새로운 스케줄링을 생성
else 만료시간이 초과되지 않음
  s->>s: 첫번째 사용자의 남은 시간만큼 새로운 스케줄링을 생성<br />예를 들어, 만료까지 30초정도 남았으면 30초 지나서 다시 체크하는 식으로 스케줄링을 조정함
end
s->>-s: 작업 종료
```