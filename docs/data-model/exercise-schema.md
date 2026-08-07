---
Doc ID: MS-ARCH-001
Title: Exercise Schema
Status: Approved
Version: 1.1
Date: July 2026
Parent: Content Schema v1.0 (MS-ARCH-000)
---

# MS-ARCH-001 — Exercise Schema v1.0

## Purpose

Defines the data model for an Exercise in the MoveSpan system.

An Exercise is the minimum self-contained unit of practice that has standalone value and can be assigned to a user.

Exercise Schema answers: **"What is this exercise?"**
It does NOT answer: "How is it used in a program?" — that belongs to Exercise Assignment (Content Instance).

---

## Inheritance

Exercise Schema extends Content Schema v1.0 (MS-ARCH-000).

All universal fields from Content Schema apply:
`id`, `type`, `names{}`, `descriptions{}`, `status`, `tags[]`, `body_zones[]`, `suitable_for[]`, `assets[]`, `relations[]`, `created_at`, `updated_at`, `version`

---

## Block 1 — Identity

Fields that uniquely identify the exercise in the system.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `exercise_code` | string | ✅ | Permanent code, never changes (e.g. JR001) |
| `practice` | enum | ✅ | JR / BR / NG / TC / WT / BW / SY / AQ / VS |
| `level` | enum | ✅ | Beginner / Intermediate / Advanced |
| `mode` | array | ✅ | Restore / Reset / Expand |
| `is_foundation` | boolean | ⭕ | Part of the base program for all users |

---

## Block 2 — Biomechanics

Fields describing the physical nature of the exercise.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `movement_pattern` | string | ⭕ | What the body does (e.g. Rotation, Flexion, Squat) |
| `movement_type` | enum | ✅ | Primary Movement Mode (see below) |
| `primary_joints[]` | array | ⭕ | Main joints involved |
| `primary_muscles[]` | array | ⭕ | Main muscle groups |
| `side` | enum | ⭕ | Bilateral / Unilateral-Left / Unilateral-Right / Alternating |
| `equipment` | array | ⭕ | Required equipment (default: none) |
| `position` | enum | ⭕ | Standing / Sitting / Lying / All-fours |

### Movement Type — Primary Movement Mode

```yaml
movement_type:
  static      # static hold
  dynamic     # movement with repetitions
  cyclical    # cyclical movement (breathing, walking, etc.)
  composite   # combination of multiple movement modes
```

**Architectural note:**

`movement_type` is the Primary Movement Mode of the exercise. It is NOT the same as Movement Pattern:

- **Movement Pattern** answers: *"What does the body do?"* (e.g. Squat, Rotation)
- **Movement Type** answers: *"How is the execution organised?"* (e.g. static, dynamic)

`movement_type` is used by the Intelligence Engine as one of several factors for building personalised sequences. It is analysed together with other exercise characteristics (load, target zones, intensity, duration, user goals) to create balanced programs — for example, alternating static ↔ dynamic or cyclical ↔ static. No single field drives AI decisions alone.

---

## Block 3 — Safety

Fields for responsible use and contraindication filtering.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contraindications[]` | array | ⭕ | Conditions where exercise is not suitable |
| `precautions[]` | array | ⭕ | Conditions requiring modification |
| `pain_safe` | boolean | ⭕ | Can be performed during mild pain |
| `modifications[]` | array | ⭕ | Easier or safer variants |
| `common_errors[]` | array | ⭕ | Typical mistakes and corrections |

---

## Block 4 — Relationships

Fields connecting this exercise to other objects in the system.

| Field | Type | Description |
|-------|------|-------------|
| `prepares_for[]` | array | Exercises this one leads into |
| `follows_from[]` | array | Exercises that typically precede this one |
| `pairs_well_with[]` | array | Good combinations |
| `alternatives[]` | array | Substitutes with similar effect |
| `part_of[]` | array | Composites / Practices this belongs to |

---

## Exercise Code Standard

Format: `[PRACTICE_CODE][NUMBER]`

| Practice | Code | Example |
|----------|------|---------|
| Joint Recovery | JR | JR001 |
| Body Release | BR | BR001 |
| Neuro Gym | NG | NG001 |
| Tai Chi & Flow | TC | TC001 |
| Walking Therapy | WT | WT001 |
| Breathwork & Meditation | BW | BW001 |
| Strong Body Yoga | SY | SY001 |
| AquaBreath | AQ | AQ001 |
| Voice & Sound | VS | VS001 |

---

## Example Exercise Passport

```yaml
id: exercise_jr001
type: Exercise
exercise_code: JR001
practice: JR
names:
  en: Toe Mobilisation
  ru: Мобилизация пальцев стоп
descriptions:
  en: Gentle mobilisation of all toe joints through full range of motion
  ru: Мягкая мобилизация всех суставов пальцев стоп
level: Beginner
mode: [Restore, Reset]
movement_pattern: Flexion / Extension
movement_type: dynamic
primary_joints: [metatarsophalangeal]
side: Bilateral
equipment: []
position: Sitting
body_zones: [feet_toes]
suitable_for: [Restore, Reset]
contraindications: [acute_fracture]
pain_safe: true
assets:
  - {asset_code: JR001-short-v1, asset_type: video, purpose: Preview}
  - {asset_code: JR001-full-v1, asset_type: video, purpose: Main}
  - {asset_code: JR001-thumb, asset_type: thumbnail}
status: Draft
version: "1.0"
created_at: 2026-07-25
```

---


## Block 5 — Intelligence Engine Scoring

Fields used by the MoveSpan Adaptive Practice Engine.

These fields describe the relative demand an exercise places on different functional systems.

Scale:

- `0` = negligible
- `1` = low
- `2` = moderate
- `3` = high

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mobility_load` | integer 0–3 | ⭕ | Mobility demand / stimulus |
| `strength_load` | integer 0–3 | ⭕ | Strength demand |
| `balance_load` | integer 0–3 | ⭕ | Balance demand |
| `coordination_load` | integer 0–3 | ⭕ | Coordination complexity |
| `cardio_load` | integer 0–3 | ⭕ | Cardiovascular demand |
| `nervous_system_load` | integer 0–3 | ⭕ | Nervous-system / attentional load |
| `recovery_cost` | integer 0–3 | ⭕ | Expected recovery requirement |

These values are not medical measurements.

They are internal relative scoring fields used together with:
- user profile,
- pain profile,
- assessments,
- breath pattern,
- readiness,
- practice history,
- exercise relationships,
- Safety Filter.

No single score may determine exercise selection by itself.

---

## Block 6 — Adaptive Runtime Metadata

Optional fields supporting session construction and runtime adaptation.

| Field | Type | Description |
|-------|------|-------------|
| `preparation_required[]` | array | Movements or conditions recommended before this exercise |
| `compensation_required[]` | array | Recommended compensatory movement after this exercise |
| `regression_priority[]` | array | Preferred regression order, e.g. breath → range → support → time |
| `supports_runtime_branching` | boolean | Exercise can participate in adaptive session branches |
| `recommended_previous[]` | array | Preferred preceding exercises |
| `recommended_next[]` | array | Preferred following exercises |

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.1 | August 2026 | Added Intelligence Engine scoring and adaptive runtime metadata |\n| 1.0 | July 2026 | Approved with movement_type as Primary Movement Mode |
