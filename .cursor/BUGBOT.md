# Cornerstone Theme - Bugbot Configuration

## Project Overview

This is **Cornerstone** - BigCommerce's reference [Stencil](https://developer.bigcommerce.com/stencil-docs) storefront theme. Merchants inherit this theme's markup, behavior, and **accessibility**, so UI regressions ship to real storefronts.

**Key Directories:**
- **templates/** - Handlebars (`.html`) page and component templates
- **assets/js/theme/** - Theme JavaScript (PageManager modules)
- **assets/scss/** - Component and foundation SCSS
- **lang/** - Translatable strings (`en.json` is the source of truth for all user-visible / ARIA text)

## ⚠️ CRITICAL: Report ALL Violations

**IMPORTANT**: When reviewing PRs, report ALL violations found, not just the first one.

### Review Behavior Requirements

1. **Check ALL applicable rules**: For each changed file, check every rule whose glob pattern matches
2. **Report ALL violations**: Comment on every violation found
3. **Create INLINE comments**: For file-specific rules, create separate inline comments ON EACH FILE
4. **Group violations by rule**: Organize violations by rule type for clarity
5. **Prioritize by severity**: Report CRITICAL violations first, then WARNINGS
6. **Follow exact output format**: Each rule specifies an exact output format - use it precisely

## 📁 Project Rules

All rules are defined in `.cursor/rules/` with individual `RULE.md` files:

### Warning Rules (Flag for Review)
| Rule                            | Description                                                                 | Scope                     |
|---------------------------------|-----------------------------------------------------------------------------|---------------------------|
| `template-accessibility`        | Semantics, headings, accessible names, translatable ARIA strings, unique ids | `templates/**/*.html`     |

## 🔍 Rule Application

Rules are scoped using glob patterns in their frontmatter:
- Rules with `globs` only apply to matching files
- Rules with `alwaysApply: true` apply to every PR

The authoritative accessibility guidance for this repo lives in
[`.claude/skills/accessibility/SKILL.md`](../.claude/skills/accessibility/SKILL.md); these rules are the
review-time subset of it.
