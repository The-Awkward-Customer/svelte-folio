# Migration Guide: Indicator → Badge Component Rename
*Created: 2025-09-25 12:55:00 UTC*

## Overview

This guide provides comprehensive instructions for migrating from the deprecated `Indicator` component to the renamed `Badge` component. The functionality remains identical, but class names, imports, and references have been updated for better semantic clarity and consistency with industry standards.

## Migration Summary

| Aspect | Old (Indicator) | New (Badge) |
|--------|-----------------|-------------|
| Component Name | `Indicator` | `Badge` |
| Import Path | `import { Indicator }` | `import { Badge }` |
| Base CSS Class | `.indicator` | `.badge` |
| Pulse CSS Class | `.indicator--pulse` | `.badge--pulse` |
| File Location | Same - `/primitives/Badge.svelte` (was Indicator.svelte) |
| Props | No changes | Same props interface |
| Functionality | No changes | Identical behavior |

## Why the Rename?

### Semantic Clarity
- **Badge** is a more widely recognized term for status indicators in UI design
- Follows industry conventions used by major design systems (Material Design, Bootstrap, etc.)
- More descriptive of the component's visual appearance and purpose

### Consistency
- Aligns with common terminology used in documentation and tutorials
- Matches naming conventions in other UI frameworks
- Reduces cognitive load for developers familiar with standard UI patterns

## Step-by-Step Migration

### 1. Update Imports
Replace all imports across your codebase:

**Before:**
```svelte
<script>
  import { Indicator } from '$lib/components/primitives';
</script>
```

**After:**
```svelte
<script>
  import { Badge } from '$lib/components/primitives';
</script>
```

### 2. Update Component Usage
Replace all component instances:

**Before:**
```svelte
<Indicator />
<Indicator pulse={true} />
<Indicator class="custom-indicator" />
```

**After:**
```svelte
<Badge />
<Badge pulse={true} />
<Badge class="custom-badge" />
```

### 3. Update CSS Class References
Update any custom styles that reference the old class names:

**Before:**
```css
.custom-indicator {
  background-color: blue;
}

.notification-container .indicator {
  top: -5px;
  right: -5px;
}

.my-component .indicator--pulse {
  animation-duration: 1s;
}
```

**After:**
```css
.custom-badge {
  background-color: blue;
}

.notification-container .badge {
  top: -5px;
  right: -5px;
}

.my-component .badge--pulse {
  animation-duration: 1s;
}
```

### 4. Update Documentation and Comments
Replace references in comments and documentation:

**Before:**
```svelte
<!-- Show indicator for new messages -->
<Indicator pulse={hasNewMessages} />

/**
 * Displays a notification indicator
 * @param pulse - Whether the indicator should pulse
 */
```

**After:**
```svelte
<!-- Show badge for new messages -->
<Badge pulse={hasNewMessages} />

/**
 * Displays a notification badge
 * @param pulse - Whether the badge should pulse
 */
```

### 5. Update Test Files
If you have tests referencing the component:

**Before:**
```javascript
// Test file
import { Indicator } from '$lib/components/primitives';

test('Indicator renders correctly', () => {
  render(Indicator);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('Indicator pulse animation', () => {
  render(Indicator, { pulse: true });
  expect(document.querySelector('.indicator--pulse')).toBeInTheDocument();
});
```

**After:**
```javascript
// Test file
import { Badge } from '$lib/components/primitives';

test('Badge renders correctly', () => {
  render(Badge);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('Badge pulse animation', () => {
  render(Badge, { pulse: true });
  expect(document.querySelector('.badge--pulse')).toBeInTheDocument();
});
```

## Automated Migration Scripts

### Find and Replace Commands
For Unix-like systems (Linux/macOS), you can use these commands to automate the migration:

