import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { LocationsSettings } from "@/components/settings/locations-settings";
import { TagsSettings } from "@/components/settings/tags-settings";
import { User, MapPin, Tag } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: locations }, { data: tags }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase
        .from("locations")
        .select("*")
        .eq("user_id", user!.id)
        .order("name"),
      supabase.from("tags").select("*").eq("user_id", user!.id).order("name"),
    ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600 mt-2">
          Gestiona tu perfil y catálogos personalizados
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Información Personal
            </h2>
          </div>
          <ProfileSettings profile={profile} user={user} />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Ubicaciones
              </h2>
            </div>
            <LocationsSettings locations={locations || []} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-slate-900">
                Etiquetas
              </h2>
            </div>
            <TagsSettings tags={tags || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
