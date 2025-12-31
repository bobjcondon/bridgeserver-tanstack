import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { createLocationFormSchema, type CreateLocationFormInput } from '@/models/schema'
import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { locations } from '@/models/schema'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const createLocationAction = createServerFn({ method: 'POST' })
  .validator((data: CreateLocationFormInput) => {
    return v.parse(createLocationFormSchema, data)
  })
  .handler(async ({ data }) => {
    try {
      const [newLocation] = await db.insert(locations).values(data).returning()
      return { success: true, location: newLocation }
    } catch (error) {
      return { success: false, error: 'Failed to create location' }
    }
  })

export const Route = createFileRoute('/locations/create')({
  component: CreateLocation,
})

function CreateLocation() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      description: '',
    },
    validatorAdapter: valibotValidator(),
    onSubmit: async ({ value }) => {
      const result = await createLocationAction({ data: value })

      if (result.success) {
        navigate({ to: '/locations' })
      }
    },
  })

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Location</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="address">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="city">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="state">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value.toUpperCase())}
                    onBlur={field.handleBlur}
                    maxLength={2}
                    placeholder="CA"
                  />
                  {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="zip">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  id="zip"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="12345 or 12345-6789"
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={3}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={form.state.isSubmitting}>
              {form.state.isSubmitting ? 'Adding...' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/locations' })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
