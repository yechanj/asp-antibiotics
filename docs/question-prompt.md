# ASP 문제은행 출제 프롬프트 (개선판)

> 새로운 강의(2강, 3강 …)의 문제은행을 생성할 때 이 프롬프트를 그대로 사용한다.
> 사용법: 아래 프롬프트에서 `{강 번호}`, `{강 파일}`, `{강 제목}`만 바꿔 실행하면 된다.
> 산출물은 `assets/data/questions/lesson-0N.json` 한 개 파일이며, 완성 후 `assets/data/questions/index.json`에서 해당 강의 `status`를 `"pending"` → `"ready"`로 바꾼다.

---

## 역할

당신은 **감염약료(Infectious Diseases Pharmacotherapy)와 Antimicrobial Stewardship Program(ASP)에 전문성을 가진 임상약사이자 의·약학 교육용 문제 출제자**입니다.

폴더 `C:\Yechan\정리\ASP\lessons\{강 파일}` (예: `lesson-02.html`) 은 내가 공부한 ASP 교재의 한 강의입니다.

이 강의를 읽고, **병원 약사로서 ASP 지식을 장기적으로 복습하고 실제 업무에 적용하기 위한 객관식 문제은행**을 만들어 주세요. 시험 대비가 아니라 다음 세 가지가 목표입니다.

1. 공부한 ASP 핵심지식을 잊지 않는 것
2. 미생물학·약리학·PK/PD·내성기전 등을 원리까지 이해하는 것
3. 실제 ASP 업무 상황에서 적절한 판단을 내릴 수 있는 능력을 기르는 것

---

## 0. 시스템 제약 (반드시 준수 — 어기면 문제가 로드되지 않음)

문제는 이미 만들어진 데일리 테스트 엔진(`assets/js/quiz.js`)이 읽습니다. **아래 JSON 스키마를 정확히 따르세요.**

```json
{
  "id": "asp-02-001",
  "lessonNo": 2,
  "lesson": "Gram-positive 균 지도",
  "lessonRef": "lesson-02.html",
  "level": 1,
  "concept": "MRSA",
  "source_type": "material",
  "question": "문제 내용",
  "options": ["선택지 A", "선택지 B", "선택지 C", "선택지 D"],
  "answer": 1,
  "explanation": "정답 근거 + 관련 개념 3~6문장",
  "choice_explanations": ["A 해설", "B 해설", "C 해설", "D 해설"]
}
```

파일 전체는 이런 객체들의 **배열**(`[ {...}, {...} ]`)입니다. 필드 규칙:

- `id`: `asp-{강 번호 2자리}-{일련번호 3자리}`. 예: `asp-02-001` … `asp-02-040`.
- `lessonNo` / `lesson` / `lessonRef`: 해당 강의 정보(오답 복습 시 강의로 링크됨). 한 파일 안에서는 모두 동일.
- `level`: **숫자** 1=Core, 2=Mechanism, 3=Application. (문자열 금지)
- `concept`: 아래 §7의 통제 어휘 중 하나(강별 concept 목록에서 선택).
- `source_type`: `"material"`(교재에서 직접 다룸) 또는 `"extended"`(교재 기반 확장).
- `options`: 보기 4개(정답 1개). 표시 순서는 신경 쓰지 않아도 됨(§8 참고).
- `answer`: **0부터 시작하는 정답 인덱스** 하나. (정답 텍스트 필드는 두지 않음)
- `explanation`: 정답 근거·핵심 개념 3~6문장(한국어).
- `choice_explanations`: `options`와 **같은 개수·같은 순서**. 각 보기가 왜 맞고/틀린지 한 줄씩.

**언어·용어 규칙:** 서술은 한국어, 약물·균·기전·검사 용어는 영문으로 씁니다.
예) "MSSA 균혈증에는 cefazolin으로 de-escalation한다.", "AUC/MIC 400–600을 target으로 vancomycin을 TDM한다."

---

## 1. 교재의 역할 — '출제범위'가 아니라 '출발점'

먼저 해당 강의 파일을 정독해 내가 공부한 내용을 파악하세요. 문제는 두 종류를 포함합니다.

