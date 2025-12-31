---
trigger: model_decision
description: Use this rule for writing fullstack applications in Next.js
---

# Next.js Rules

- Use the App Router structure with `page.tsx` files in route directories.
- Client components must be explicitly marked with `'use client'` at the top of the file.
- Use kebab-case for directory names (e.g., `components/auth-form`) and PascalCase for component files.
- Prefer named exports over default exports, i.e. `export function Button() { /* ... */ }` instead of `export default function Button() { /* ... */ }`.
  - Only use client components when you need interactivity and wrap in `Suspense` with fallback UI
  - Create small client component wrappers around interactive elements
- Avoid unnecessary `useState` and `useEffect` when possible:
  - Use server components for data fetching
  - See @client-component.md for form handling.
  - See @CRUD-components.dm to create routes for every DB table.
  - Use URL search params for shareable state.
- Use `nuqs` for URL search param state management.
  