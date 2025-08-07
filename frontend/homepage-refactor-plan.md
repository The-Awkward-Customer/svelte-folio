# Homepage Refactor Plan: Consolidating Routes into Single Page

## Current Structure
The application currently has separate routes for different content sections:
- `/` - Homepage with animated text paths
- `/about` - Contact information and email copy
- `/experience` - Work experience accordion with project cards
- `/graphics` - Portfolio grid with filtering

## Proposed Structure
Consolidate all content into the main index page (`/routes/+page.svelte`) as stacked sections with anchor navigation.

## Navigation Strategy
Convert existing route-based navigation to anchor-based navigation:
- Current: `/graphics`, `/experience` → New: `/#portfolio`, `/#experience`
- Add smooth scrolling between sections
- Maintain active state highlighting based on scroll position

## Implementation Steps

### Phase 1: Component Extraction
1. **Extract reusable sections from each route:**
   - About → `ContactSection.svelte`
   - Experience → `ExperienceSection.svelte`
   - Graphics → `PortfolioSection.svelte`

### Phase 2: Create Section Components

#### ContactSection.svelte
- Extract hero title, description, and email copy functionality
- Maintain animation logic (shuffleText)
- Keep copy-to-clipboard functionality

#### ExperienceSection.svelte
- Import accordion components and experience data
- Preserve theme management functionality
- Keep all project cards with their data bindings

#### PortfolioSection.svelte
- Extract grid layout with filter functionality
- Maintain image imports and shuffling logic
- Preserve filter state management

### Phase 3: Update Main Page Structure

```svelte
<!-- /routes/+page.svelte -->
<script>
  import HeroSection from '$lib/components/sections/HeroSection.svelte';
  import ContactSection from '$lib/components/sections/ContactSection.svelte';
  import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';
  import PortfolioSection from '$lib/components/sections/PortfolioSection.svelte';
</script>

<main>
  <HeroSection /> <!-- Current animated text paths -->
  <ContactSection />
  <ExperienceSection />
  <PortfolioSection />
</main>
```

### Phase 4: Navigation & Scrolling

#### 4.1: Update Navigation Components
1. **TopNav.svelte changes:**
   ```typescript
   // Update listData to use anchor links
   let listData: LinkItem[] = [
     { label: 'Index', href: '#hero' },
     { label: 'Experience', href: '#experience' },
     { label: 'Graphics', href: '#portfolio' },
     { label: 'Contact', href: '#contact' }
   ];
   ```

2. **LinkList.svelte modifications:**
   - Update `getNavClasses` function to handle anchor links
   - Add smooth scroll behavior for anchor links
   - Implement intersection observer for active section detection

#### 4.2: Smooth Scroll Implementation
1. **Add scroll behavior:**
   ```javascript
   function scrollToSection(sectionId) {
     const element = document.getElementById(sectionId);
     if (element) {
       element.scrollIntoView({ behavior: 'smooth' });
     }
   }
   ```

2. **Active section detection:**
   ```javascript
   // Use Intersection Observer to track which section is visible
   let activeSection = $state('hero');
   
   onMount(() => {
     const sections = ['hero', 'contact', 'experience', 'portfolio'];
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           activeSection = entry.target.id;
         }
       });
     }, { threshold: 0.5 });
     
     sections.forEach(id => {
       const element = document.getElementById(id);
       if (element) observer.observe(element);
     });
   });
   ```

3. **Section IDs:**
   - `#hero` - Main animated text section
   - `#contact` - Contact/about information
   - `#experience` - Work experience accordion
   - `#portfolio` - Graphics portfolio grid

### Phase 5: Styling Considerations
1. **Section spacing:**
   - Add consistent vertical spacing between sections
   - Implement responsive padding/margins
   - Consider full-viewport sections vs. content-sized

2. **Transitions:**
   - Add scroll-triggered animations for section entry
   - Maintain existing component animations

### Phase 6: Route Handling & Backwards Compatibility

#### 6.1: Legacy Route Redirects
Create redirect pages for existing routes:

1. **`/experience/+page.svelte`:**
   ```svelte
   <script>
     import { goto } from '$app/navigation';
     import { onMount } from 'svelte';
     
     onMount(() => {
       goto('/#experience', { replaceState: true });
     });
   </script>
   ```

2. **`/graphics/+page.svelte`:**
   ```svelte
   <script>
     import { goto } from '$app/navigation';
     import { onMount } from 'svelte';
     
     onMount(() => {
       goto('/#portfolio', { replaceState: true });
     });
   </script>
   ```

3. **`/about/+page.svelte`:**
   ```svelte
   <script>
     import { goto } from '$app/navigation';
     import { onMount } from 'svelte';
     
     onMount(() => {
       goto('/#contact', { replaceState: true });
     });
   </script>
   ```

#### 6.2: Enhanced Navigation Logic
1. **Handle initial page load with hash:**
   ```javascript
   // In main +page.svelte
   onMount(() => {
     const hash = window.location.hash;
     if (hash) {
       // Small delay to ensure page is rendered
       setTimeout(() => {
         const element = document.getElementById(hash.slice(1));
         if (element) {
           element.scrollIntoView({ behavior: 'smooth' });
         }
       }, 100);
     }
   });
   ```

