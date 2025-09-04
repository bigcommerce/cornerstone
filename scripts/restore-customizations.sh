#!/bin/bash

# Midwest Nice Theme Customization Recovery Script
# This script helps restore customizations after theme upgrades

set -e

echo "🎨 Midwest Nice Theme Customization Recovery Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "config.json" ]; then
    echo "❌ Error: Please run this script from the theme root directory"
    exit 1
fi

# Check if backup branch exists
if ! git show-ref --verify --quiet refs/heads/backup-before-upgrade; then
    echo "❌ Error: backup-before-upgrade branch not found"
    echo "Please create a backup branch before upgrading:"
    echo "git checkout -b backup-before-upgrade"
    exit 1
fi

echo "✅ Found backup branch: backup-before-upgrade"
echo ""

# Function to restore file from backup
restore_file() {
    local file="$1"
    local description="$2"
    
    if [ -f "$file" ]; then
        echo "🔄 Restoring: $description"
        echo "   File: $file"
        git checkout backup-before-upgrade -- "$file"
        echo "   ✅ Restored successfully"
    else
        echo "⚠️  Warning: File not found: $file"
    fi
    echo ""
}

# Function to apply specific customizations
apply_customization() {
    local description="$1"
    echo "🔧 Applying: $description"
}

echo "🚀 Starting customization recovery..."
echo ""

# 1. Header customizations
restore_file "assets/scss/layouts/header/_header.scss" "Header customizations (logo positioning, mobile menu styling)"

# 2. Product list customizations
restore_file "assets/scss/layouts/products/_productList.scss" "Product list customizations (hover effects, focus states)"

# 3. Product card hover effect
restore_file "assets/scss/components/citadel/cards/_cards.scss" "Product card hover effect (two-image fade transition)"

# 4. Product sale badge customizations
restore_file "assets/scss/layouts/products/_productSaleBadges.scss" "Product sale badge customizations (hover effects)"

# 5. Product swatch customizations
restore_file "assets/scss/layouts/products/_productSwatch.scss" "Product swatch customizations (border radius, spacing)"

# 6. Product view customizations
restore_file "assets/scss/layouts/products/_productView.scss" "Product view customizations (size chart styling)"

# 7. Product details JavaScript customizations
restore_file "assets/js/theme/common/product-details.js" "Product details JavaScript customizations (date selector, cart celebration)"

# 8. NavUser section customizations
restore_file "assets/scss/components/stencil/navUser/_navUser.scss" "NavUser section customizations (styling, positioning, cart behavior)"

# 9. Language customizations
apply_customization "Language customizations (Gift Cards text)"
if [ -f "lang/en.json" ]; then
    # Change Gift Certificates to Gift Cards
    sed -i.bak 's/"gift_cert": "Gift Certificates"/"gift_cert": "Gift Cards"/g' lang/en.json
    sed -i.bak 's/"heading": "Gift Certificates"/"heading": "Gift Cards"/g' lang/en.json
    rm -f lang/en.json.bak
    echo "   ✅ Updated language files"
else
    echo "   ⚠️  Warning: lang/en.json not found"
fi
echo ""

# 10. NavUser background color variable
apply_customization "NavUser background color variable"
if [ -f "assets/scss/settings/stencil/navUser/_settings.scss" ]; then
    # Set navUser background color to #314a6d
    sed -i.bak 's/\$navUser-backgroundColor: stencilColor("navUser-backgroundColor");/\$navUser-backgroundColor: #314a6d;/g' assets/scss/settings/stencil/navUser/_settings.scss
    rm -f assets/scss/settings/stencil/navUser/_settings.scss.bak
    echo "   ✅ Set navUser background color to #314a6d"
else
    echo "   ⚠️  Warning: NavUser settings file not found"
fi
echo ""

echo "🧪 Testing theme build..."
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Theme builds successfully"
else
    echo "   ❌ Theme build failed - please check for errors"
    echo "   Run 'npm run build' for detailed error messages"
fi

echo ""
echo "🎉 Customization recovery complete!"
echo ""
echo "📋 Next steps:"
echo "1. Test the theme thoroughly"
echo "2. Run 'stencil bundle' to create deployment package"
echo "3. Update CUSTOMIZATIONS.md if any changes were made"
echo "4. Commit your changes: git add . && git commit -m 'Restore customizations after upgrade'"
echo ""
echo "📖 For detailed information, see CUSTOMIZATIONS.md"
