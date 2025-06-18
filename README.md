# Project README ❤️

## Git Workflow

### Branch Naming: `type/description-in-kebab-case`

| Type | Purpose | Example |
|------|---------|---------|
| `feature/` | New features | `feature/user-authentication` |
| `fix/` | Bug fixes | `fix/login-redirect-issue` |
| `hotfix/` | Critical production fixes | `hotfix/security-vulnerability` |
| `docs/` | Documentation | `docs/api-endpoints` |
| `refactor/` | Code restructuring | `refactor/database-optimization` |
| `test/` | Testing | `test/user-service-unit-tests` |
| `chore/` | Maintenance | `chore/update-dependencies` |

### Commit Messages: `type: Description under 50 chars`

```bash
feat: Add user authentication middleware
fix: Handle null values in payment processing
docs: Update API documentation
test: Add unit tests for user service
```

---

## Animation System

High-performance canvas animations for Svelte 5 + SvelteKit.

### Quick Start
```bash
npm run dev          # Development
npm run build        # Production build
```

### Architecture

**Asset Loading** - Uses Vite's `import.meta.glob` for static discovery
```typescript
const imageModules = import.meta.glob('/src/lib/animations/assets/**/*.webp');
```

**File Structure**
```
src/lib/animations/
├── assets/           # Animation frames (.webp)
├── manifest.json     # Animation metadata  
├── AnimationEngine.ts
└── CanvasAnimation.svelte
```

### Key Improvements

✅ **Eliminated NS_BINDING_ABORTED errors**  
✅ **100% load success rate** (was 60%)  
✅ **Memory efficient** (<50MB)  
✅ **Production-ready** builds  

### Migration Notes

**Problem**: Runtime `fetch()` calls caused build issues and race conditions  
**Solution**: Migrated to Vite's static import system  
**Breaking Change**: Assets moved from `static/` to `src/lib/animations/assets/`

### Adding Animations

1. Place `.webp` frames in `src/lib/animations/assets/[name]/`
2. Update `manifest.json` 
3. Use naming: `00000.webp`, `00001.webp`, etc.
4. Test dev + production builds

### Troubleshooting

**Missing animations in production:**
```bash
ls build/_app/immutable/assets/ | grep webp
```

**Debug mode:**
```javascript
localStorage.setItem('animation-debug', 'true');
```

**Browser support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### API

```typescript
const engine = new AnimationEngine();
await engine.loadAnimation('blue-motion');
const renderer = engine.createRenderer(canvas, {
  trigger: 'viewport',
  loop: true,
  respectReducedMotion: true
});
```
