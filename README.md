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

## ERD 설계

`콘서트 예약 서비스`의 요구사항을 기반으로 설계된 ERD입니다.

| Table       | Summary     | Description                                                           |
| ----------- | ----------- | --------------------------------------------------------------------- |
| User        | 사용자 목록 |                                                                       |
| Point       | 보유 포인트 | 사용자가 보유하고 있는 포인트 테이블입니다.                           |
| Event       | 이벤트      | 콘서트 이외에 다른 목적으로 서비스가 확장될 경우를 염두해 두었습니다. |
| Schedule    | 예약 날짜   | 해당 이벤트가 예약할 수 있는 날짜 목록 테이블입니다.                  |
| Seat        | 좌석        | 좌석 테이블입니다.(1 ~ 50까지의 번호로 구성)                          |
| Reservation | 예약 정보   |                                                                       |
| Payment     | 결제 내역   | 예약이 완료될 경우 결제에 대한 정보가 생성됩니다.                     |

```mermaid
erDiagram

User {
  ulid id
  string nickname
  string email
  string phone
  datetime createdDate
  datetime updatedDate
}

Point {
  ulid userId
  decimal balance
  datetime updatedDate
}

Reservation {
  ulid id
  ulid userId
  ulid seatId
  ulid metaId
  enum status
  date scheduleDate
  uint seatNumber
  datetime reservedDate
  datetime expiredDate
}

ReservationMeta {
  ulid id
  ulid eventId
  string eventTitle
  string eventAddress
  date eventStartDate
  date eventEndDate
}

Payment {
  ulid reservationId
  decimal amount
  datetime paidDate
}

Event {
  ulid id
  string title
  string address
  date startDate
  date endDate
  datetime createdDate
  datetime updatedDate
}

Schedule {
  ulid id
  ulid eventId
  date date
}

Seat {
  ulid id
  ulid scheduleId
  uint seatNumber
  enum status
}

User ||--|| Point : has
Event ||--o{ Schedule : contains
Schedule ||--o{ Seat : contains
User |o--o{ Reservation : events
Reservation ||--|| ReservationMeta : meta
Reservation ||--|| Seat : check-in
Reservation |o--o| Payment : payments
```

# API Spec

