---
description: Accessibility semantics, headings, names, and translatable strings in templates
globs:
  - "templates/**/*.html"
alwaysApply: false
---

# Template Accessibility

⚠️ **WARNING** - Flag for review if violated

Cornerstone ships to merchants who inherit its accessibility. Flag template changes that
break the checks below. Full guidance:
[`.claude/skills/accessibility/SKILL.md`](../../../.claude/skills/accessibility/SKILL.md).

## Headings
- Exactly **one `<h1>` per page**; heading levels MUST NOT skip (`h1`→`h3` is a violation).
  - ✅ page `<h1>` → per-item `<h2>` when there is no section heading between them
  - ❌ page `<h1>` → per-item `<h3>` (skips `h2`)
- Do **not** repeat the page `<h1>` text as a section heading — a second identical heading is
  duplicate noise for screen-reader users. Drop it or give it distinct text.
- A **status / label is not a heading** — use `<span>`, never `<h5>`/`<h6>`, for status badges.

## Semantics
- Use `<button>` / `<a href>` for actions, `<ul>/<li>` for lists, `<dl>/<dt>/<dd>` for
  label→value pairs. Add `role`/`aria-*` only when HTML can't express the semantics.

## Accessible names
- Every interactive control needs an accessible name.
- Repeated links/buttons with identical visible text MUST carry a distinguishing `aria-label`
  that includes context (the entity id/name) so their purpose is clear out of context.
  - ✅ `<a aria-label="{{lang 'some.key.action_for' id=item.id}}">{{lang 'some.key.action'}}</a>`
  - ❌ many identical `<a>Edit</a>` / `<a>View</a>` links with no distinguishing label

## Translatable strings
- No hardcoded English in ARIA/label attributes. Add a key to `lang/en.json` and reference via
  `{{lang '...'}}` (or `{{~inject 'x' (lang '...')}}` for JS).
- Remove `lang/en.json` keys that no longer have a consumer.

## Unique ids in loops
- Inside `{{#each}}`, derive ids from the item id — never a static id in a loop.
  - ✅ `id="field-{{id}}"`   ❌ `id="field"`

## Output Format

For each violation, comment inline on the element:

> **Accessibility**: `<which check>` — `<what's wrong>`. `<how to fix>` (see
> `.claude/skills/accessibility/SKILL.md`).
