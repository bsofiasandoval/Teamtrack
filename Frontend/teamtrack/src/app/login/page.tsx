'use client';

import { LoginForm } from "@/components/login-form";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function LoginPage() {
  const { loginWithGoogle } = useGoogleAuth();

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="grid min-h-svh lg:grid-cols-2 bg-white">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm onGoogleLogin={loginWithGoogle} />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-muted lg:block">
          <img
            src="/Gradient.png"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover scale-120 dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </div>
  );
}
