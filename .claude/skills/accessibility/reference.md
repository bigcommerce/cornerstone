# Accessibility reference (Cornerstone)

Read this when a change needs deeper WCAG detail or touches a high-churn
surface. Keep [SKILL.md](SKILL.md) as the authority for mandatory rules;
validate every pattern against those rules.

## WCAG areas → what to verify

| Area | Verify |
|------|--------|
| Semantics / content | Correct elements; heading order; lists; landmarks; link purpose in context |
| Names, roles, values, states | Accessible name; role only if needed; `expanded`/`selected`/`pressed`/`current`/`invalid` match UI |
| Forms / errors | Labels; fieldset/legend; autocomplete; `aria-describedby` for hints/errors; values preserved |
| Keyboard / focus | No pointer-only ops; no traps; DOM order; visible focus; focus moves on submit failure / major view change |
| Dynamic updates | Polite status for progress/success by default; assertive only when acting on stale info causes harm; `aria-busy` while processing |
| Visual / reflow / motion | Zoom to 200%; narrow reflow; text spacing; forced colors; `prefers-reduced-motion` |
| Pointer / touch | ≥24×24 CSS px targets (or SC 2.5.8 exception); non-dragging alternative if drag is required |
| Images / media | Meaningful `alt`; decorative empty/`aria-hidden`; captions/transcripts where applicable |

## High-churn Cornerstone surfaces

If you touch one of these, also check the paired concerns:

| Surface | Also check |
|---------|------------|
| Modals / drawers / filters | Focus trap to dialog only while open; Escape closes; restore focus to opener; initial focus to dialog (not a random control inside unless pattern requires); `aria-modal` / labelling |
| Carousels / sliders | Play/pause control; slide announcements via status region; arrow/dot names from `lang` injects; respect reduced motion |
| Product options / swatches | Selected state exposed; each option named; keyboard selection matches pointer |
| Mini-cart / cart qty | Live updates announced; qty inputs labelled per line item; remove controls named |
| Account forms / returns | Loop ids; error summary focus; disabled submit + hint; confirmation heading focus |
| Responsive show/hide | Labels not `display:none` if used with `<label for>`; no interactive content inside `aria-hidden` |

## Keyboard & composite widgets

- Prefer native elements so the browser supplies keyboard behavior.
- For custom composites (tabs, menus, listboxes, grids), implement the matching
  [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) pattern —
  including Escape, arrow keys, Home/End, and typeahead where specified.
- `tabindex="-1"` is for programmatic focus targets (error summaries,
  confirmation headings). Do not use positive `tabindex`.

## Focus management nuances

| Situation | Pattern |
|-----------|---------|
| Sync validation failure on submit | Focus error summary (`tabindex="-1"`). Do not add `role="alert"` to that same focused node. |
| Urgent async error; focus stays on control | Update a pre-existing `role="alert"` (or assertive live) region. |
| Success / view swap (e.g. confirmation) | Focus a heading or primary landmark control that establishes context. |
| Open modal | Move focus into dialog; on close, return to invoking control. |

Never `setTimeout` / polling to “wait until the screen reader finishes.”

## Live regions

| Need | Use |
|------|-----|
| Loading / progress / success (default) | Pre-existing polite `role="status"` (or `aria-live="polite"`), `aria-atomic="true"` — e.g. `carousel-content-announcement.html` |
| Progress where stale info risks a real problem (e.g. double-submit) | `aria-live="assertive"` without `role="status"`/`role="alert"` — e.g. `create-return.html`'s `data-new-return-status` region |
| Immediate danger / blocking mistake | Pre-existing `role="alert"` (reserve for actual errors, not routine progress) |
| Stale messages | Replace text; do not append endlessly |
| Busy UI | `aria-busy="true"` on the updating region while processing |

Note success doesn't always need a text announcement: `create-return.html`
clears its status text on error but, on success, relies on moving focus to the
confirmation heading rather than updating the live region (see
[examples.md #4](examples.md#4-announce-progress-move-focus-for-success)).

Cornerstone off-screen class for SR-only / live text:
`aria-description--hidden`.

## Decorative vs informative

| Intent | Technique |
|--------|-----------|
| Visible decoration, ignore for AT | `aria-hidden="true"` (never on focusable nodes) |
| SR-only text | `.aria-description--hidden` |
| Decorative image | `<img alt="">` (no redundant `title`) |
| Decorative SVG/icon | `aria-hidden="true"`; not in tab order |
| Icon-only control | Accessible name via SR-only text or `aria-label` from `lang` |
| Wrapper hide | Only if every descendant is decorative and none is interactive |

## Contrast (Cornerstone tokens)

| Token | Approx | On white | Text |
|-------|--------|----------|------|
| `color("greys","base")` | #999 | ~2.84:1 | Fails for body/UI text |
| `color("greys","dark")` | #666 | ~5.74:1 | Prefer for text |

Focus indicators need ≥3:1 against adjacent colors. Prefer `:focus-visible`
with a 2px outline as a strong baseline.

## i18n for accessibility strings

- Template: `{{lang 'key.path'}}`
- JS: `{{~inject 'camelKey' (lang 'key.path')}}` then read from injected context
- Applies to `aria-label`, SR-only hints, live-region messages, dialog labels
- Remove keys with no remaining consumer when deleting UI

## Escaping

For merchant- or customer-controlled strings in templates, use `{{value}}`
(double-curly, auto-escapes). Do not use `{{{sanitize value}}}` for those
strings — double-curly is the reliable Cornerstone pattern.

## Authority ladder

1. [SKILL.md](SKILL.md) mandatory rules  
2. WCAG 2.2 AA + ARIA APG for the widget type  
3. Existing Cornerstone templates as structural examples (may predate guidance)
