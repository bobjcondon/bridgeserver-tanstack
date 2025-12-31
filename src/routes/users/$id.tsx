import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { insertUserSchema, type CreateUserFormInput } from '@/models/schema'
import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'
import * as v from 'valibot'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

const getUser = createServerFn({ method: 'GET' })
  .handler(async (ctx: { id: string }) => {
    const userId = parseInt(ctx.id)
    return await db.query.users.findFirst({
      where: eq(users.id, userId)
    })
  })

const updateUserAction = createServerFn({ method: 'POST' })
  .validator((data: { id: number, values: CreateUserFormInput }) => {
    return {
      id: data.id,
      values: v.parse(insertUserSchema, data.values)
    }
  })
  .handler(async ({ data }) => {
    try {
      const [updated] = await db.update(users)
        .set(data.values)
        .where(eq(users.id, data.id))
        .returning()
      return { success: true, user: updated }
    } catch (error) {
      return { success: false, error: 'Failed to update user' }
    }
  })

const deleteUserAction = createServerFn({ method: 'POST' })
  .handler(async (ctx: { id: number }) => {
    try {
      await db.delete(users).where(eq(users.id, ctx.id))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete user' }
    }
  })

export const Route = createFileRoute('/users/$id')({
  loader: async ({ params }) => {
    const user = await getUser({ id: params.id })
    return { user }
  },
  component: EditUser,
})

function EditUser() {
  const { user } = Route.useLoaderData()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          <Button className="mt-4" onClick={() => navigate({ to: '/users' })}>
            Back to Users
          </Button>
        </div>
      </Layout>
    )
  }

  const form = useForm({
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      address: user.address || '',
      isPublic: user.isPublic || false,
      role: user.role || 'user',
    },
    validatorAdapter: valibotValidator(),
    onSubmit: async ({ value }) => {
      const result = await updateUserAction({
        data: { id: user.id, values: value }
      })

      if (result.success) {
        navigate({ to: '/users' })
      }
    },
  })

  const handleDelete = async () => {
    if (form.state.isDirty && !showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    const result = await deleteUserAction({ id: user.id })
    if (result.success) {
      navigate({ to: '/users' })
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit User</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="firstName">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
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

          <form.Field name="lastName">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
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

          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
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

          <form.Field name="phone">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="555-555-5555"
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
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {field.state.meta.errors && field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-red-600">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="isPublic">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
                <Label htmlFor="isPublic">Make profile public</Label>
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
              onClick={() => navigate({ to: '/users' })}
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
