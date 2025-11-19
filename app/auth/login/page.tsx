import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Collexa</h1>
            <p className="text-slate-600">Ingresa a tu colección personal</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">¿No tienes cuenta? </span>
            <Link
              href="/auth/signup"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
