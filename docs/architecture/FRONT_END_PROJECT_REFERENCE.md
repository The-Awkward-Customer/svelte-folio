# Svelte Folio - Project Reference

## 🏗️ Core Technologies

### Framework & Build

- **Svelte 5** - Latest version with runes ($state, $derived, $effect)
- **SvelteKit** - Full-stack framework with SSR/SSG
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety throughout
- **Vercel Adapter** - Deployment target

### Database & Auth

- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Primary database
- **Docker Compose** - Local database setup
- **Oslo Crypto** - Authentication utilities
- **Argon2** - Password hashing

### Styling & Design

- **CSS Custom Properties** - Theme system with 3 themes (light/dark/high-contrast)
- **Geist Font Family** - Primary and mono variants
- **Design Tokens** - Comprehensive spacing, typography, color system
- **Container Queries** - Modern responsive design
- **CSS Transitions** - Smooth interactions

### Animation & Graphics

- **GSAP** - Professional animation library
- **Canvas API** - Custom graphics and animations
- **SVG** - Vector graphics and icons
- **CSS Transforms** - Hardware-accelerated animations

## 🧩 Component Architecture

### Layout Components

```
layout/
├── BasicLayout.svelte     # Standard page wrapper
├── Grid.svelte           # CSS Grid container
├── GridItem.svelte       # Grid item wrapper
└── Side                  # Sidebar layouts
```

### Navigation Components

```
topNav/
├── TopNav.svelte         # Main navigation bar
└── ChatTrigger.svelte    # Interactive profile trigger

navigation/
├── LinkList.svelte       # Navigation link groups
├── OverlayMenu.svelte    # Mobile/overlay navigation
├── SideBar.svelte        # Sidebar navigation
└── TopBar.svelte         # Top navigation bar
```

### Content Components

```
content/
├── IntroText.svelte           # Introduction text blocks
├── SideNote.svelte            # Sidebar annotations
├── SimpleContentSection.svelte # Basic content wrapper
├── image.svelte               # Image component
└── Hero/                      # Hero section components
    ├── HeroButton.svelte
    ├── HeroIntro.svelte
    ├── HeroRoot.svelte
    └── HeroTitle.svelte
```

### Interactive Components

```
accordian/
├── Accordian.svelte           # Main accordion component
└── accordion-items/           # Content modules
    ├── Experience.svelte
    ├── Introduction.svelte
    └── Process.svelte

Dialog/                        # Modal system
├── DialogRoot.svelte          # Main dialog container
├── DialogHeader.svelte        # Dialog header
├── DialogFooter.svelte        # Dialog footer
├── DialogContent.svelte       # Content sections
└── [Various dialog types]     # Fresha, TestOne, TestTwo, TestThree
```

### Action Components

```
actions/
├── Button.svelte         # Standard button
├── GemButton.svelte      # Special styled button
├── IconButton.svelte     # Icon-only button
├── Link.svelte           # Link component
└── LinkList.svelte       # Link collections
```

### Media Components

```
cards/
├── ImageCard.svelte      # Image display cards
├── TextCard.svelte       # Text content cards
└── VideoCard.svelte      # Video display cards

media/
└── VideoTile.svelte      # Video tile component
```

### Feedback Components

```
feedback/
├── Callout.svelte           # Alert/notice component
├── ProgressIndicator.svelte # Loading indicators
└── ProgressToast.svelte     # Toast notifications
```

## 🎨 Animation System

### GSAP Text Animations

```typescript
// Core animations
shuffleText()    // Character scramble effect
waveText()       // Wave motion animation
typewriterText() // Typewriter effect

// Features
- Character-by-character animation
- Layout shift prevention
- Reduced motion support
- Cleanup utilities
- TypeScript types
```

### Animation Patterns

- **Staggered animations** - Sequential character reveals
- **Easing functions** - Smooth motion curves
- **Timeline management** - Complex animation sequences
- **Performance optimization** - Hardware acceleration

### Canvas Animations

- **AnimatedTextPath.svelte** - Text following curved paths
- **CanvasAnimation.svelte** - Custom canvas graphics
- **Noise generation** - Procedural textures

## 🗄️ State Management

### Svelte 5 Runes Pattern

