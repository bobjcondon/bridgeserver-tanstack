import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { createLocationFormSchema, type CreateLocationFormInput } from '@/models/schema'
import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { locations } from '@/models/schema'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

const getLocation = createServerFn({ method: 'GET' })
  .handler(async (ctx: { id: string }) => {
    const locationId = parseInt(ctx.id)
    return await db.query.locations.findFirst({
      where: eq(locations.id, locationId)
    })
  })

const updateLocationAction = createServerFn({ method: 'POST' })
  .validator((data: { id: number, values: CreateLocationFormInput }) => {
    return {
      id: data.id,
      values: v.parse(createLocationFormSchema, data.values)
    }
  })
  .handler(async ({ data }) => {
    try {
      const [updated] = await db.update(locations)
        .set(data.values)
        .where(eq(locations.id, data.id))
        .returning()
      return { success: true, location: updated }
    } catch (error) {
      return { success: false, error: 'Failed to update location' }
    }
  })

const deleteLocationAction = createServerFn({ method: 'POST' })
  .handler(async (ctx: { id: number }) => {
    try {
      await db.delete(locations).where(eq(locations.id, ctx.id))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete location' }
    }
  })

export const Route = createFileRoute('/locations/$id')({
  loader: async ({ params }) => {
    const location = await getLocation({ id: params.id })
    return { location }
  },
  component: EditLocation,
})

function EditLocation() {
  const { location } = Route.useLoaderData()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!location) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Location not found</h1>
          <Button className="mt-4" onClick={() => navigate({ to: '/locations' })}>
            Back to Locations
          </Button>
        </div>
      </Layout>
    )
  }

  const form = useForm({
    defaultValues: {
      name: location.name,
      address: location.address,
      city: location.city,
      state: location.state,
      zip: location.zip,
      description: location.description || '',
    },
    validatorAdapter: valibotValidator(),
    onSubmit: async ({ value }) => {
      const result = await updateLocationAction({
        data: { id: location.id, values: value }
      })

      if (result.success) {
        navigate({ to: '/locations' })
      }
    },
  })

  const handleDelete = async () => {
    if (form.state.isDirty && !showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    const result = await deleteLocationAction({ id: location.id })
    if (result.success) {
      navigate({ to: '/locations' })
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Location</h1>

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
            <Button
              type="submit"
              disabled={form.state.isSubmitting || !form.state.isDirty}
            >
              {form.state.isSubmitting ? 'Saving...' : 'Save'}
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/locations' })}
            >
              Cancel
            </Button>
          </div>

          {showDeleteConfirm && (
            <p className="text-sm text-red-600">
              You have unsaved changes. Click Delete again to confirm deletion.
            </p>
          )}
        </form>
      </div>
    </Layout>
  )
}
