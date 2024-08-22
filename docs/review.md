---
marp: true
paginate: true
size: 16:9
backgroundColor: black
color: white
style: |
  header {
    position: absolute;
    right: 24px;
    color: red;
    font-style: italic;
    font-weight: bold;
  }
  section.lead h1 {
    color: red;
    font-weight: bold;
  }
  section.lead h6 {
    text-align: right;
  }
  section.lead h6 img {
    margin-top: -20px;
  }
header: hh+
---

<!-- _class: lead -->

# 항해를 마치며

##### 10주간의 항해, 나는 얼마나 성장했을까?

###### 19조 이선주 <br />[boy672820@gmail.com][boy672820]

###### ![width:120px](./qr-github-boy672820.png)

[boy672820]: https://github.com/boy672820

---

# 목차

1. 가장 재밌었던 8주차: 부하 축소하기
2. Query Optimization을 통한 대용량 데이터 다루기[^#33]
3. Before & After
4. 마무리

[^#33]: https://github.com/boy672820/hhplus-server-concert/pull/33

---

# 1. 가장 재밌었던 8주차

부하 축소하기

---

## 부하 축소하기

- `STEP 15` 쿼리 & 인덱스 튜닝을 통한 성능 개선 및 문서화
- `STEP 16` 트랜잭션 처리의 한계에 대한 해결방안 문서화 (MSA)

---

## STEP 15: Query Optimization (feat. Index)

가장 기억에 남은 8주차 스텝

`쿼리들을 수집하여 인덱스 적용 전·후를 비교해본다.`

![bg 100% right:33%](./review-step15-bg.png)

---

# 2. Query Optimization

feat. Index

---

## 성능 개선: 공연 일정 조회

`시나리오: 콘서트 예약 서비스`

공연 일정을 조회하는 쿼리를 개선해 봅시다.

![](./review-schedule-table.png)

---

## 성능 개선: 공연 일정 조회

```sql
SELECT id, eventId, startDate, endDate, status
FROM schedule
WHERE eventId = ?
  AND startDate > ?
  AND endDate < ?
```

##### Full scan 결과

* 1,000만 건의 데이터 조회
* 쿼리 수행 시간: 3.8s
  ![](./find-available-schedule.png)

---

## 성능 개선: 공연 일정 조회

##### 인덱스를 적용해보자

```sql
CREATE INDEX idx_composite ON schedule(eventId, startDate, endDate);
```

##### 인덱스 성능은?

* 1,000만 건의 데이터 조회
* 쿼리 수행 시간: 23s
  ![](./find-available-schedule-index.png)
  * 오히려, 성능이 저하됨 (?)

---

## 성능 개선: 공연 일정 조회

##### 인덱스에 대해서 체크해봅시다.

인덱스는 테이블의 특정 열에 대해 빠른 검색을 가능하게 합니다. 그 이유는 B-트리(B-Tree)와 같은 자료 구조로 구현되어 있으며, 특정 키 값에 해당하는 레코드를 직접 찾아가 액세스할 수 있습니다.

<div class="mermaid">
flowchart LR
  subgraph Memoery
  Root --> Branch1 --> Leaf1
  Branch1 --> Leaf2
  Root --> Branch2
  end
  subgraph Disk
  Leaf1 --> Database([Table])
  end
</div>

> 인덱스 탐색은 _Root > Branch > Leaf > Disk_ 순으로 진행됩니다.

---

## 성능 개선: 공연 일정 조회

##### 인덱스에 대해서 체크해봅시다.

예를 들어,
`SELECT * FROM schedule WHERE eventId = 'abc';`와 같은 쿼리에서 eventId 열에 인덱스가 있다면 eventId가 "abc"인 레코드를 빠르게 찾을 수 있습니다.

<div class="mermaid">
flowchart LR
  subgraph Memoery
  Root --> Branch1 --인덱스로 조회됨--> Leaf1:::foo
  Branch1 --> Leaf2
  Root --> Branch2
  end
  subgraph Disk
  Leaf1 --> d([Table])
  end
  classDef foo stroke:#f00
</div>

---

## 성능 개선: 공연 일정 조회

##### 인덱스에 대해서 체크해봅시다.

이후 인덱스에 저장되어 있는 디스크 주소를 이용하여 실제 테이블에 접근합니다.

공연 일정 조회 쿼리의 경우, `eventid, startDate, endDate`를 제외한 나머지 `id, status` 컬럼을 가져와야 하기 때문에 디스크 I/O가 발생하게 됩니다.

<div class="mermaid">
erDiagram
  Node {
    string eventId
    datetime startDate
    datetime endDate
    pointer childPage
    pointer diskAddress
  }
</div>

<div class="mermaid">
flowchart LR
  subgraph Memoery
  Leaf1:::foo
  end
  subgraph Disk
  Leaf1 -- Random Access 발생 --> d([Table])
  end
  classDef foo stroke:#f00
</div>

---

## 성능 개선: 공연 일정 조회

##### 인덱스 고려사항

만약, 1,000만건의 데이터를 조회한다면 그 만큼 디스크 I/O가 자주 발생하게 됩니다.

디스크에서 데이터를 읽을 때, 데이터가 물리적으로 분산되어 있으면
(즉, 인덱스를 통해 위치를 찾아야 하는 경우)

디스크 헤드가 여러 위치로 이동하게 되어 성능 저하가 발생하게 됩니다.

<div class="mermaid">
flowchart LR
  subgraph Memoery
  Leaf1
  end
  subgraph Disk
  Leaf1 -- Random Access 발생 --> d([Table]):::foo
  end
  classDef foo stroke:#f00
</div>

---

## 성능 개선: 공연 일정 조회

##### 인덱스 사용이 불리한 경우:

* 다량의 레코드를 처리할 때는 랜덤 액세스가 디스크 I/O를 많이 발생시키므로 성능이 떨어질 수 있습니다.
* 즉, **디스크 저장소에 얼마나 덜 접근하게 만드느냐**에 달려있습니다.
  <div class="mermaid">
  flowchart LR
    subgraph Memoery
    Leaf1:::bar
    end
    subgraph Disk
    Leaf1 --x d([Table]):::foo
    end
    classDef bar stroke:#0f0
    classDef foo stroke:#f00
</div>

---

## 성능 개선: 공연 일정 조회

##### 해결 방법

1) 인덱스를 사용하지 않는다 (?)
2) Covering Index

---

## 성능 개선: 공연 일정 조회

##### Covering Index

![w:700](./find-available-schedule-covering-explain.png)

##### 결과

* 1,000만 건의 데이터 조회
* 쿼리 수행 시간: 3.9s ---> ?????;;
  ![](./find-available-schedule-covering.png)
  * (더 좋은 방법은 아직 찾지 못했습니다 ㅠ)

---

<!-- mermaid.js -->
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>
