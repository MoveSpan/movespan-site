# MoveSpan Back Navigation Standard

All MoveSpan back controls use one shared visual and interaction standard.

## Requirements

- Control may be an `<a>` or `<button>`.
- Class: `movespan-back`.
- Existing `href`, `onclick`, and navigation logic must be preserved.
- Touch target: 44 × 44 px.
- SVG size: 24 × 24 px.
- SVG path: `M15 18l-6-6 6-6`.
- Stroke width: 2.2.
- Color: `#2D7D52`.
- No circle, background, border, or shadow.
- Browser tap highlight and default button styling are disabled.
- Keyboard focus uses a subtle green rounded rectangle, never a circle.
- Shared stylesheet: `/assets/css/movespan-navigation.css`.

## Required markup

```html
<a class="movespan-back" href="..." aria-label="Back">
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M15 18l-6-6 6-6"></path>
  </svg>
</a>
```
