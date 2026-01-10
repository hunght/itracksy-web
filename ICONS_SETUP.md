# itracksy-web Icon Generation Setup

## 🎨 Overview

The itracksy-web project now has an automated icon generation system that creates all required web icons from a single SVG source file.

---

## 📁 Files Created

### 1. **Source Logo**

- `/public/logo.svg` - Brand logo (copied from itracksy app)
  - Time-tracking themed clock design
  - Purple to pink gradient (#8B5CF6 → #EC4899)
  - Cyan to blue gradient for clock hands (#06B6D4 → #3B82F6)
  - Success green productivity arc (#10B981)

### 2. **Icon Generation Script**

- `/scripts/generate-icons.mjs` - ES6 module script
  - Generates PNG icons in multiple sizes
  - Creates multi-resolution favicon.ico
  - Optimized compression (level 9)
  - Platform-specific naming conventions

---

## 🚀 Usage

### Generate All Icons

```bash
pnpm run generate:icons
```

This command will:

1. Read `/public/logo.svg`
2. Generate PNG icons in various sizes
3. Create a multi-resolution `favicon.ico`
4. Output all files to `/public/`

### Generated Files

The script creates the following files in `/public/`:

| File                         | Size      | Purpose                      |
| ---------------------------- | --------- | ---------------------------- |
| `favicon.png`                | 32×32     | Browser favicon (PNG)        |
| `favicon.ico`                | Multi     | Browser favicon (ICO format) |
| `apple-touch-icon.png`       | 180×180   | iOS home screen icon         |
| `android-chrome-192x192.png` | 192×192   | Android icon (standard)      |
| `android-chrome-512x512.png` | 512×512   | Android icon (high-res)      |
| `icon-300.png`               | 300×300   | Open Graph / social media    |
| `logo-16.png`                | 16×16     | Tiny icon                    |
| `logo-48.png`                | 48×48     | Small icon                   |
| `logo-64.png`                | 64×64     | Medium icon                  |
| `logo-128.png`               | 128×128   | Large icon                   |
| `logo-256.png`               | 256×256   | Extra large icon             |
| `logo-1024.png`              | 1024×1024 | Maximum resolution           |

---

## 🔧 Technical Details

### Dependencies

- **sharp** (v0.33.5) - High-performance image processing
  - Added to `devDependencies`
  - Native module for optimal performance
  - Supports SVG to PNG conversion

### Script Features

1. **SVG to PNG Conversion**
   - High-quality rendering
   - Transparent backgrounds
   - Proper aspect ratio maintenance

2. **Multi-Resolution ICO**
   - Contains 16×16, 32×32, 48×48 sizes
   - Proper ICO file format structure
   - Compatible with all browsers

3. **Platform-Specific Names**
   - Apple Touch Icon for iOS
   - Android Chrome icons for PWA
   - Standard favicon formats

4. **Compression**
   - PNG compression level 9 (maximum)
   - Optimized file sizes
   - Fast loading times

---

## 📝 Package.json Updates

### Added Script

```json
{
  "scripts": {
    "generate:icons": "node scripts/generate-icons.mjs"
  }
}
```

### Added Dependency

```json
{
  "devDependencies": {
    "sharp": "^0.33.5"
  }
}
```

---

## 🎯 When to Regenerate Icons

Regenerate icons whenever:

1. **Logo Design Changes**
   - Update `/public/logo.svg`
   - Run `pnpm run generate:icons`

2. **Brand Color Updates**
   - Modify colors in `logo.svg`
   - Regenerate all icons

3. **New Icon Sizes Needed**
   - Edit `sizes` array in `generate-icons.mjs`
   - Add custom naming logic if needed
   - Regenerate

---

## 🔄 Sync with App Repo

The logo is synced from the main itracksy Electron app:

```bash
# Copy logo from app to web (when needed)
cp ../itracksy/logo.svg public/logo.svg
pnpm run generate:icons
```

---

## 🌐 HTML Integration

### Favicon Links

Add these to your HTML `<head>`:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- Android Chrome -->
<link
  rel="icon"
  type="image/png"
  sizes="192x192"
  href="/android-chrome-192x192.png"
/>
<link
  rel="icon"
  type="image/png"
  sizes="512x512"
  href="/android-chrome-512x512.png"
/>

<!-- Open Graph -->
<meta property="og:image" content="/icon-300.png" />
```

### Next.js Metadata

For Next.js 13+ app directory:

```typescript
// app/layout.tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};
```

---

## 📊 File Sizes

All generated icons are optimized:

- **favicon.ico**: ~4.2 KB (multi-resolution)
- **favicon.png**: ~1.3 KB (32×32)
- **apple-touch-icon.png**: ~9.6 KB (180×180)
- **android-chrome-192x192.png**: ~10 KB
- **android-chrome-512x512.png**: ~29 KB
- **icon-300.png**: ~17 KB
- **logo-1024.png**: ~62 KB (maximum quality)

Total size for all icons: ~133 KB

---

## ✅ Verification

After generating icons, verify:

1. **Files Created**

   ```bash
   ls -lh public/*.png public/*.ico
   ```

2. **File Sizes**
   - Check that files are reasonably sized
   - Ensure no corruption (0 byte files)

3. **Visual Inspection**
   - Open icons in image viewer
   - Check for proper rendering
   - Verify transparency

4. **Browser Testing**
   - Test favicon in browser
   - Check iOS home screen icon
   - Verify Android PWA icon

---

## 🔧 Troubleshooting

### Script Fails

**Error**: "Source SVG not found"

- **Solution**: Ensure `/public/logo.svg` exists
- Copy from app repo if missing

**Error**: "sharp installation failed"

- **Solution**: Run `pnpm install` with full permissions
- May need to rebuild: `pnpm rebuild sharp`

### Icons Look Blurry

- Check source SVG quality
- Ensure viewBox is properly set
- Verify SVG renders correctly in browser

### Wrong Colors

- Update colors in `logo.svg`
- Regenerate all icons
- Clear browser cache

---

## 📚 Related Documentation

- Main app brand guidelines: `../itracksy/BRAND_GUIDELINES.md`
- App icon generation: `../itracksy/scripts/svg-to-icons.js`
- Design tokens: `../itracksy/src/styles/design-tokens.css`

---

## 🎨 Brand Colors Reference

Quick reference for the logo colors:

```css
/* Primary Purple */
--brand-purple: #8b5cf6;

/* Secondary Pink */
--brand-pink: #ec4899;

/* Cyan */
--brand-cyan: #06b6d4;

/* Blue */
--brand-blue: #3b82f6;

/* Success Green */
--brand-green: #10b981;
```

---

**Last Updated:** December 4, 2024
**Version:** 1.0.0
**Status:** ✅ Complete and Working
