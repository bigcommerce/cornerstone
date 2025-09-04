# Theme Upgrade Checklist

Use this checklist when upgrading to newer versions of the BigCommerce Cornerstone theme.

## Pre-Upgrade Steps

- [ ] **Create backup branch:** `git checkout -b backup-before-upgrade`
- [ ] **Document current version:** Note the current theme version
- [ ] **Test current functionality:** Verify all customizations work
- [ ] **Review CUSTOMIZATIONS.md:** Ensure all customizations are documented

## Upgrade Process

- [ ] **Fetch upstream changes:** `git fetch upstream`
- [ ] **Start selective merge:** `git merge upstream/master -X theirs --no-commit`
- [ ] **Resolve any conflicts:** Prioritize upstream changes for core files
- [ ] **Check Node.js version:** Ensure Node.js 20.x is being used
- [ ] **Update dependencies:** `npm install`

## Post-Upgrade Recovery

- [ ] **Run recovery script:** `./scripts/restore-customizations.sh`
- [ ] **Or manually restore:** Follow CUSTOMIZATIONS.md for each customization
- [ ] **Test theme build:** `npm run build`
- [ ] **Test Stencil build:** `stencil bundle`
- [ ] **Verify all customizations:** Use testing checklist below

## Testing Checklist

After upgrade, verify these customizations work:

### Visual Customizations
- [ ] Header logo positioning and mobile menu styling
- [ ] Product card two-image hover effect (fade between images)
- [ ] Product list hover and focus effects
- [ ] Product sale badge hover effects
- [ ] Product swatch styling and spacing
- [ ] Product view size chart styling
- [ ] NavUser section background color (#314a6d)

### Functional Customizations
- [ ] Product details date selector functionality
- [ ] Cart celebration effect on add to cart
- [ ] NavUser section styling and positioning
- [ ] Cart behavior and countPill styling

### Text Customizations
- [ ] "Gift Cards" appears instead of "Gift Certificates"

### Build Verification
- [ ] `npm run build` completes successfully
- [ ] `stencil bundle` completes successfully
- [ ] No critical errors in build output
- [ ] Theme bundle generated successfully

## Final Steps

- [ ] **Update documentation:** Add any new customizations to CUSTOMIZATIONS.md
- [ ] **Commit changes:** `git add . && git commit -m "Restore customizations after upgrade to vX.X.X"`
- [ ] **Test in staging:** Deploy to staging environment for final testing
- [ ] **Update version notes:** Document any issues or changes in this checklist

## Troubleshooting

### Common Issues:
- **Build failures:** Check Node.js version (should be 20.x)
- **Missing customizations:** Run recovery script or manually restore from backup
- **CSS conflicts:** Check for variable name changes in SCSS files
- **JavaScript errors:** Verify import paths and function names

### Recovery Commands:
```bash
# Restore specific file from backup
git checkout backup-before-upgrade -- path/to/file

# Run automated recovery
./scripts/restore-customizations.sh

# Check what changed
git diff backup-before-upgrade -- path/to/file
```

---

**Remember:** Always test thoroughly in a staging environment before deploying to production!
