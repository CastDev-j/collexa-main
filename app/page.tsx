import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, Film, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-slate-900 text-balance">
              Collexa
            </h1>
            <p className="text-xl text-slate-600 text-balance max-w-2xl mx-auto">
              Gestiona tus libros, videojuegos, películas y más en un solo
              lugar. Lleva el control de préstamos y crea tu lista de deseos.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="px-8">
                Crear Cuenta
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-sm">
              <BookOpen className="h-10 w-10 text-primary" />
              <span className="font-medium text-slate-900">Libros</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-sm">
              <Gamepad2 className="h-10 w-10 text-primary" />
              <span className="font-medium text-slate-900">Videojuegos</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-sm">
              <Film className="h-10 w-10 text-primary" />
              <span className="font-medium text-slate-900">Películas</span>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-sm">
              <Heart className="h-10 w-10 text-primary" />
              <span className="font-medium text-slate-900">Y más...</span>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">Creado por:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              <span>Andrés Castillo Jiménez</span>
              <span>•</span>
              <span>Sugey Gutiérrez Calero</span>
              <span>•</span>
              <span>Angel González Mejia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