#### Update Imports
```bash
# Find all .svelte files and update imports
find . -name "*.svelte" -type f -exec sed -i 's/import.*{.*Indicator.*}/import { Badge }/g' {} \;

# More precise import replacement
find . -name "*.svelte" -type f -exec sed -i 's/import { Indicator }/import { Badge }/g' {} \;
find . -name "*.svelte" -type f -exec sed -i 's/import {Indicator}/import {Badge}/g' {} \;
```

#### Update Component Usage
```bash
# Replace opening tags
find . -name "*.svelte" -type f -exec sed -i 's/<Indicator/<Badge/g' {} \;

# Replace closing tags
find . -name "*.svelte" -type f -exec sed -i 's/<\/Indicator>/<\/Badge>/g' {} \;

# Replace self-closing tags
find . -name "*.svelte" -type f -exec sed -i 's/<Indicator\([^>]*\)\/?>/<Badge\1\/>/g' {} \;
```

#### Update CSS Classes
```bash
# Replace CSS class selectors in style blocks
find . -name "*.svelte" -type f -exec sed -i 's/\.indicator/\.badge/g' {} \;

# Replace CSS classes in separate CSS files
find . -name "*.css" -type f -exec sed -i 's/\.indicator/\.badge/g' {} \;
```

#### Update Comments and Documentation
```bash
# Update comments (case-insensitive)
find . -name "*.svelte" -type f -exec sed -i 's/indicator/badge/gi' {} \;
find . -name "*.md" -type f -exec sed -i 's/Indicator/Badge/g' {} \;
```

### Verification Script
After running the migration, verify the changes:

```bash
#!/bin/bash
# verify-migration.sh

echo "Checking for remaining 'Indicator' references..."

echo "=== Svelte files ==="
grep -r "Indicator" --include="*.svelte" . | grep -v "node_modules" || echo "No Indicator references found in .svelte files"

echo "=== CSS files ==="
grep -r "\.indicator" --include="*.css" . | grep -v "node_modules" || echo "No .indicator references found in .css files"

echo "=== JavaScript/TypeScript files ==="
grep -r "Indicator" --include="*.js" --include="*.ts" . | grep -v "node_modules" || echo "No Indicator references found in .js/.ts files"

echo "Migration verification complete!"
```

## Visual Studio Code Migration

### Using Find and Replace
1. Open Find and Replace (Ctrl/Cmd + Shift + H)
2. Enable regex mode (Alt/Opt + R)
3. Use these patterns:

| Find | Replace | Description |
|------|---------|-------------|
| `import \{.*Indicator.*\}` | `import { Badge }` | Update imports |
| `<Indicator` | `<Badge` | Update opening tags |
| `</Indicator>` | `</Badge>` | Update closing tags |
| `\.indicator` | `.badge` | Update CSS classes |

### Using Extensions
Consider using VS Code extensions like:
- **Find and Replace Rules** for complex patterns
- **Batch Replace** for multiple file operations
- **Regex Previewer** to test patterns before applying

## Common Migration Issues

### Issue 1: Mixed Imports
**Problem:** Some files import both old and new components
```svelte
import { Indicator, Badge } from '$lib/components/primitives';
```

**Solution:** Clean up to only use Badge:
```svelte
import { Badge } from '$lib/components/primitives';
```

### Issue 2: Inconsistent Class Names
**Problem:** Some CSS still uses old class names
```css
.my-component .indicator {
  /* styles */
}

.another-component .badge {
  /* styles */
}
```

**Solution:** Standardize all to use `.badge`:
```css
.my-component .badge {
  /* styles */
}

.another-component .badge {
  /* styles */
}
```

### Issue 3: Comment References
**Problem:** Comments still reference old name
```svelte
<!-- This indicator shows unread count -->
<Badge pulse={hasUnread} />
```

**Solution:** Update comments for consistency:
```svelte
<!-- This badge shows unread count -->
<Badge pulse={hasUnread} />
```

## Testing After Migration

