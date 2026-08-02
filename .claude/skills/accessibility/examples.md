# Accessibility examples (Cornerstone)

Concrete good/bad patterns. Prefer these shapes over inventing new ARIA.
See also returns templates listed in [SKILL.md](SKILL.md).

## 1. Loop ids — never static

**Bad** — duplicate ids across rows:

```html
{{#each items}}
  <label for="qty">{{lang 'account.orders.return.quantity'}}</label>
  <input id="qty" name="qty[{{id}}]" type="number">
{{/each}}
```

**Good** — id derived from item id (real pattern, `templates/pages/create-return.html`):

```html
{{#each items}}
  <label id="newReturn-qtyLabel-{{id}}" for="qty-{{id}}">{{lang 'account.orders.return.quantity'}}</label>
  <select id="qty-{{id}}" aria-labelledby="newReturn-qtyLabel-{{id}} newReturn-itemName-{{id}}">...</select>
{{/each}}
```

## 2. Label hidden at a breakpoint → `aria-labelledby`

**Bad** — `<label for>` on a label class that is `display:none` outside the
`medium` breakpoint (`.newReturn-controlLabel` in
`assets/scss/components/stencil/createReturn/_createReturn.scss` — name
disappears from the accessibility tree on small and large screens):

```html
<label class="newReturn-controlLabel" for="resolution-{{id}}">
  {{lang 'account.returns.request'}}
</label>
<select id="resolution-{{id}}" class="form-select">...</select>
```

**Good** — name via `aria-labelledby`, unaffected by the label's `display:none`
(real pattern, `templates/pages/create-return.html`):

```html
<label class="newReturn-controlLabel" id="newReturn-resolutionLabel-{{id}}" for="resolution-{{id}}">
  {{lang 'account.returns.request'}}
</label>
<select
  class="form-select form-select--small"
  id="resolution-{{id}}"
  aria-labelledby="newReturn-resolutionLabel-{{id}}"
>
  ...
</select>
```

Real code keeps `for` on the label too — harmless once `aria-labelledby` is
present, since `aria-labelledby` wins the accessible-name computation.

Compose multiple name sources when needed:

```html
aria-labelledby="newReturn-qtyLabel-{{id}} newReturn-itemName-{{id}}"
```

## 3. The two “hiddens”

**Bad** — `aria-hidden` on a focusable control (removes it from AT while still
in tab order):

```html
<button aria-hidden="true" type="button">{{lang 'common.close'}}</button>
```

**Good** — decorative glyph hidden; control keeps a real name:

```html
<button type="button">
  <span aria-hidden="true">&rarr;</span>
  <span class="aria-description--hidden">{{lang 'common.next'}}</span>
</button>
```

| Goal | Class / attribute |
|------|-------------------|
| Seen, not heard | `aria-hidden="true"` |
| Heard, not seen | `aria-description--hidden` |

## 4. Announce progress; move focus for success

**Bad** — visual-only state; nothing for AT:

```html
<!-- only a spinner in the DOM; nothing for AT -->
<div class="loadingSpinner"></div>
```

**Good, less urgent (`templates/components/carousel-content-announcement.html`)**
— polite status, pre-existing node, text replaced in place:

```html
<span data-carousel-content-change-message class="aria-description--hidden"
      aria-live="polite" role="status"></span>
```

**Good, must interrupt (`templates/pages/create-return.html` +
`assets/js/theme/create-return.js`)** — the returns flow uses `aria-live="assertive"`
instead of polite, because letting the shopper keep reading while a submit is in
flight risks a duplicate submit or navigating away mid-request:

```html
<p class="aria-description--hidden" aria-live="assertive" aria-atomic="true" data-new-return-status></p>
```

```js
form.setAttribute('aria-busy', 'true');
this.announce(this.context.submittingMessage); // updates data-new-return-status
// ...on error, clear it:
this.announce('');
// on success: no text update — focus moves to the confirmation heading instead (see #9)
form.removeAttribute('aria-busy');
```

Default to polite for progress/success text. Reach for assertive only when a
shopper acting on stale information could cause a real problem — and prefer it
to `role="alert"`, which is meant for errors, not routine progress.

## 5. Failed submit — two valid patterns, don't mix them

Rule 3 gives two options for a failed submit. Pick one per error box — don't
combine them on the same node.

**Bad** — nothing happens for AT users; error is visual only:

```html
<div id="error-box" class="alertBox alertBox--error" style="display: none;"></div>
```
```js
errorBox.style.display = ''; // no role, no focus move — silent to screen readers
```

**Option A — focus the summary** (use when you want to pull the shopper
straight to the error, e.g. it's far from the trigger control):

```html
<div id="error-box" class="alertBox alertBox--error" style="display: none;" tabindex="-1">...</div>
```
```js
errorBox.style.display = '';
errorBox.focus(); // do NOT also add role="alert" here — double announcement risk
```

**Option B — keep focus on the control, let the alert announce it** (real
pattern, `templates/pages/create-return.html` — focus stays on Submit so the
shopper can immediately retry without navigating back to it):

```html
<div id="return-new-error" class="alertBox alertBox--error" style="display: none;" role="alert">
  <p class="newReturn-errorHeading">{{lang 'account.returns.error_heading'}}</p>
  <p class="alertBox-message">{{lang 'common.generic_error'}}</p>
</div>
```
```js
errorBox.style.display = ''; // pre-existing node + role="alert" announces this; no .focus() call
```

Field-level errors (when a flow has per-field validation) apply regardless of
which option you pick: `aria-invalid="true"` on the invalid control,
`aria-describedby` pointing at its error text, and a real `lang/en.json` key
for that message. The additional-note character-limit error
(`newReturn-additionalNote-error`) is a real example of this in `create-return.html`.

## 6. Disabled submit that stays explainable

**Bad** — `aria-disabled` on a wrapper (screen reader still reaches an
enabled-looking button inside it; state isn't exposed on the control):

```html
<div aria-disabled="true">
  <button type="submit">{{lang 'account.returns.submit'}}</button>
</div>
```

**Good** (real pattern, `templates/pages/create-return.html`) — `aria-disabled`
on the control itself, kept focusable/discoverable, hint linked via
`aria-describedby`, JS blocks activation:

```html
<p id="return-new-submitHint-disabled" class="aria-description--hidden">
  {{lang 'account.returns.submit_hint'}}
</p>
<input class="button button--primary" id="return-new-submitBtn" type="submit"
       value="{{lang 'account.returns.submit'}}"
       aria-disabled="true"
       aria-describedby="return-new-submitHint-disabled">
```

```js
// create-return.js: removes the hint once valid so the label alone is
// announced — avoids a stale "why is this disabled" hint once it isn't.
submitBtn.setAttribute('aria-disabled', String(!isValid));
submitBtn[isValid ? 'removeAttribute' : 'setAttribute']('aria-describedby', 'return-new-submitHint-disabled');
```

```js
// gate activation in JS — aria-disabled does not block click/Enter natively
form.addEventListener('submit', event => {
  event.preventDefault();
  if (submitBtn.getAttribute('aria-disabled') === 'true') return;
  // ...proceed
});
```

If the control can genuinely be removed from the tab order instead (no need to
explain why it's inactive), prefer plain `disabled` — it's simpler and native.
Reach for `aria-disabled` specifically when shoppers benefit from discovering
*why* a control is inactive, as here.

## 7. Translatable ARIA — no hardcoded English

**Bad:**

```html
<button type="button" aria-label="Close dialog">×</button>
```

**Good — template:**

```html
<button type="button" aria-label="{{lang 'common.close'}}">
  <span aria-hidden="true">×</span>
</button>
```

**Good — JS string from inject:**

```html
{{~inject 'carouselPlayPauseButtonAriaPlay' (lang 'carousel.play_pause_button_aria_play')}}
```

```js
button.setAttribute('aria-label', this.context.carouselPlayPauseButtonAriaPlay);
```

## 8. Merchant/customer content escaping

**Bad:**

```html
<h2>{{{sanitize product.name}}}</h2>
```

**Good:**

```html
<h2>{{product.name}}</h2>
```

## 9. Success / confirmation focus

**Bad** — focus the entire confirmation container or nothing at all:

```js
document.querySelector('.confirmation').focus();
```

**Good** — focus the confirmation heading (`tabindex="-1"`):

```html
<h1 class="newReturn-title" data-new-return-confirmation-heading tabindex="-1">
  {{lang 'account.returns.from_order' id=id}}
  {{lang 'account.returns.submitted_successfully'}}
</h1>
```

```js
document.querySelector('[data-new-return-confirmation-heading]').focus();
```
