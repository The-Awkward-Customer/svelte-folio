# Svelte 5 Component Best Practices: Snippets & Modern Design Systems

### Last Updated: 28/07/2025

## Table of Contents

1. [Introduction](#introduction)
2. [Snippets: The New Slots](#snippets-the-new-slots)
3. [Component Architecture](#component-architecture)
4. [Type Safety with TypeScript](#type-safety-with-typescript)
5. [Composable Design Patterns](#composable-design-patterns)
6. [Design Tokens & Theming](#design-tokens--theming)
7. [Component API Design](#component-api-design)
8. [Performance Considerations](#performance-considerations)
9. [Testing Strategies](#testing-strategies)
10. [Real-World Examples](#real-world-examples)

## Introduction

Svelte 5 introduces significant improvements to component composition with the new Snippets API, replacing the traditional slot system. This guide covers best practices for building scalable, type-safe component libraries using modern design system principles.

### Key Principles

- **Type Safety First**: Leverage TypeScript for compile-time guarantees
- **Composability**: Build flexible, reusable components
- **Performance**: Utilize Svelte 5's fine-grained reactivity
- **Developer Experience**: Clear APIs and excellent documentation

## Snippets: The New Slots

Snippets are Svelte 5's replacement for slots, offering better type safety and more flexibility.

### Basic Snippet Usage

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: Snippet;
    startIcon?: Snippet;
    endIcon?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    children,
    startIcon,
    endIcon,
    ...restProps
  }: ButtonProps = $props();
</script>

<button class="btn btn--{variant} btn--{size}" {...restProps}>
  {#if startIcon}
    <span class="btn__icon btn__icon--start">
      {@render startIcon()}
    </span>
  {/if}

  {@render children()}

  {#if endIcon}
    <span class="btn__icon btn__icon--end">
      {@render endIcon()}
    </span>
  {/if}
</button>
```

### Snippets with Parameters

```svelte
<!-- List.svelte -->
<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';

  interface ListProps<T> {
    items: T[];
    renderItem: Snippet<[T, number]>;
    emptyState?: Snippet;
  }

  let { items, renderItem, emptyState }: ListProps<T> = $props();
</script>

{#if items.length > 0}
  <ul class="list">
    {#each items as item, index}
      <li class="list__item">
        {@render renderItem(item, index)}
      </li>
    {/each}
  </ul>
{:else if emptyState}
  {@render emptyState()}
{:else}
  <p>No items to display</p>
{/if}
```

### Advanced Snippet Patterns

```svelte
<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface CardProps {
    children: Snippet;
    header?: Snippet<[{ isExpanded: boolean }]>;
    footer?: Snippet;
    expandable?: boolean;
  }

  let { children, header, footer, expandable = false }: CardProps = $props();

  let isExpanded = $state(false);
</script>

<article class="card" class:card--expandable={expandable}>
  {#if header}
    <header class="card__header">
      {@render header({ isExpanded })}
      {#if expandable}
        <button onclick={() => (isExpanded = !isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      {/if}
    </header>
  {/if}

  <div
    class="card__content"
    class:card__content--collapsed={expandable && !isExpanded}
  >
    {@render children()}
  </div>

  {#if footer}
    <footer class="card__footer">
      {@render footer()}
    </footer>
  {/if}
</article>
```

## Component Architecture

### File Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── primitives/
│   │   │   ├── Button/
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Button.types.ts
│   │   │   │   ├── Button.test.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── compounds/
│   │   │   ├── Form/
│   │   │   │   ├── Form.svelte
│   │   │   │   ├── FormField.svelte
│   │   │   │   ├── FormLabel.svelte
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── patterns/
│   │       └── DataTable/
│   ├── tokens/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   └── utils/
│       ├── cn.ts
│       └── props.ts
```

### Component Categories

1. **Primitives**: Basic building blocks (Button, Input, Text)
2. **Compounds**: Complex components composed of primitives
3. **Patterns**: Complete UI patterns (DataTable, Forms)

## Type Safety with TypeScript

### Props Interface Pattern

```typescript
// Button.types.ts
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

export interface ButtonProps extends HTMLButtonAttributes {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: Snippet;
  startIcon?: Snippet;
  endIcon?: Snippet;
}
```

### Generic Components

```svelte
<!-- Select.svelte -->
<script lang="ts" generics="T extends { id: string; label: string }">
  import type { Snippet } from 'svelte';

  interface SelectProps<T> {
    options: T[];
    value?: T;
    onchange?: (value: T) => void;
    placeholder?: string;
    renderOption?: Snippet<[T]>;
    renderValue?: Snippet<[T]>;
  }

  let {
    options,
    value = $bindable(),
    onchange,
    placeholder = 'Select an option',
    renderOption,
    renderValue,
  }: SelectProps<T> = $props();

  let isOpen = $state(false);
</script>

<!-- Implementation -->
```

### Utility Types

```typescript
// utils/props.ts
export type VariantProps<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never;
};

export type ComponentProps<T> = T & {
  class?: string;
  style?: string;
};

export type WithChildren<T> = T & {
  children: Snippet;
};
```

## Composable Design Patterns

### Compound Components

```svelte
<!-- Form/Form.svelte -->
<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';

  interface FormProps {
    onsubmit?: (data: FormData) => void;
    children: Snippet;
  }

  let { onsubmit, children }: FormProps = $props();

  const form = {
    errors: $state({}),
    touched: $state({}),
    setError: (field: string, error: string) => {
      form.errors[field] = error;
    },
  };

  setContext('form', form);
</script>

<form
  on:submit|preventDefault={(e) => {
    const formData = new FormData(e.currentTarget);
    onsubmit?.(formData);
  }}
>
  {@render children()}
</form>
```

```svelte
<!-- Form/FormField.svelte -->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Snippet } from 'svelte';

  interface FormFieldProps {
    name: string;
    label: string;
    children: Snippet;
    error?: string;
  }

  let { name, label, children, error }: FormFieldProps = $props();

  const form = getContext('form');
  const fieldError = $derived(error || form?.errors[name]);
</script>

<div class="form-field">
  <label for={name}>{label}</label>
  {@render children()}
  {#if fieldError}
    <span class="form-field__error">{fieldError}</span>
  {/if}
</div>
```

### Polymorphic Components

```svelte
<!-- Text.svelte -->
<script lang="ts" generics="T extends keyof HTMLElementTagNameMap = 'span'">
  import type { Snippet } from 'svelte';

  interface TextProps<T> {
    as?: T;
    variant?: 'body' | 'heading' | 'caption';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    children: Snippet;
  }

  let {
    as = 'span' as T,
    variant = 'body',
    size = 'md',
    children,
    ...restProps
  }: TextProps<T> = $props();
</script>

<svelte:element
  this={as}
  class="text text--{variant} text--{size}"
  {...restProps}
>
  {@render children()}
</svelte:element>
```

### Provider Pattern

```svelte
<!-- ThemeProvider.svelte -->
<script lang="ts">
  import { setContext } from 'svelte';
  import type { Snippet } from 'svelte';

  interface Theme {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    // ... other tokens
  }

  interface ThemeProviderProps {
    theme: Theme;
    children: Snippet;
  }

  let { theme, children }: ThemeProviderProps = $props();

  setContext('theme', theme);

  $effect(() => {
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
  });
</script>

<div class="theme-provider">
  {@render children()}
</div>
```

## Design Tokens & Theming

### Token Structure

```typescript
// tokens/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    900: '#111827',
  },
  // Semantic tokens
  text: {
    primary: 'var(--color-gray-900)',
    secondary: 'var(--color-gray-600)',
    disabled: 'var(--color-gray-400)',
  },
  background: {
    primary: 'var(--color-white)',
    secondary: 'var(--color-gray-50)',
  },
} as const;
```

### CSS Custom Properties Integration

```css
/* global.css */
:root {
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## Component API Design

### Consistent Prop Naming

```typescript
// Naming conventions
interface ComponentProps {
  // Boolean props - use "is" or "has" prefix
  isDisabled?: boolean;
  isLoading?: boolean;
  hasError?: boolean;

  // Event handlers - use "on" prefix
  onclick?: (event: MouseEvent) => void;
  onchange?: (value: string) => void;

  // Render props - use "render" prefix
  renderHeader?: Snippet;
  renderItem?: Snippet<[Item]>;

  // Variants - use descriptive names
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}
```

### Prop Spreading Pattern

```svelte
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface ButtonProps extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary';
  }

  let {
    variant = 'primary',
    class: className,
    ...restProps
  }: ButtonProps = $props();

  // Merge classes safely
  const classes = cn('btn', `btn--${variant}`, className);
</script>

<button class={classes} {...restProps}>
  <!-- content -->
</button>
```

## Performance Considerations

### Lazy Loading

```svelte
<!-- LazyComponent.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';

  let Component: any;

  onMount(async () => {
    const module = await import('./HeavyComponent.svelte');
    Component = module.default;
  });
</script>

{#if Component}
  <Component />
{:else}
  <div>Loading...</div>
{/if}
```

### Memoization with $derived

```svelte
<script lang="ts">
  interface DataTableProps<T> {
    data: T[];
    filter?: string;
  }

  let { data, filter = '' }: DataTableProps<T> = $props();

  // Memoized filtered data
  const filteredData = $derived(
    filter
      ? data.filter((item) =>
          JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
        )
      : data
  );

  // Memoized calculations
  const stats = $derived.by(() => {
    return {
      total: filteredData.length,
      // ... other expensive calculations
    };
  });
</script>
```

### Virtual Scrolling

```svelte
<!-- VirtualList.svelte -->
<script lang="ts" generics="T">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';

  interface VirtualListProps<T> {
    items: T[];
    itemHeight: number;
    renderItem: Snippet<[T, number]>;
  }

  let { items, itemHeight, renderItem }: VirtualListProps<T> = $props();

  let container: HTMLElement;
  let scrollTop = $state(0);
  let containerHeight = $state(0);

  const visibleItems = $derived.by(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.ceil((scrollTop + containerHeight) / itemHeight);

    return items.slice(start, end).map((item, i) => ({
      item,
      index: start + i,
      top: (start + i) * itemHeight,
    }));
  });
</script>

<div
  bind:this={container}
  bind:scrollTop
  bind:clientHeight={containerHeight}
  class="virtual-list"
  style="height: {items.length * itemHeight}px"
>
  {#each visibleItems as { item, index, top }}
    <div
      class="virtual-list__item"
      style="top: {top}px; height: {itemHeight}px"
    >
      {@render renderItem(item, index)}
    </div>
  {/each}
</div>
```

## Testing Strategies

### Component Testing

```typescript
// Button.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { expect, test, vi } from 'vitest';
import Button from './Button.svelte';

test('renders with correct variant class', () => {
  const { container } = render(Button, {
    props: {
      variant: 'secondary',
      children: (text) => text('Click me'),
    },
  });

  const button = container.querySelector('button');
  expect(button).toHaveClass('btn--secondary');
});

test('calls onclick handler', async () => {
  const handleClick = vi.fn();
  const { getByRole } = render(Button, {
    props: {
      onclick: handleClick,
      children: (text) => text('Click me'),
    },
  });

  await fireEvent.click(getByRole('button'));
  expect(handleClick).toHaveBeenCalledOnce();
});
```

### Testing Snippets

```typescript
// Card.test.ts
import { render } from '@testing-library/svelte';
import Card from './Card.svelte';

test('renders header snippet with context', () => {
  const { getByText } = render(Card, {
    props: {
      expandable: true,
      header: ({ isExpanded }) => {
        return isExpanded ? 'Expanded' : 'Collapsed';
      },
      children: () => 'Card content',
    },
  });

  expect(getByText('Collapsed')).toBeInTheDocument();
});
```

## Real-World Examples

### Complete Button Component

```svelte
<!-- Button.svelte -->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn';

  interface ButtonProps extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    loading?: boolean;
    children: Snippet;
    startIcon?: Snippet;
    endIcon?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    class: className,
    children,
    startIcon,
    endIcon,
    ...restProps
  }: ButtonProps = $props();

  const classes = cn(
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    {
      'btn--full-width': fullWidth,
      'btn--loading': loading,
    },
    className
  );
</script>

<button class={classes} disabled={disabled || loading} {...restProps}>
  {#if loading}
    <span class="btn__spinner" aria-hidden="true">
      <svg><!-- spinner svg --></svg>
    </span>
  {/if}

  {#if startIcon && !loading}
    <span class="btn__icon btn__icon--start">
      {@render startIcon()}
    </span>
  {/if}

  <span class="btn__content">
    {@render children()}
  </span>

  {#if endIcon}
    <span class="btn__icon btn__icon--end">
      {@render endIcon()}
    </span>
  {/if}
</button>

<style>
  .btn {
    /* Base styles */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-weight: 500;
    transition: all 150ms ease;

    /* Size variants */
    &--xs {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
    }
    &--sm {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
    }
    &--md {
      padding: var(--spacing-sm) var(--spacing-lg);
      font-size: var(--font-size-md);
    }

    /* Variant styles */
    &--primary {
      background: var(--color-primary-500);
      color: white;

      &:hover:not(:disabled) {
        background: var(--color-primary-600);
      }
    }

    &--full-width {
      width: 100%;
    }

    &--loading {
      position: relative;
      color: transparent;
    }
  }

  .btn__spinner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
```

### Form System

```svelte
<!-- FormExample.svelte -->
<script lang="ts">
  import { Form, FormField, Input, Select, Button } from '$lib/components';

  let formData = $state({
    name: '',
    email: '',
    role: '',
  });

  const roles = [
    { id: 'admin', label: 'Administrator' },
    { id: 'user', label: 'User' },
    { id: 'guest', label: 'Guest' },
  ];

  function handleSubmit(data: FormData) {
    console.log('Form submitted:', Object.fromEntries(data));
  }
</script>

<Form onsubmit={handleSubmit}>
  <FormField name="name" label="Name">
    <Input bind:value={formData.name} placeholder="Enter your name" required />
  </FormField>

  <FormField name="email" label="Email">
    <Input
      type="email"
      bind:value={formData.email}
      placeholder="Enter your email"
      required
    />
  </FormField>

  <FormField name="role" label="Role">
    <Select
      options={roles}
      bind:value={formData.role}
      placeholder="Select a role"
    />
  </FormField>

  <Button type="submit" variant="primary">
    {#snippet children()}
      Submit Form
    {/snippet}
  </Button>
</Form>
```

## Conclusion

Building component libraries in Svelte 5 with Snippets opens up new possibilities for creating type-safe, performant, and composable UI systems. By following these patterns and best practices, you can create maintainable design systems that scale with your application's needs.

### Key Takeaways

1. **Use Snippets** for flexible content composition
2. **Leverage TypeScript** for type safety across your component library
3. **Design composable APIs** that are intuitive and consistent
4. **Implement design tokens** for maintainable theming
5. **Consider performance** from the start with lazy loading and memoization
6. **Test thoroughly** with proper testing strategies

### Resources

- [Svelte 5 Documentation](https://svelte.dev/docs)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/v5-migration-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Design Systems Handbook](https://www.designsystems.com/)