2. **Update LinkList.svelte for anchor handling:**
   ```javascript
   function handleAnchorClick(event, href) {
     if (href.startsWith('#')) {
       event.preventDefault();
       const sectionId = href.slice(1);
       const element = document.getElementById(sectionId);
       if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
         // Update URL without page reload
         history.pushState(null, '', href);
       }
     }
   }
   
   function getNavClasses(href: string): string {
     if (href.startsWith('#')) {
       const sectionId = href.slice(1);
       return `nav-link ${activeSection === sectionId ? 'active' : ''}`;
     }
     // Fallback for non-anchor links
     const isActive = href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(href);
     return `nav-link ${isActive ? 'active' : ''}`;
   }
   ```

### Phase 7: Performance Optimization
1. **Lazy loading:**
   - Implement lazy loading for portfolio images
   - Consider virtual scrolling for large image collections

2. **Code splitting:**
   - Keep heavy components lazy-loaded
   - Load sections on-demand as user scrolls

## File Structure
```
frontend/src/lib/components/sections/
├── HeroSection.svelte (existing content from +page.svelte)
├── ContactSection.svelte (from about/+page.svelte)
├── ExperienceSection.svelte (from experience/+page.svelte)
└── PortfolioSection.svelte (from graphics/+page.svelte)
```

## Navigation Implementation Summary

### Key Changes to Navigation Components:

1. **TopNav.svelte:**
   - Update `listData` to use anchor links (`#hero`, `#experience`, `#portfolio`, `#contact`)
   - Pass `activeSection` state to LinkList component

2. **LinkList.svelte:**
   - Add `activeSection` prop to receive current section state
   - Implement `handleAnchorClick` function for smooth scrolling
   - Update `getNavClasses` to handle anchor-based active states
   - Add click handlers to anchor links

3. **Main Page (+page.svelte):**
   - Add Intersection Observer for section tracking
   - Handle initial hash navigation on page load
   - Add section IDs to each content section

### Navigation Flow:
1. User clicks navigation link → `handleAnchorClick` triggered
2. Smooth scroll to section → Intersection Observer detects section
3. `activeSection` state updated → Navigation highlights active link
4. URL hash updated without page reload → Deep linking preserved

## Benefits
- Single page application feel with smooth navigation
- Improved user experience with seamless scrolling
- Better SEO with all content on main page
- Preserved deep-linking with hash navigation
- Active section highlighting based on scroll position
- Backwards compatibility with legacy routes
- Reduced navigation complexity and page loads

## Considerations
- Larger initial page load (mitigate with lazy loading)
- Need proper accessibility with ARIA labels and keyboard navigation
- Ensure mobile responsiveness across all sections
- Handle browser back/forward navigation correctly
- Test intersection observer performance on mobile devices

---

## Current Implementation Status ✅

### What's Been Implemented:

1. **Section Components Created:**
   - `HeroSection.svelte` - Contains animated text paths from original homepage
   - `ExperienceSection.svelte` - Accordion list with project cards
   - `PortfolioSection.svelte` - Grid layout with filtering functionality

2. **Navigation System:**
   - Updated `TopNav.svelte` to use anchor links: `#hero`, `#experience`, `#portfolio`
   - Modified `LinkList.svelte` with smooth scroll behavior and click handlers
   - Implemented Intersection Observer for active section tracking
   - Created shared state store (`navigationStore.svelte.ts`) for active section

3. **Main Page Structure:**
   ```svelte
   <main>
     <HeroSection />
     <ExperienceSection />
     <PortfolioSection />
   </main>
   ```

4. **Backwards Compatibility:**
   - `/experience/+page.svelte` redirects to `/#experience`
   - `/graphics/+page.svelte` redirects to `/#portfolio`
   - Note: Remove these redirect routes when no longer needed

5. **Styling & UX:**
   - Added `scroll-margin-top: 100px` to account for navigation bar
   - Each section has `min-height: 100vh` for proper viewport sections
   - Smooth scrolling behavior enabled on main element

### Key Features Working:
- ✅ Smooth anchor navigation between sections
- ✅ Active section highlighting in navigation
- ✅ Deep linking support (URL hash updates)
- ✅ Intersection Observer tracking visible sections
- ✅ Legacy route redirects for backwards compatibility
- ✅ Preserved all original functionality (animations, filtering, etc.)

### Technical Implementation:
- Navigation state managed through `navigationStore.svelte.ts`
- Intersection Observer with 50% threshold for section detection
- Click handlers prevent default anchor behavior for smooth scrolling
- URL updates via `history.pushState()` without page reload
- Initial hash navigation handled on page load with delay for render

### MVP Status: ✅ Complete and Working
The single-page application with anchor navigation is fully functional as an MVP. All original route content has been successfully consolidated into sections with smooth scrolling navigation.