```typescript
// State management with runes
let state = $state(initialValue);
const derived = $derived(computation);
$effect(() => {
  /* side effects */
});
```

### Store Patterns

```
stores/
├── dialogManager.svelte.ts      # Modal state management
├── accordianManager.svelte.ts   # Accordion state
└── weatherDebugManager.svelte.ts # Debug utilities
```

### State Features

- **Persistent storage** - localStorage integration
- **Debug modes** - Development utilities
- **Type safety** - Full TypeScript support
- **Reactive updates** - Automatic UI updates

## 🎯 Design System

### Theme Architecture

```css
/* Three-tier theme system */
:root                    /* Light theme (default) */
[data-theme="dark"]      /* Dark theme */
[data-theme="high-contrast"] /* Accessibility theme */
```

### Token System

- **Typography** - 15 font sizes, 5 weights
- **Spacing** - 15-step spacing scale
- **Colors** - Semantic color system
- **Borders** - 5 radius values
- **Shadows** - 3 elevation levels

### Responsive Design

- **Container queries** - Component-level responsiveness
- **Fluid typography** - clamp() functions
- **Mobile-first** - Progressive enhancement
- **Breakpoint system** - Consistent media queries

## 🔧 Utilities & Composables

### Composables

```typescript
useWeather.svelte.ts  // Weather API integration
- Geolocation handling
- IP-based fallback
- Cache management
- Error handling
- Debug modes
```

### Utility Functions

```
utils/
├── noiseGenerator.ts  # Procedural noise
└── shuffle.ts         # Array shuffling
```

### Type Definitions

```
types/
├── weather.ts         # Weather API types
├── textPath.ts        # Animation types
├── icons.ts           # Icon system types
└── weatherDebug.ts    # Debug types
```

## 🚀 Development Features

### Build & Deploy

- **Hot reload** - Instant development feedback
- **Type checking** - Real-time TypeScript validation
- **Code formatting** - Prettier integration
- **Linting** - ESLint configuration
- **Testing** - Playwright E2E tests

### Debug Tools

- **Weather debug panel** - API testing utilities
- **Dialog manager** - Modal state inspection
- **Theme switcher** - Runtime theme changes
- **Console logging** - Structured debug output

### Performance

- **Code splitting** - Automatic route-based splitting
- **Tree shaking** - Dead code elimination
- **Asset optimization** - Image and font optimization
- **Caching strategies** - API response caching

## 📁 Project Structure

```
frontend/src/
├── lib/
│   ├── animations/        # GSAP animation system
│   ├── components/        # Reusable UI components
│   ├── composables/       # Reactive utilities
│   ├── config/           # Configuration files
│   ├── server/           # Server-side utilities
│   ├── stores/           # State management
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── routes/               # SvelteKit pages
└── static/              # Static assets
```

## 🔄 Redundancies & Optimizations

### Identified Redundancies

1. **Navigation components** - Multiple similar nav implementations
2. **Button variants** - Overlapping button component functionality
3. **Layout components** - Similar grid/layout patterns
4. **Dialog components** - Multiple test dialogs with similar structure

### Optimization Opportunities

1. **Component consolidation** - Merge similar components
2. **Prop standardization** - Consistent component APIs
3. **Style deduplication** - Shared CSS patterns
4. **Bundle optimization** - Reduce duplicate code

## 🎪 Capabilities

### Interactive Features

- **Smooth animations** - GSAP-powered interactions
- **Responsive design** - Works across all devices
- **Accessibility** - WCAG compliant with high-contrast mode
- **Theme switching** - Runtime theme changes
- **Modal system** - Accessible dialog management
- **Weather integration** - Real-time weather data

### Technical Capabilities

- **Type safety** - Full TypeScript coverage
- **Server-side rendering** - SEO-friendly pages
- **Progressive enhancement** - Works without JavaScript
- **Modern CSS** - Container queries, custom properties
- **Performance** - Optimized builds and caching
- **Developer experience** - Hot reload, debugging tools

### Content Management

- **Accordion system** - Expandable content sections
- **Card layouts** - Flexible content presentation
- **Media handling** - Images, videos, and graphics
- **Navigation** - Multiple navigation patterns
- **Feedback systems** - Toasts, callouts, progress indicators

---

_Generated: February 2025 | Framework: Svelte 5 + SvelteKit_