### 1. Component Functionality
Ensure all badges still render and animate correctly:
```javascript
// Test basic rendering
test('Badge renders without errors', () => {
  render(Badge);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

// Test pulse animation
test('Badge pulse animation works', () => {
  render(Badge, { pulse: true });
  const badge = document.querySelector('.badge');
  expect(badge).toHaveClass('badge--pulse');
});
```

### 2. Visual Regression Testing
- Take screenshots before migration
- Compare after migration to ensure visual consistency
- Verify animations still work as expected

### 3. Integration Testing
Test components that use badges:
```svelte
<script>
  import { Badge, Image } from '$lib/components/primitives';
</script>

<div class="user-avatar">
  <Image src="/avatar.jpg" alt="User" borderRadius="pill" />
  <Badge pulse={isOnline} />
</div>
```

## Migration Checklist

Use this checklist to ensure complete migration:

- [ ] **Imports Updated**
  - [ ] All `import { Indicator }` changed to `import { Badge }`
  - [ ] No mixed imports remaining
  - [ ] Test files updated

- [ ] **Component Usage Updated**
  - [ ] All `<Indicator>` tags changed to `<Badge>`
  - [ ] All `</Indicator>` tags changed to `</Badge>`
  - [ ] Self-closing tags updated

- [ ] **CSS Classes Updated**
  - [ ] All `.indicator` selectors changed to `.badge`
  - [ ] All `.indicator--pulse` selectors changed to `.badge--pulse`
  - [ ] Custom CSS files updated

- [ ] **Documentation Updated**
  - [ ] Comments updated to reference "badge"
  - [ ] Documentation files updated
  - [ ] Variable names updated where appropriate

- [ ] **Testing Complete**
  - [ ] All badges render correctly
  - [ ] Animations work as expected
  - [ ] No console errors
  - [ ] Visual regression tests pass

- [ ] **Build Verification**
  - [ ] Project builds without errors
  - [ ] No TypeScript errors
  - [ ] All imports resolve correctly

## Rollback Plan

If issues arise during migration, you can rollback:

### 1. Quick Rollback (Reverse the Find/Replace)
```bash
# Reverse the component changes
find . -name "*.svelte" -type f -exec sed -i 's/import { Badge }/import { Indicator }/g' {} \;
find . -name "*.svelte" -type f -exec sed -i 's/<Badge/<Indicator/g' {} \;
find . -name "*.svelte" -type f -exec sed -i 's/<\/Badge>/<\/Indicator>/g' {} \;
find . -name "*.css" -type f -exec sed -i 's/\.badge/\.indicator/g' {} \;
```

### 2. Git Rollback (If using version control)
```bash
# Rollback to previous commit
git checkout -- .
# or revert specific files
git checkout HEAD~1 -- path/to/modified/files
```

## Post-Migration Best Practices

### 1. Code Review
Have team members review migration changes to catch any missed references.

### 2. Documentation Update
Update any project documentation, style guides, or component libraries that reference the old name.

### 3. Team Communication
Inform your team about the change to prevent future use of the deprecated name.

### 4. Linting Rules
Consider adding ESLint or other linting rules to prevent use of the old component name:

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/Indicator'],
            message: 'Use Badge instead of Indicator component'
          }
        ]
      }
    ]
  }
};
```

## Related Documentation

- [Badge Component Documentation](./Badge.md) - Complete Badge component API
- [Primitives Overview](./README.md) - All primitive components
- [Component Migration Best Practices](../../architecture/MIGRATION_BEST_PRACTICES.md) - General migration guidelines

## Support

If you encounter issues during migration:
1. Check the [Badge component documentation](./Badge.md) for API details
2. Verify your migration script syntax
3. Test in a development environment before production deployment
4. Consult the team for complex edge cases

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-25 12:55:00 UTC | v1.0 | Initial comprehensive migration guide for Indicator to Badge rename |

---

*This migration guide covers the complete process of updating from Indicator to Badge components. For the latest Badge implementation details, refer to `/frontend/src/lib/components/primitives/Badge.svelte`.*