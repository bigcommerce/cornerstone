---
name: accessibility
description: >-
  Enforce WCAG 2.2 AA for Cornerstone storefront UI: semantics, accessible names,
  forms/errors, keyboard/focus, live regions, decorative hiding, contrast, and
  lang/en.json ARIA strings. Use whenever creating or editing anything a shopper
  sees or interacts with — Stencil/Handlebars templates (templates/**/*.html),
  theme JS (assets/js/theme/**), or component SCSS (assets/scss/**) — including
  forms, buttons, links, dialogs, lists, headings, icons, images, status messages,
  focus, visibility, layout, color, or motion. Also use when the user mentions
  accessibility, ARIA, screen readers, keyboard navigation, focus, or WCAG, even
  if they did not ask for an accessibility pass explicitly.
---

# Accessibility (WCAG 2.2 AA) for Cornerstone storefront UI

Cornerstone ships to merchants who inherit our accessibility. Shoppers using a
screen reader, keyboard, or magnification must complete every flow. Build
accessibility in at authoring time — automated checks only catch part of it.

This skill is an implementation guardrail, not a substitute for
[WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/). Deeper criteria and
high-churn surfaces: [reference.md](reference.md). Good/bad snippets:
[examples.md](examples.md).

## Do this first

Before editing, list in one line which areas the change affects:

`semantics` · `names/roles/states` · `forms/errors` · `keyboard/focus` ·
`dynamic updates` · `visual/reflow/motion` · `pointer/touch` · `images/media`

Design applicable requirements into the solution, then edit.

## Mandatory rules

1. **Semantics before ARIA.** Use `<button>` / `<a href>` (not a clickable
   `<div>`), `<ul>/<li>` for lists, one `<h1>` per page with non-skipping
   heading levels, `<main>` / `<form>` landmarks. Add `role` / `aria-*` only
   when HTML cannot express the semantics — no ARIA beats bad ARIA.
   - **Changing a tag changes its styling — preserve it on the class.** When
     you swap an element's tag to fix semantics, tag-dependent CSS (element
     styles, default UA margins, and any theme rules keyed on the old tag) does
     **not** follow. Before finishing, diff the old vs new tag's computed styling
     and add whatever the class was relying on so appearance is preserved. Put it
     on the **component's own class or a scoped selector** — do **not** broaden a
     _shared_ class's contract to fix one component, which regresses any consumer
     whose tag legitimately differs.

2. **Names, forms, and errors.**
   - Every control needs an accessible name. Prefer a persistent visible
     `<label>`; placeholders and `title` are not labels. The accessible name
     must contain the visible label text.
   - Use `<fieldset>/<legend>` for related controls; valid `autocomplete`
     tokens for user data; keep instructions available while completing the field.
   - Inside `{{#each}}`, derive ids from the item id (`id="qty-{{id}}"`) —
     never a static id in a loop.
   - If the visible label is `display:none` at any breakpoint, use
     `aria-labelledby` instead of `<label for>` (hidden labels drop from the
     accessibility tree; `aria-labelledby` does not).
   - Keep required/invalid and ARIA state (`expanded`, `selected`, `pressed`,
     `current`, etc.) synchronized with the UI. Link hints/errors with
     `aria-describedby`. Errors identify the field, explain the problem,
     suggest correction, and preserve entered values.

3. **Keyboard and focus.**
   - Prefer native controls. Links: Enter. Buttons: Enter/Space. Custom widgets:
     follow the applicable WAI-ARIA Authoring Practices pattern (Escape/arrows
     where specified).
   - All functionality works without a pointer; no keyboard traps. Focus order
     matches DOM order; avoid positive `tabindex`.
   - Focus is visible, ≥3:1 against adjacent colors, and not entirely obscured.
     Prefer `:focus-visible` with a 2px outline.
   - Use native `disabled` when unavailable. Use `aria-disabled="true"` only
     when the control must stay focusable/discoverable — then block click,
     keyboard, and submit in JS. Never put `aria-disabled` on a container with
     active descendants.
   - Failed submit: error summary with `tabindex="-1"`, move focus to it.
     Do **not** also give that focused summary `role="alert"`. For urgent async
     errors where focus should stay put, use a pre-existing `role="alert"`
     region. Set `aria-invalid="true"` on invalid fields.
   - Success / major view change: move focus only when needed to establish
     context; avoid focusing whole containers. Never use timing hacks to wait
     for screen-reader speech.

4. **Announce dynamic changes.** Loading, progress, and success use a concise,
   pre-existing status region, e.g.:

   ```html
   <p class="aria-description--hidden" role="status" aria-atomic="true" data-status></p>
   ```

   Replace stale text rather than accumulating messages. Set `aria-busy="true"`
   on the affected region while processing. Default to polite (`role="status"`
   or `aria-live="polite"`); use assertive (`aria-live="assertive"`) only when a
   shopper acting on stale info could cause a real problem — e.g. Cornerstone's
   return submission uses assertive so shoppers don't double-submit or navigate
   away mid-request (see [examples.md](examples.md#4-announce-progress-move-focus-for-success)).
   Prefer assertive over `role="alert"` for this — `alert` implies an error.

5. **The two “hiddens” are opposites.**
   - `aria-hidden="true"`: seen, not heard. Never on a focusable element.
   - `.aria-description--hidden`: heard, not seen (SR-only text and live regions).
   - Informative images: concise `alt`. Decorative `<img>`: `alt=""`. Decorative
     SVG/icons: `aria-hidden="true"`, not focusable. Icon-only controls need a
     translatable accessible name.

6. **Visual, motion, pointer, media.** Preserve content under zoom, reflow,
   text-spacing, forced colors, and `prefers-reduced-motion`. Meet contrast;
   never use color alone; pointer targets ≥24×24 CSS px unless SC 2.5.8
   exception applies. In Cornerstone, `color("greys","base")` (#999) fails for
   text — use `color("greys","dark")` (#666).

7. **Translatable strings.** No hardcoded English in ARIA. Add a key to
   `lang/en.json`, reference via `{{lang '...'}}` or
   `{{~inject 'x' (lang '...')}}` for JS. Remove unused keys.

8. **Cornerstone conventions.**
   - Reuse `form-select`, `form-input`, `form-label`, `button`,
     `aria-description--hidden` — they carry focus/contrast/state styling.
   - Merchant/customer strings: `{{value}}` (auto-escapes). Never
     `{{{sanitize value}}}` for those strings.

## Verification checklist

Copy and track. Never claim a manual check passed unless it was performed.

```
A11y progress:
- [ ] Affected areas listed (Do this first)
- [ ] Semantics / names / roles / states correct
- [ ] Forms, errors, ids (incl. loops) correct
- [ ] Keyboard / focus plan implemented
- [ ] Dynamic updates announced (or N/A)
- [ ] Decorative content hidden correctly
- [ ] Contrast / motion / targets checked as applicable
- [ ] lang/en.json keys added; unused keys removed
- [ ] Diff audit (below) done
- [ ] Lighthouse audit run manually against a rendered URL
- [ ] Manual checks still required: _______________
```

1. **Static / diff audit (always):** unique and unorphaned ids; no focusable
   `aria-hidden`; no stale ARIA state; no a11y behavior removed by responsive
   CSS; translatable ARIA strings.
2. **Lighthouse (manual — there's no automated pipeline for this; run it
   yourself against a rendered URL when one is available):**
   `URL=<page-url> npm run lighthouse` (target 100% accessibility). Use axe
   DevTools when available. A clean Lighthouse run ≠ WCAG conformance.
3. **Keyboard / responsive (when interactive environment available):** full
   flow without pointer; focus visibility/order; no traps; zoom/reflow;
   reduced motion as applicable.
4. **Screen reader (when available):** VoiceOver (macOS ⌘F5) or NVDA — changed
   names, states, errors, announcements.

If keyboard, screen reader, or Lighthouse could not run, say so explicitly in
your response and list what remains for the human.

## Project pattern references

Validate patterns against the rules above — existing code may predate guidance:

- `templates/pages/create-return.html`
- `templates/pages/account/returns.html`
- `templates/components/account/returns-list-v2.html`
- `templates/components/carousel-content-announcement.html`
- `templates/components/carousel-play-pause-button.html`

Canonical recent examples of form/focus/live-region work: returns templates.
Carousel files show announcement + play/pause naming patterns.
