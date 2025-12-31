---
trigger: model_decision
description: never
---

# Form Implementation Rules

## Stack

- **Form Library**: [Tanstack Form](https://tanstack.com/form/latest) with Next.js integration
- **UI Components**: [shadcn/ui form fields](https://ui.shadcn.com/docs/forms/tanstack-form)
- **Validation**: [Valibot](https://valibot.dev)
- **Server Integration**: Next.js Server Actions with `useActionState`

## Implementation Pattern

### Client Component Structure

```tsx
'use client'

import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import * as v from 'valibot'
import { useActionState } from 'react'

const formSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
})

export function MyForm() {
  const [state, formAction] = useActionState(myServerAction, null)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: valibotValidator(),
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      Object.entries(value).forEach(([key, val]) => {
        formData.append(key, val as string)
      })
      formAction(formData)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}>
      {/* Form fields */}
    </form>
  )
}
```

## Best Practices

1. **Always validate both client and server-side**
   - Client: Immediate feedback with Valibot validator
   - Server: Security validation in Server Actions

2. **Use shadcn/ui field components**
   - Import from `@/components/ui/form`
   - Consistent styling and error handling

3. **Handle loading states**
   - Use `form.state.isSubmitting` for button disabled state
   - Show loading spinners during submission

4. **Display server errors**
   - Check `state` from `useActionState` for server validation errors
   - Map errors to specific fields when possible

5. **Progressive enhancement**
   - Forms should work without JavaScript when possible
   - Use `action` attribute as fallback

## Common Patterns

### File Uploads

```tsx
const formSchema = v.object({
  avatar: v.pipe(
    v.file(),
    v.mimeType(['image/jpeg', 'image/png']),
    v.maxSize(1024 * 1024 * 2) // 2MB
  ),
})
```

### Nested Objects

```tsx
const formSchema = v.object({
  user: v.object({
    name: v.string(),
    email: v.pipe(v.string(), v.email()),
  }),
})
```

### Arrays

```tsx
const formSchema = v.object({
  tags: v.array(v.string()),
})
```

## References

- [Tanstack Form + shadcn/ui](https://ui.shadcn.com/docs/forms/tanstack-form)
- [Tanstack Form Next.js SSR](https://tanstack.com/form/v1/docs/framework/react/guides/ssr#using-tanstack-form-in-a-nextjs-app-router)
- [Valibot Validation](https://tanstack.com/form/v1/docs/framework/react/guides/validation#validation-through-schema-libraries)