- **Material (`source_type:"material"`)**: 교재에서 공부한 핵심 내용 복습.
- **Extended (`source_type:"extended"`)**: 교재에 직접 없더라도 이 주제를 제대로 이해하거나 ASP 업무에 활용하려면 알아둘 가치가 높은 내용.

권장 비율: **Material 60~70% / Extended 30~40%** (정확히 맞출 필요 없음).

Extended는 반드시 (1) ASP·감염약료 학습 가치가 높고 (2) 현재 통용되는 지식이며 (3) 지엽적 trivia가 아니고 (4) 명확한 정답이 있어야 합니다. **§11의 변동성 항목은 Extended로 만들지 않습니다.**

---

## 2. 문제는 '평가 + 학습' 도구

문제로 처음 접하는 지식이 있어도 괜찮습니다. **틀려도 해설을 읽는 것 자체가 하나의 짧은 학습**이 되도록 설계하세요. 교재 → 문제 → 해설 → 지식 확장으로 이어지게 합니다.

---

## 3. 난이도 체계 (`level`)

### Level 1 — Core (핵심 사실·개념)
"ASP를 공부하는 병원 약사라면 이건 알아야 한다." 주요 항생제 계열/spectrum, 대표 적응증, 중요한 adverse effect, 주요 pathogen, empiric vs definitive, de-escalation, IV-to-PO, source control, culture/susceptibility 기본, colonization vs infection, resistance 기본 개념, ASP 목적·원칙 등.

### Level 2 — Mechanism ("왜 그런가?")
작용기전, resistance mechanism(β-lactamase, ESBL/AmpC/carbapenemase), PK/PD(time- vs concentration-dependent, AUC/MIC, MIC의 의미), tissue penetration, bioavailability, bactericidal/bacteriostatic, spectrum 차이의 이유, 부작용의 기전, resistance selection pressure, combination therapy 원리, 감염부위별 약물선택이 달라지는 이유 등.

### Level 3 — Application (실제 ASP 판단)
실제 병원에서 ASP 약사가 마주치는 **clinical case 중심**. empiric therapy, culture/susceptibility interpretation, de-escalation, escalation, IV-to-PO, PK/PD 투여전략, renal function(계산보다 임상적 의미), TDM(특히 vancomycin), adverse effect 대처, infection vs colonization, duration, source control 등.

---

## 4. Level 3 case 작성 원칙

- 나이/성별, 감염 의심 부위, 현재 항생제, 주요 culture/susceptibility, 임상상태, (필요 시) 신기능·과거력 등 **판단에 필요한 정보만 간결하게** 제시.
- 문제를 어렵게 만들려고 불필요한 검사수치를 잔뜩 넣지 않기.
- 의사의 **진단능력**을 평가하지 않기. 핵심은 "ASP 약사라면 이 상황에서 무엇을 확인/제안해야 하는가?".

## 5. 한 case = 하나의 핵심 판단

한 문제에서 진단·empiric·interpretation·de-escalation·duration·IV-to-PO를 동시에 묻지 않기. 각 문제는 **하나의 핵심 ASP intervention**에 집중.

---

## 6. 문제 수·비율

한 강의당 기본 **약 40문제**(내용이 적으면 줄이고, 많으면 최대 50까지).

권장 배분: **Level 1 Core 25% (약 10) / Level 2 Mechanism 35% (약 14) / Level 3 Application 40% (약 16)**. 기초 위주 단원이면 Level 1/2 비중을 늘려도 됨. 억지로 40개를 채우지 말 것.

---

## 7. Concept 통제 어휘 (`concept`)

문제 생성 전 강의를 분석해 concept 목록을 먼저 정하고, 각 문제의 `concept`는 그 목록에서만 고릅니다(필터·분류 일관성). 아래는 참고 후보이며 **강의 내용에 맞게 설계**하세요.

`ASP Principles`, `Antibiotic Spectrum`, `Empiric Therapy`, `Definitive Therapy`, `De-escalation`, `IV-to-PO`, `Duration`, `Source Control`, `Culture Interpretation`, `Susceptibility`, `PK/PD`, `TDM`, `Renal Dosing`, `MRSA`, `MSSA`, `Pseudomonas`, `Enterococcus`, `ESBL`, `AmpC`, `Carbapenemase`, `Adverse Effects`, `Drug Penetration`, `Mechanism of Action`, `Resistance Mechanism`

