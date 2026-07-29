---
Doc ID: MS-ARCH-000A
Title: Movement Hierarchy
Status: Approved
Version: 1.0
Date: July 2026
---

# MS-ARCH-000A — Movement Hierarchy v1.0

## Purpose

Defines the levels of movement content organisation in MoveSpan.

Answers only: **How do different levels of movement content relate to each other?**

Does NOT describe object fields — only their place in the architecture.

---

## Design Principles

1. **Hierarchical Composition** — each level can consist of one or more objects from the level below
2. **Reusability** — any object can be used multiple times in different contexts without duplication
3. **Separation of Structure and Usage** — hierarchy describes content structure; execution parameters are defined via Content Instance / Assignment
4. **Objects describe "what this is", not "why it is used"** — the answer to "what to show this user now" lives in User Architecture and AI, not in content objects

---

## Content Architecture

### Level 0 — Movement

Atomic action. The minimum unit of biomechanics.

Examples: inhale, exhale, flexion, extension, rotation, weight shift.

Movement may be used inside an Exercise but is rarely assigned directly to a user.

---

### Level 1 — Exercise

The minimum self-contained unit of practice.

An Exercise has:
- Its own name
- A stable technique
- Standalone value
- Can be assigned to a user as a complete unit

An Exercise may contain: one movement, a repeating cycle, a static hold, a sequence of related movements, or a combination of movement and breath.

---

### Level 2 — Composite

A compound object uniting several elements into one logical practice.

A Composite may contain objects of different types:
- Exercise
- Breathing
- Meditation
- Audio Cue
- Knowledge
- Pause

> **Sequence is a special case of Composite** where all elements are the same type and have a fixed order.

Examples:
- Breathing Reset (Kapalabhati + Retention + Svistyelka)
- Six Healing Sounds
- Shoulder Complex
- Hand & Wrist Gymnastics

---

### Level 3 — Practice

A complete practical session with a specific goal.

Practice combines Exercises and/or Composites.

Examples: Morning Mobility, Evening Relaxation, Walking Reset.

---

### Level 4 — Lesson

An educational unit.

A Lesson may include: theory, video, Practice, Knowledge, assignments, questions, additional materials.

---

### Level 5 — Program

A long-term learning or recovery structure.

A Program combines Lessons and Practices into a sequential user journey.

Examples: Healthy Spine, Walking Therapy, Strong Body Yoga, Reverse Aging.

---

## User Experience Architecture (separate)

Content hierarchy does not describe the user journey. User logic exists independently:

```
Goal
  ↓
Assessment
  ↓
Recommendation
  ↓
Experience
  ↓
State Change
  ↓
Long-term Transformation
```

This model will be described in a separate architectural document and interacts with the content system through the Recommendation Engine.

---

## Both Architectures

```
CONTENT                    USER EXPERIENCE

Movement                   Goal
  ↓                          ↓
Exercise                   Assessment
  ↓                          ↓
Composite                  Recommendation
  ↓                          ↓
Practice                   Experience
  ↓                          ↓
Lesson                     State Change
  ↓                          ↓
Program                    Long-term Transformation
```

Both architectures are independent but connected through AI and the Recommendation Engine.

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | July 2026 | Approved |