**목차**

 - [예약가능 날짜 조회](#예약가능-날짜-조회)
 - [좌석 조회](#좌석-조회)
 - [잔액 조회](#잔액-조회)
 - [잔액 충전](#잔액-충전)
 - [대기열 토큰 발급](#대기열-토큰-발급)
 - [좌석 예약](#좌석-예약)
 - [예약 결제](#예약-결제)

## 예약가능 날짜 조회

### `GET /events/:eventId/schedules/available`

이벤트의 예약 가능한 날짜를 조회합니다.

#### Parameters

| Name      | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `eventId` | `string` | 특정 이벤트의 고유 식별자입니다. |

#### Example Request

```http
GET /events/01J1XK5P3WHGN9Z9Z9CE4W21SK/schedules/available HTTP/1.1
HOST: localhost:3000
```

#### 200 OK

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "schedules": [
      {
        "id": "01J1XK6493RX5NNJRANS982FNK",
        "eventId": "01J1XK5P3WHGN9Z9Z9CE4W21SK",
        "date": "2024-07-04"
      },
    ]
  }
}
```

#### 404 Not Found

`eventId`로 이벤트를 찾을 수 없을 경우 `404 Not Found`를 반환합니다.

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "Not Found",
  "error": "존재하지 않는 이벤트입니다."
}
```

## 좌석 조회

### `GET /schedules/:scheduleId/seats`

스케줄의 예약 가능한 좌석을 조회합니다.

#### Parameters

| Name         | Type     | Description                      |
| ------------ | -------- | -------------------------------- |
| `scheduleId` | `string` | 특정 스케줄의 고유 식별자입니다. |

#### Response Body

| Field            | Type                                       | Description |
| ---------------- | ------------------------------------------ | ----------- |
| `seats`          | `array`                                    | 좌석 목록   |
| `seats[].id`     | `string`                                   | 좌석 목록   |
| `seats[].number` | `number`                                   | 좌석 목록   |
| `seats[].status` | `"PENDING" \| "IN_PROGRESS" \| "COMPLTED"` | 좌석 목록   |

#### Example Request

```http
GET /schedules/01J1XK6493RX5NNJRANS982FNK/seats HTTP/1.1
HOST: localhost:3000
```

#### 200 OK

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "seats": [
      {
        "id": "01J1XT311VHMZTE1WX3MYJV28S"
        "number": 1,
        "status": "PENDING"
      }
    ]
  }
}
```

#### 404 Not Found

`scheduleId`로 스케줄을 찾을 수 없을 경우 `404 Not Found`를 반환합니다.

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "Not Found",
  "error": "존재하지 않는 스케줄입니다."
}
```

## 잔액 조회

### `GET /point`

내 잔액을 조회합니다.

#### Authorization

`Bearer` 토큰을 이용한 사용자 인증이 필요합니다.

```http
Authorization: Bearer {userToken}
```

#### Response Body

| Field     | Type      | Description   |
| --------- | --------- | ------------- |
| `balance` | `decimal` | 소유중인 금액 |

#### Example Request

```http
GET /point HTTP/1.1
HOST: localhost:3000
Authorization: Bearer {userToken}
```

#### 200 OK

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "balance": "20000.10"
  }
}
```

#### 401 Unauthorized

Authorization 인증 정보가 존재하지 않을 경우 발생하는 에러입니다.

```http
HTTP/1.1 401 Not Found
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

`Bearer` 토큰이 잘못되었거나 만료 또는 존재하지 않는 사용자 발생하는 에러입니다.

```http
HTTP/1.1 401 Not Found
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 잔액 충전

### `PATCH /point/charge`

내 잔액을 충전합니다.

#### Authorization

`Bearer` 토큰을 이용한 사용자 인증이 필요합니다.

```http
Authorization: Bearer {userToken}
```

#### Request Body

| Field    | Type      | Description |
| -------- | --------- | ----------- |
| `amount` | `decimal` | 충전할 금액 |

#### Response Body

| Field     | Type      | Description      |
| --------- | --------- | ---------------- |
| `balance` | `decimal` | 증가한 소유 금액 |

#### Example Request

```http
PATCH /point/charge HTTP/1.1
HOST: localhost:3000
Content-Type: application/json
Authorization: Bearer {userToken}

{
  "amount": "1000"
}
```

#### 200 OK

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "balance": "21000.10"
  }
}
```

#### 400 Bad Request

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "잘못된 형식의 금액을 입력하였습니다."
}
```

#### 401 Unauthorized

Authorization 인증 정보가 존재하지 않을 경우 발생하는 에러입니다.

```http
HTTP/1.1 401 Not Found
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

`Bearer` 토큰이 잘못되었거나 만료 또는 존재하지 않는 사용자 발생하는 에러입니다.

```http
HTTP/1.1 401 Not Found
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 대기열 토큰 발급

### `POST /queue-token`

대기열 토큰을 발행합니다.

대기열 토큰을 이용하여 대기열 서비스에 진입할 수 있습니다.

#### Authorization

`Bearer` 토큰을 이용한 사용자 인증이 필요합니다.

```http
Authorization: Bearer {userToken}
```

#### Response Body

| Field        | Type     | Description |
| ------------ | -------- | ----------- |
| `queueToken` | `string` | 대기열 토큰 |

#### Example Request

```http
POST /queue-token HTTP/1.1
HOST: localhost:3000
Authorization: Bearer {userToken}
```

#### 201 Created

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "queueToken": "..."
  }
}
```

#### 401 Unauthorized

Authorization 인증 정보가 존재하지 않을 경우 발생하는 에러입니다.

```http
HTTP/1.1 401 Not Found
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 403 Forbidden

`Bearer` 토큰이 잘못되었거나 만료 또는 존재하지 않는 사용자 발생하는 에러입니다.

```http
HTTP/1.1 401 Not Found
Content-Type: application/json