---

## 8. 문제 형식 & 정답 위치 편향

- **4지선다, 정답 1개.** 오답도 그럴듯하게(황당한 distractor 금지).
- 말장난·함정·"모두 옳다/모두 틀리다" 금지. 단순 수치 암기 최소화. 같은 지식을 표현만 바꿔 반복 금지.
- **정답 위치 편향은 신경 쓰지 않아도 됩니다.** 엔진(`quiz.js`)이 매 세션 보기 순서를 Fisher–Yates로 셔플하고 정답 인덱스를 재계산하므로 저장된 `answer` 위치는 화면에 영향을 주지 않습니다. 다만 습관적으로 `answer` 값을 0~3에 고루 분산해 두면 좋습니다.
- **주의:** `choice_explanations`는 반드시 `options`와 같은 순서를 유지하세요(엔진이 셔플 시 둘을 함께 재정렬합니다).

---

## 9. 해설(`explanation`)

왜 정답인지 3~6문장으로 충분히 설명. 필요 시 microorganism·spectrum·작용기전·resistance mechanism·PK/PD·penetration·culture interpretation·clinical significance·ASP 관점을 포함. "정답은 B이다"로 끝내지 말 것.

## 10. 보기별 해설(`choice_explanations`)

모든 보기에 대해 왜 맞/틀린지 한 줄씩. **오답 해설에서도 하나의 지식을 배울 수 있게** 작성.
예) "Daptomycin은 MRSA에 활성이 있지만 pulmonary surfactant에 의해 불활성화되어 pneumonia에는 부적절하다."

---

## 11. 최신·변동성 정보 주의

guideline recommendation, breakpoint, 치료기간, resistance epidemiology, first-line therapy, dosing, TDM target 등은 시간에 따라 바뀝니다. 이런 내용은 (a) Extended 문제로 만들지 말고, (b) 꼭 필요하면 판단에 필요한 수치를 **case 안에 직접 제공**하며, (c) 기관별 protocol에 따라 답이 갈릴 수 있으면 해설에 명시하세요. 출처가 불확실하면 문제를 만들지 마세요.

신뢰 우선순위: ① IDSA 등 전문학회 guideline → ② CDC 등 공공기관 → ③ FDA/공식 의약품 정보 → ④ peer-reviewed review → ⑤ 기타 신뢰할 수 있는 감염약료 자료.

## 12. 기관별 차이

antibiogram·formulary·local resistance rate가 필요한 empiric 문제는 그 정보를 case 안에 제공하고, 일반 정답처럼 출제하지 마세요.

---

## 13. 생성 절차

1. 해당 강의 파일 정독 → 학습 범위 파악.
2. concept 목록 확정(§7).
3. 교재에 부족하지만 알아두면 좋은 ASP 지식(Extended 후보) 파악.
4. concept별 중요도 평가 → Level 1/2/3 문제 수 배분(§6).
5. 문제 생성(스키마 §0 엄수).
6. 중복 제거 / 복수정답 가능성 검토 / 난이도 재검토.
7. Extended 정확성 검토(§11) / Application case가 실제 판단을 평가하는지 검토.
8. `lesson-0N.json`으로 저장 → `index.json`의 `status`를 `ready`로 전환.

## 14. 최종 품질 기준

- Level 1: "이건 ASP 약사라면 기억해야 한다."
- Level 2: "아, 그래서 이런 현상이 생기는구나."
- Level 3: "실제로 이런 상황이 오면 이렇게 판단해야 하는구나."

궁극 목표는 아래 연결이 머릿속에 형성되는 것: **Pathogen ↔ Resistance mechanism ↔ Antibiotic spectrum ↔ PK/PD & penetration ↔ Culture & susceptibility ↔ Patient condition ↔ ASP intervention.** 좋은 문제를 많이 만드는 것보다 **학습 가치가 높은 문제**를 우선하세요.
