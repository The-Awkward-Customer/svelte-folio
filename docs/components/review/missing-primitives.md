# Missing Primitives

Filling these gaps will improve consistency, a11y, and velocity when building features.

## Forms

- Inputs: `TextField`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch/Toggle`, `Slider`, `Range`, `FileInput`.
- Scaffolding: `Field`, `Fieldset`, `Label`, `HelperText`, `ErrorText`, `Form` wrapper with validation slots.

## Overlays and Menus

- `Tooltip`, `Popover`, `DropdownMenu`, `ContextMenu`, `Drawer/Sheet`.

## Navigation

- `Breadcrumbs`, `Pagination`, `Tabs`.

## Data Display

- `Badge` (distinct from `Tag`), `Table` (basic sortable table), `Stat/Metric`, `EmptyState`.

## Feedback

- `Spinner` (if separate from `Progress`), `Skeleton`, `Alert` (info/success/warn/error variants).

## Layout

- `Container` (width constraints), `Stack`/`Inline` (spacing layouts), `Divider/Separator`, `Spacer`.

## Utilities

- `VisuallyHidden` (a11y), `ScreenReaderOnly`, `FocusTrap` (if not via action), `Portal` wrapper (if not using built-in portals).

## Conventions & API

- Standard props: `variant`, `size`, `tone`, `disabled`, `as` (polymorphic) where applicable.
- A11y: ensure labels, roles, and keyboard behavior; manage focus in overlays.
- Theming: expose CSS variables and `data-*` state attributes; align with design tokens.
- Exports: re-export public components via `src/lib/components/index.ts` and relevant barrels.

