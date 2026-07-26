# MS-ARCH-000 · Content Schema v1.0

**Version:** 1.0  
**Status:** Approved  
**Owner:** MoveSpan Architecture  
**Approved by:** Dmitriy Matveev (Founder & Methodologist)  
**Date:** July 2026  

---

## Purpose

Content Schema is the base model for any object in the MoveSpan ecosystem.

Every object on the platform (Exercise, Practice, Lesson, Protocol, Article, Program, etc.) inherits from this schema.

Content Schema defines only universal fields common to all content types.

---

## Design Principles

1. **Universal** — every MoveSpan object must conform to Content Schema
2. **Extensible** — specialized schemas (Exercise, Practice, etc.) extend it without modifying the base
3. **AI-Ready** — every object contains enough information for AI to understand what it is, how it's named, where it's used, and what it's connected to
4. **Multilingual** — all user-facing text fields support multiple languages; localization is stored inside the object, not in a separate translation system
5. **Versioned** — every object has its own version; changes are tracked independently
6. **Connected** — any object can reference other objects via `relations[]`

---

## Universal Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | Unique object identifier |
| `type` | enum | ✅ | Exercise / Practice / Lesson / Protocol / Program / Article / ... |
| `names` | object | ✅ | Localized names (`en`, `ru`, `es`, `zh`...) |
| `descriptions` | object | ⭕ | Localized short descriptions |
| `status` | enum | ✅ | Draft / Review / Approved / Archived |
| `tags[]` | array | ⭕ | Thematic tags |
| `body_zones[]` | array | ⭕ | Primary body zones |
| `suitable_for[]` | array | ⭕ | Restore / Reset / Expand |
| `assets[]` | array | ⭕ | Links to associated assets (Video, Audio, Image, Document, Text) |
| `relations[]` | array | ⭕ | Links to other MoveSpan objects |
| `created_at` | datetime | ✅ | Creation date |
| `updated_at` | datetime | ✅ | Last modified date |
| `version` | string | ✅ | Object version |

---

## Localization Strategy

All translatable fields are stored inside the object:

```yaml
names:
  en: Mountain Pose
  ru: Поза горы
  es: Postura de la montaña

descriptions:
  en: Standing posture...
  ru: Базовая стойка...
```

New languages are added without changing the architecture.

---

## Inheritance Model

```
Content Schema
      │
      ├── Exercise Schema      ← next to design
      ├── Practice Schema
      ├── Lesson Schema
      ├── Protocol Schema
      ├── Program Schema
      ├── Article Schema
      └── ...
```

---

## Scope

Content Schema answers only: **"What is this object in the MoveSpan ecosystem?"**

It does NOT contain: how to perform an exercise, which muscles work, repetition counts, breathing patterns, contraindications — those belong to specialized schemas.

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | July 2026 | Initial approved version |
