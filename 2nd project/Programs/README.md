# Program Cards Component

A fully accessible, responsive card component for displaying educational programs with flip interaction. Built with vanilla HTML/CSS/JS.

## Features

- ✅ **Accessible**: WCAG 2.2 AA compliant with full ARIA support
- ✅ **Keyboard Navigation**: Tab, Enter, Space, and Escape keys
- ✅ **Responsive**: Adapts from mobile (1 column) to desktop (4 columns)
- ✅ **Flip Animation**: Smooth 3D card flip with reduced-motion support
- ✅ **Performant**: Lazy-loaded images, CSS transforms only
- ✅ **Zero Dependencies**: Pure vanilla JavaScript

## Files

```
├── program-card.html    # Demo page
├── program-card.css     # Styles (BEM naming)
├── program-card.js      # Component logic
├── programs.json        # Sample data
└── README.md           # This file
```

## Quick Start

### 1. Setup

Place all files in the same directory:
- `program-card.html`
- `program-card.css`
- `program-card.js`
- `programs.json`

### 2. Open Demo

Open `program-card.html` in your browser to see all 6 program cards.

### 3. Integration

Add to your page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="program-card.css" />
</head>
<body>
  <div class="program-cards__grid" id="programCardsGrid"></div>
  <script src="program-card.js"></script>
</body>
</html>
```

## Data Schema

Each program card requires the following JSON structure:

```json
{
  "id": "unique-program-id",
  "title": "Program Name",
  "category": "robotics|art|stem|speaking|camp|event",
  "ageGrade": "Grades 3–6",
  "duration": "1 Day | 9:00–10:30 AM",
  "location": "On-site @ YRES",
  "dateRange": "Nov 15, 2025",
  "price": 45,
  "level": "Beginner|Intermediate|Advanced",
  "prereqs": ["Optional prerequisite"],
  "tags": ["Tag1", "Tag2", "Tag3"],
  "thumbnail": "https://example.com/image.webp",
  "alt": "Image description",
  "shortBlurb": "Brief 1-2 sentence description",
  "details": [
    "Detail point 1",
    "Detail point 2",
    "Detail point 3"
  ],
  "ctaText": "Register",
  "ctaHref": "/register/program-id",
  "spotsLeft": 6,
  "mode": "in_person|online|hybrid"
}
```

## Usage

### Basic Initialization

The component auto-initializes on page load:

```javascript
// Loads programs.json automatically
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("programCardsGrid");
  const data = await loadPrograms();
  
  initProgramCards(container, data);
});
```

### Custom Options

```javascript
initProgramCards(container, data, {
  interaction: "flip",           // Interaction mode
  lineClamp: { title: 2 },       // Lines before truncation
  analytics: (event, payload) => {
    // Track card_flip, card_flip_back events
    console.log(event, payload);
  }
});
```

### Load Custom Data

```javascript
// Instead of programs.json, use your own data
const customData = [
  { id: "prog-1", title: "My Program", /* ... */ }
];

initProgramCards(container, customData);
```

## Key CSS Classes

### Layout
- `.program-cards__grid` - Responsive grid container
- `.program-card` - Individual card wrapper
- `.program-card__flipper` - 3D flip container

### Card Front
- `.program-card__front` - Front face
- `.program-card__image` - 16:9 thumbnail
- `.program-card__category` - Category badge
- `.program-card__title` - Program title
- `.program-card__meta` - Age, duration, location info
- `.program-card__tags` - Skill tags
- `.program-card__spots` - "X spots left" badge
- `.program-card__btn--secondary` - "More Info" button
- `.program-card__btn--primary` - "Register" CTA

### Card Back
- `.program-card__back` - Back face
- `.program-card__blurb` - Short description
- `.program-card__detail-list` - Bullet points
- `.program-card__close` - Close button (✕)

### States
- `[aria-expanded="true"]` - Card is flipped
- `.program-card__btn--disabled` - Sold out state

## Accessibility

### ARIA Attributes

- `aria-expanded` - Indicates flip state (true/false)
- `aria-controls` - Links button to back panel
- `aria-labelledby` - Links back panel to title
- `aria-hidden` - Hides inactive face from screen readers
- `role="region"` - Marks back panel as landmark

### Keyboard Support

| Key | Action |
|-----|--------|
| `Tab` | Navigate between cards and buttons |
| `Enter` or `Space` | Flip card when "More Info" focused |
| `Escape` | Close flipped card |
| `Tab` (when flipped) | Navigate back face content |

### Focus Management

- Focus ring visible (2px blue outline)
- Focus returns to "More Info" button on close
- Only visible face is keyboard-accessible
- Close button receives focus when card flips

## Responsive Breakpoints

| Screen Width | Columns |
|--------------|---------|
| < 480px | 1 column |
| 481–768px | 2 columns |
| 769–1024px | 3 columns |
| > 1024px | 4 columns |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Images**: WebP format, lazy-loaded, max 80KB each
- **Animations**: CSS transforms only (no layout thrashing)
- **Bundle Size**: ~6KB gzipped (HTML+CSS+JS, excluding images)
- **LCP Target**: < 2.5s on Fast 3G

## Reduced Motion

Users with `prefers-reduced-motion: reduce` will see:
- Instant flip (no 3D rotation animation)
- No image zoom on hover
- Maintained functionality

## Category Colors

| Category | Color |
|----------|-------|
| `robotics` | Blue (#0077ff) |
| `art` | Pink (#e91e63) |
| `speaking` | Orange (#ff9800) |
| `stem` | Green (#2e8b57) |
| `camp` | Purple (#7b61ff) |
| `event` | Cyan (#00bcd4) |

## Analytics Events

When analytics callback is provided, these events fire:

```javascript
analytics("card_flip", {
  id: "prog-robotics-dancer",
  title: "LEGO Robotics: Dancer",
  category: "robotics",
  position: 0
});

analytics("card_flip_back", { /* same payload */ });
```

## Troubleshooting

### Cards not appearing
- Ensure `programs.json` is in the same directory
- Check browser console for errors
- Verify JSON is valid (no trailing commas)

### Flip animation not working
- Check `transform-style: preserve-3d` is supported
- Verify no CSS overrides on `.program-card__flipper`

### Images not loading
- Verify image URLs are accessible
- Check CORS if loading from external domain
- Use relative paths for local images

### Keyboard navigation issues
- Ensure `tabindex` isn't set on container
- Check for JavaScript errors in console
- Verify `aria-expanded` is toggling correctly

## Customization

### Change Card Colors

Edit `:root` variables in CSS:

```css
:root {
  --focus: #0a66ff;        /* Focus ring color */
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.16);
}
```

### Adjust Card Size

```css
.program-card {
  max-width: 400px;  /* Default: 360px */
}
```

### Modify Grid Gaps

```css
.program-cards__grid {
  gap: 2rem;  /* Default: 1.5rem */
}
```

## License

Free to use for educational and commercial projects.

## Support

For issues or questions, check:
1. Browser console for errors
2. HTML structure matches demo
3. JSON data validates
4. CSS/JS files are loaded

---

**Version**: 1.0  
**Last Updated**: October 2025