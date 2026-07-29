# MoveSpan Bible
> Single source of truth for the entire MoveSpan system.
> Last updated: July 2026

---

## 1. Philosophy

MoveSpan is a personalized body practice system for adults 45+.
Core belief: **movement is medicine** — daily joint practice, breathwork and body awareness extend healthy, active life.

The system is built around three principles:
- **Accessibility** — no equipment, no gym, any level
- **Personalization** — program adapts to the user's body, zones and goals
- **Progression** — Restore → Reset → Expand

---

## 2. Program Modes

| Mode | Who it's for | Focus |
|------|-------------|-------|
| **Restore** | Beginners, recovery, pain | Gentle mobility, breathing, decompression |
| **Reset** | Intermediate, maintenance | Joint gymnastics, body release, balance |
| **Expand** | Advanced, performance | Strong Body Yoga, Tai Chi, Neuro Gym |

---

## 3. Practices (8 total)

| Code | Name | Description |
|------|------|-------------|
| JR | Joint Recovery | Full-body joint gymnastics — the core of every program |
| BR | Body Release | Myofascial release · self-massage · tension relief |
| NG | Neuro Gym | Brain-body coordination · balance · memory |
| TC | Tai Chi & Flow | Slow flowing movement · balance · awareness |
| WT | Walking Therapy | Gait & posture reprogramming · daily movement |
| BW | Breathwork & Meditation | Nervous system reset · Svistyelka · Impulse Breathing |
| SY | Strong Body Yoga | Static holds · tendons · deep muscles |
| AQ | AquaBreath | Breath & water practices · deep recovery |
| VS | Voice & Sound | Sound healing · voice vibration · nervous system reset |

**Selection limit:** max 3 practices in onboarding (PMAX=3)

---

## 4. Body Zones (9 total)

Ordered top → bottom:

| Code | Name EN |
|------|---------|
| face_eyes | Face & eyes |
| neck | Neck |
| shoulders | Shoulders |
| arms_wrists | Arms & wrists |
| mid_back | Mid back |
| lower_back | Lower back |
| hips | Hips |
| knees | Knees |
| feet_toes | Feet & toes |

**Selection limit:** max 3 zones

---

## 5. Exercise ID System

Format: `[PRACTICE][NUMBER]`

Examples: `JR001`, `BW004`, `AQ012`

File naming standard:
- `JR001-short-v1.mp4` — short demo video
- `JR001-full-v1.mp4` — full lesson
- `JR001-thumb.webp` — thumbnail
- `JR001-pdf.pdf` — printable guide

---

## 6. Content Architecture

```
Movement Pattern
    └── Exercise (primary object)
            ├── Short video (R2)
            ├── Full lesson (R2)
            ├── Thumbnail (R2)
            ├── Audio (R2)
            ├── PDF (R2)
            └── AI metadata (Supabase)
```

Content Bible lives in Google Sheets (→ Supabase later):
- Exercises: https://docs.google.com/spreadsheets/d/1P268Ww3rhokEVMiZafsyhXl5YyRK3t0aI71OGMtEM4I/edit
- Body Zones: https://docs.google.com/spreadsheets/d/1_cs_ZqjHSN0Xoralj6UUN_b_h4n44mND1ArnkTX1D9A/edit

---

## 7. Infrastructure

| Service | Role |
|---------|------|
| GitHub — MoveSpan/movespan-site | Code repository |
| Cloudflare Pages | Auto-deploy on push to main |
| Cloudflare R2 | Video & media storage |
| Firebase (movewell-system) | Authentication |
| Supabase | Future backend / database |
| Google Drive | Content Bible (Google Sheets) |
| Notion | Project management |

**authDomain:** `movewell-system.firebaseapp.com` (not movespan.app)
**Deploy:** push to GitHub → Cloudflare auto-deploys in 1-2 min

---

## 8. User Journey

1. Landing page → Start free
2. Auth (Google or email)
3. Onboarding: age → goals → practices (max 3) → zones (max 3) → pain level → session length
4. Body Age Test (7 tests)
5. Visual Assessment (posture)
6. Program generated → Week 1, Sessions 1-3
7. Daily check-in → feel → program adapts
8. Sleep Reset (evening) · Reset Break (daytime)

---

## 9. Sleep Reset

18-minute evening wind-down:
- Phase 1: Let the rhythm settle (40 BPM · 3 min)
- Phase 2: Foot massage (30 BPM · 3 min) — optional
- Phase 3: Calm the mind / acupressure (30 BPM · 3 min)
- Phase 4: Deep Relaxation / Svistyelka (20 BPM · 9 min)

Free: text instructions + audio demo
Paid (Essential): video guides + HA/SHU breath sounds

---

## 10. Slogan

**Move better · Feel brighter · Live longer**

---

## 11. Terminology

| Term | Meaning |
|------|---------|
| Svistyelka | Extended breath — free exhale through slightly open mouth, "ssss" sound |
| AquaBreath | Breath & water practice |
| Sleep Reset | 18-min evening wind-down with metronome |
| Reset Break | 7-min daytime reset |
| Restore / Reset / Expand | Program difficulty modes |
| Essential | Paid plan |
