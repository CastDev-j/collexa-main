'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { updateProfile } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'
import { Loader2, User } from 'lucide-react'

export function ProfileSettings({ profile, user }: { profile: any; user: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      await updateProfile(formData)
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-200">
        <div className="h-16 w-16 rounded-sm bg-orange-100 flex items-center justify-center flex-shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url || "/placeholder.svg"}
              alt="Avatar"
              className="h-16 w-16 rounded-sm object-cover"
            />
          ) : (
            <User className="h-8 w-8 text-orange-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {profile?.full_name || profile?.username || 'Usuario'}
          </h3>
          <p className="text-sm text-slate-600 truncate" title={user?.email}>
            {user?.email ? `${user.email.substring(0, 8)}...` : 'Sin correo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 text-green-900 border-green-200">
            <AlertDescription>Perfil actualizado correctamente</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile?.username || ''}
            disabled={loading}
            placeholder="tu_usuario"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Nombre completo</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name || ''}
            disabled={loading}
            placeholder="Juan Pérez"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Biografía</Label>
          <Textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile?.bio || ''}
            disabled={loading}
            placeholder="Cuéntanos sobre ti..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Sitio web</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={profile?.website || ''}
            disabled={loading}
            placeholder="https://tusitio.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">URL del avatar</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            type="url"
            defaultValue={profile?.avatar_url || ''}
            disabled={loading}
            placeholder="https://ejemplo.com/avatar.jpg"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </Card>
  )
}
