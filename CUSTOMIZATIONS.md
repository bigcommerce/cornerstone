# Midwest Nice Theme Customizations

This document tracks all customizations made to the BigCommerce Cornerstone theme that need to be preserved during future upgrades.

## Overview
- **Theme Version:** 6.16.2 (upgraded from 6.12.0)
- **Last Updated:** September 2024
- **Customization Count:** 8 major areas

## Customization Inventory

### 1. Header Customizations
**Files:** `assets/scss/layouts/header/_header.scss`
- **Logo positioning:** `margin: 0 auto`, `width: 70%` for mobile
- **Border styling:** Commented-out `border-bottom` lines preserved
- **Mobile menu toggle:** Custom styling with `background: $header-font-color`, `top: remCalc(27)`

### 2. Product List Customizations
**Files:** `assets/scss/layouts/products/_productList.scss`
- **Focus/hover effects:** Custom `:focus-within` and `.focus-within` styling for `.listItem-figureBody`
- **Interactive states:** Enhanced hover and focus behavior for product list items

### 3. Product Card Hover Effect
**Files:** `assets/scss/components/citadel/cards/_cards.scss`
- **Two-image fade effect:** Product cards with two images that fade between on hover
- **Key CSS:**
  ```scss
  .card-image-2 {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 2;
  }
  .card-figure:hover .card-image-2 {
      opacity: 1;
  }
  ```

### 4. Product Sale Badge Customizations
**Files:** `assets/scss/layouts/products/_productSaleBadges.scss`
- **Hover effects:** Multiple `.product:hover .sold-out-flag-sash` rules
- **Custom styling:** Enhanced sold-out badge behavior on product hover

### 5. Product Swatch Customizations
**Files:** `assets/scss/layouts/products/_productSwatch.scss`
- **Border radius:** Custom `border-radius` for `.form-option.form-option-swatch`
- **Spacing:** `margin-right: .75rem` for form options
- **Variant styling:** `border-radius` for `.form-option-variant--color, .form-option-variant--pattern`

### 6. Product View Customizations
**Files:** `assets/scss/layouts/products/_productView.scss`
- **Size chart styling:** Reduced padding for `table.size-chart th, td`
- **Product detail page:** Custom table styling for size charts

### 7. Product Details JavaScript Customizations
**Files:** `assets/js/theme/common/product-details.js`
- **Date selector function:** `updateDateSelector` function for custom date option handling
- **Cart celebration:** `addToCartCelebration` function for visual effect on adding to cart
- **Import paths:** Updated to use relative paths for `nod`, `form-utils`, and `forms`

### 8. NavUser Section Customizations
**Files:** 
- `assets/scss/settings/stencil/navUser/_settings.scss`
- `assets/scss/components/stencil/navUser/_navUser.scss`

**Settings:**
- **Background color:** `$navUser-backgroundColor: #314a6d;`

**Styling:**
- **Section styling:** Custom background and border-radius for `.navUser-section--styled`
- **Action styling:** Different font-weight (normal vs bold), custom font-size (14px)
- **Cart styling:** Specific margin-top (12px mobile, 2px desktop), custom padding
- **CountPill styling:** Commented out background, custom positioning (left: 17px, top: 14px)
- **Cart label display:** Custom display settings for different breakpoints

### 9. Language Customizations
**Files:** `lang/en.json`
- **Gift Cards:** Changed "Gift Certificates" to "Gift Cards" in multiple locations
  - `"gift_cert": "Gift Cards"`
  - `"heading": "Gift Cards"`

### 10. Footer Template Customizations
**Files:** `templates/components/common/footer.html`
- **Duplicate info removal:** Removed duplicate store information section
- **Clean layout:** Store info now displays only once in the footer

### 11. Klaviyo Script Integration
**Files:** `templates/layout/base.html`
- **Klaviyo initialization:** Added Klaviyo object initialization script to base layout
- **Global tracking:** Ensures Klaviyo tracking works across all pages
- **Newsletter integration:** Klaviyo footer form integration preserved

## Template Customizations

### Product Card Template
**Files:** `templates/components/products/card.html`
- **Two-image structure:** Contains `card-image-2` span for hover effect
- **Conditional rendering:** Shows second image when `images.length > 1`

## Upgrade Strategy

### Before Upgrading:
1. **Backup current theme:** Create a backup branch
2. **Review this document:** Ensure all customizations are documented
3. **Test current functionality:** Verify all customizations work

### During Upgrade:
1. **Use selective merge:** `git merge upstream/master -X theirs --no-commit`
2. **Resolve conflicts:** Prioritize upstream changes for core files
3. **Preserve customizations:** Manually restore customizations from backup

### After Upgrading:
1. **Restore customizations:** Apply each customization from this document
2. **Test functionality:** Verify all customizations work with new version
3. **Update documentation:** Add any new customizations to this file
4. **Build and test:** Run `stencil bundle` to ensure everything works

## Critical Files to Monitor

### SCSS Files:
- `assets/scss/layouts/header/_header.scss`
- `assets/scss/layouts/products/_productList.scss`
- `assets/scss/components/citadel/cards/_cards.scss`
- `assets/scss/layouts/products/_productSaleBadges.scss`
- `assets/scss/layouts/products/_productSwatch.scss`
- `assets/scss/layouts/products/_productView.scss`
- `assets/scss/components/stencil/navUser/_navUser.scss`
- `assets/scss/settings/stencil/navUser/_settings.scss`

### JavaScript Files:
- `assets/js/theme/common/product-details.js`

### Template Files:
- `templates/components/products/card.html`
- `templates/components/common/footer.html`
- `templates/layout/base.html`

### Language Files:
- `lang/en.json`

### Configuration Files:
- `config.json` (usually preserved)
- `schema.json` (usually preserved)
- `config.stencil.json` (usually preserved)

## Testing Checklist

After each upgrade, verify:
- [ ] Header logo positioning and mobile menu styling
- [ ] Product list hover and focus effects
- [ ] Product card two-image hover effect
- [ ] Product sale badge hover effects
- [ ] Product swatch styling and spacing
- [ ] Product view size chart styling
- [ ] Product details date selector and cart celebration
- [ ] NavUser section background color (#314a6d) and styling
- [ ] Language text shows "Gift Cards" instead of "Gift Certificates"
- [ ] Footer displays store info only once (no duplicates)
- [ ] Klaviyo scripts are properly initialized and working
- [ ] Theme builds successfully with `stencil bundle`

## Notes

- **Version 6.16.2:** Successfully upgraded from 6.12.0 with all customizations preserved
- **Build Status:** All customizations work correctly with current version
- **Dependencies:** Node.js 20.x required for Stencil CLI compatibility
- **Last Tested:** September 2024

---

**Remember:** Always test thoroughly after upgrades and update this document with any new customizations or changes to existing ones.