{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### 409 Conflict

이미 대기열 토큰을 발행했다면 에러가 발생합니다.

```http
HTTP/1.1 409 Conflict

{
  "status": 409,
  "message": "Conflict",
  "error": "이미 토큰을 발행하였습니다."
}
```

## 좌석 예약

### `POST /seats/:seatId/reservations`

좌석을 예약합니다.

예약된 좌석은 결제가 완료될 때까지 5분 동안 임시 할당됩니다.

5분안에 결제를 완료하지 못할 경우, 예약은 취소되고 임시 할당은 해제됩니다.

#### Parameters

| Name     | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| `seatId` | `string` | 예약할 좌석의 고유 식별자입니다. |

#### Authorization

`대기열 토큰`을 이용하여 사용자를 인증합니다.

```http
Authorization: Bearer {queueToken}
```

#### Response Body

| Field             | Type                        | Description        |
| ----------------- | --------------------------- | ------------------ |
| `id`              | `string`                    | 예약 고유 식별자   |
| `scheduleDate`    | `date`                      | 예약 날짜          |
| `seatNumber`      | `date`                      | 좌석 번호          |
| `status`          | `"TEMP_ASSIGNED" \| "PAID"` | 예약 상태          |
| `event`           | `object`                    | 이벤트             |
| `event.id`        | `string`                    | 이벤트 고유 식별자 |
| `event.title`     | `string`                    | 이벤트 제목        |
| `event.address`   | `string`                    | 이벤트 장소        |
| `event.startDate` | `string`                    | 이벤트 시작일      |
| `event.endDate`   | `string`                    | 이벤트 종료일      |
| `reservedDate`    | `datetime`                  | 예약일             |
| `expiredDate`     | `datetime`                  | 임시할당 만료 시간 |

#### Example Request

```http
POST /seats/01J1XT311VHMZTE1WX3MYJV28S/reservations HTTP/1.1
HOST: localhost:3000
Authorization: Bearer {queueToken}
```

#### 201 Created

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "id": "01J1Y5GHE6RD7PN324EMV0YJEK",
    "scheduleDate": "2024-07-22",
    "seatNumber": 1,
    "status": "TEMP_ASSIGNED",
    "event": {
      "id": "01J1XK5P3WHGN9Z9Z9CE4W21SK",
      "title": "뉴진스 팬 미팅, Bunnies Camp 2024 Tokyo Dome",
      "address": "Tokyo Dome Bunnes Camp",
      "startDate": "2024-07-01",
      "endDate": "2024-07-31"
    },
    "reservedDate": "2024-07-04T15:05:33Z",
    "expiredDate": "2024-07-04T15:10:33Z",
  }
}
```

#### 404 Not Found

`seatId`로 좌석을 찾을 수 없을 경우 에러를 반환합니다.

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "Not Found",
  "error": "지정된 좌석을 찾을 수 없습니다."
}
```

#### 409 Conflict

좌석이 이미 예약되었거나 임시 할당되어 있을 경우 예약할 수 없습니다.

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "statusCode": 409,
  "message": "Conflict",
  "error": "좌석이 이미 예약되었거나 임시 할당되어 있습니다."
}
```

## 예약 결제

### `POST /reservations/:reservationId/payments`

예약 건을 결제합니다.

결제가 끝나면 예약이 완료됩니다.

#### Parameters

| Name            | Type     | Description               |
| --------------- | -------- | ------------------------- |
| `reservationId` | `string` | 예약의 고유 식별자입니다. |

#### Authorization

`Bearer` 토큰을 이용한 사용자 인증이 필요합니다.

```http
Authorization: Bearer {userToken}
```

#### Response Body

| Field           | Type       | Description      |
| --------------- | ---------- | ---------------- |
| `reservationId` | `string`   | 예약 고유 식별자 |
| `amount`        | `decimal`  | 결제 금액        |
| `paidDate`      | `datetime` | 결제일           |

#### Example Request

```http
POST /reservations/01J1Y5GHE6RD7PN324EMV0YJEK/payments HTTP/1.1
HOST: localhost:3000
Authorization: Bearer {userToken}
```

#### 201 Created

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "OK",
  "message": "",
  "data": {
    "reservationId": "01J1Y5GHE6RD7PN324EMV0YJEK",
    "amount": "220000",
    "paidDate": "2024-07-04T15:10:33Z",
  }
}
```

#### 404 Not Found

`reservationId`로 예약을 찾을 수 없을 경우 에러를 반환합니다.

```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "statusCode": 404,
  "message": "Not Found",
  "error": "지정된 예약을 찾을 수 없습니다."
}
```

#### 422 Unprocessable Content

소유 잔액이 부족할 경우 예러를 반환합니다.

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/json

{
  "statusCode": 422,
  "message": "Unprocessable Content",
  "error": "소유 잔액이 결제 금액보다 부족합니다."
}
```
