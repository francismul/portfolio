# Francis Mule Portfolio

A modern, interactive portfolio web app for Francis Mule, Software Engineer.

## Features

- **Three.js Animated Hero**: Eye-catching 3D particle background for the hero section.
- **Custom Cursor & Matrix Rain**: Futuristic UI with animated cursor and Matrix-style rain effect.
- **Responsive Navigation**: Hamburger menu with smooth transitions and overlay for mobile devices.
- **Terminal Easter Egg**: Fun interactive terminal with commands (`help`, `skills`, `contact`, `clear`, `sudo hire_francis`).
- **Section Reveal & Scroll Progress**: Animated section reveals and scroll progress bar for engaging navigation.
- **Skills & Projects Showcase**: Cards for skills and projects, with tech tags and external links.
- **Contact Section**: Easy access to email, LinkedIn, GitHub, and Twitter.
- **Progressive Web App (PWA)**: Offline support, installable on devices, with manifest and service worker.
- **Offline Fallback**: Custom offline page for seamless experience when disconnected.
- **Dynamic Caching**: Service worker caches images, scripts, styles, and JSON APIs, with 30-day inactivity expiration.
- **GitHub Pages CI/CD**: Automatic deployment via GitHub Actions on every push to `main`.

## Getting Started

1. Clone the repository.
2. Push changes to the `main` branch to auto-deploy via GitHub Actions.
3. Access your portfolio at the GitHub Pages URL.

## Development

### Available Scripts

- `npm start` or `pnpm start` - Start development server with hot reloading
- `npm run build` or `pnpm run build` - Build for production with source maps
- `npm run build:obfuscated` or `pnpm run build:obfuscated` - Build for production with JavaScript obfuscation (no source maps)
- `npm run optimize-images` or `pnpm run optimize-images` - Optimize images for web (WebP, multiple sizes, compression)
- `npm run build:with-images` or `pnpm run build:with-images` - Optimize images then build
- `npm run build:obfuscated:with-images` or `pnpm run build:obfuscated:with-images` - Optimize images then build with obfuscation

### Image Optimization

The project includes automatic image optimization using Sharp:

- **WebP conversion** - Modern format with 25-35% better compression
- **Multiple responsive sizes** - 400w, 800w, 1200w, 1600w, 2000w for different screen sizes
- **Quality optimization** - Smart compression without quality loss
- **JPEG fallbacks** - For older browsers that don't support WebP
- **Automatic processing** - All images in `src/assets/images/` (except icons)

#### How to Use Optimized Images

**For CSS Background Images:**
The project automatically uses optimized images via CSS classes:

```html
<!-- Instead of inline styles -->
<div class="project-image oracle-prophecy-bg"></div>
<div class="project-image password-generator-bg"></div>
<div class="project-image wild-kingdom-bg"></div>
```

**CSS Implementation:**
```css
.oracle-prophecy-bg {
  background-image: image-set(
    url('../assets/images/optimized/oracle_ai_prophecy.webp') type('image/webp'),
    url('../assets/images/optimized/oracle_ai_prophecy.jpg') type('image/jpeg')
  );
}
```

**For `<img>` Tags with Responsive Images:**
```html
<img 
  src="assets/images/optimized/image.jpg" 
  srcset="
    assets/images/optimized/image-400w.webp 400w,
    assets/images/optimized/image-800w.webp 800w,
    assets/images/optimized/image-1200w.webp 1200w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description"
/>
```

Use `pnpm run optimize-images` to process images before building, or use the combined commands for full automation.

### Obfuscated Build

The `build:obfuscated` command creates a production build with:
- No source maps for security
- High-level JavaScript obfuscation using javascript-obfuscator
- Code that's difficult to read and reverse-engineer
- Maintained functionality and performance
- Protection of intellectual property

Use this for production deployments where code protection is important.

---

Built with HTML, CSS, JavaScript, and Three.js. Fully static and ready for GitHub Pages hosting.
