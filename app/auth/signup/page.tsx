import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Collexa</h1>
            <p className="text-slate-600">Comienza a organizar tu colección</p>
          </div>

          <SignupForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">¿Ya tienes cuenta? </span>
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
