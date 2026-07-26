# MS-ARCH-003 · Asset Schema v1.0

**Version:** 1.0  
**Status:** Approved  
**Parent:** Content Schema v1.0  
**Date:** July 2026  

---

## Purpose

Asset is any digital resource in the MoveSpan ecosystem.

An Asset does not contain learning logic. It provides materials used by other objects (Exercise, Lesson, Program, Article, Practice).

One Asset can be referenced by unlimited objects simultaneously.

---

## Design Principles

1. **Reusable** — one asset used across many objects
2. **Immutable Identity** — ID never changes even when file is replaced (version increments)
3. **Independent** — deleting a Lesson does not delete its Assets
4. **AI-Ready** — AI knows what's in the asset without opening it
5. **Storage-agnostic** — stores `file_path`, not full URL; app builds URL at runtime

---

## Asset Types

Single schema, type determined by `asset_type` field:

- `video`
- `audio`  
- `image`
- `document`
- `text`
- `subtitle`
- `thumbnail`
- `animation`

Future: `3d`, `ar`, `vr`, `motion_capture`

---

## Schema Blocks

### 1. Identity

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `asset_code` | string | ✅ | Permanent code (never changes) |
| `asset_type` | enum | ✅ | video / audio / image / document / text / subtitle / thumbnail / animation |
| `language` | string | ⭕ | en / ru / es / zh |
| `purpose` | enum | ⭕ | Main / Preview / Thumbnail / Subtitle / Voice |
| `version` | string | ✅ | e.g. v1, v2 |

### 2. File

| Field | Type | Description |
|-------|------|-------------|
| `storage_provider` | enum | r2 / s3 / gcs |
| `storage_bucket` | string | Bucket name |
| `file_path` | string | Path only, e.g. `videos/yoga/JR001/main.mp4` |
| `filename` | string | |
| `extension` | string | mp4 / webp / mp3 / pdf |
| `mime_type` | string | |
| `filesize` | integer | bytes |
| `checksum` | string | For integrity verification |

### 3. Metadata (type-specific, optional fields)

| Field | Applies to |
|-------|-----------|
| `duration` | video, audio |
| `width` / `height` | video, image |
| `fps` | video |
| `bitrate` | video, audio |
| `pages` | document |
| `resolution` | image |
| `aspect_ratio` | video, image |

### 4. AI Metadata *(planned — filled by AI pipeline)*

| Field | Description |
|-------|-------------|
| `transcript` | Speech text |
| `captions` | Subtitles |
| `detected_language` | Language detected |
| `keywords[]` | Key topics |
| `summary` | Short description |
| `embedding` | AI vector embedding |
| `recognized_exercises[]` | Exercises visible in video |
| `recognized_body_parts[]` | Body parts visible |

### 5. Relations

| Field | Description |
|-------|-------------|
| `related_assets[]` | e.g. video → its thumbnail + subtitle |
| `derived_from` | Source asset if this is a derivative |
| `alternative_versions[]` | Same content, different quality/language |

---

## File Naming Convention

```
[PRACTICE_CODE][NUMBER]-[PURPOSE]-v[VERSION].[EXT]

Examples:
JR001-short-v1.mp4
JR001-full-v1.mp4
JR001-thumb.webp
JR001-pdf.pdf
BW004-audio-v1.mp3
```

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | July 2026 | Initial approved version |
