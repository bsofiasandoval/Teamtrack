"use client"

import { useUser } from "@/context/UserContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function AuthCallbackPage() {
  const { setUserRole, setFirstName } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { handleAuthCallback } = useGoogleAuth();

  useEffect(() => {
    const completeAuth = async (): Promise<void> => {
      try {
        const result = await handleAuthCallback();

        if (result.error) {
          setError(result.error);
          setTimeout(() => router.push("/login"), 3000);
          return;
        }

        if (result.success) {
          const role = result.userRole;
          const firstName = result.firstName;

          // Update global state
          setUserRole(role);
          setFirstName(firstName);

          // Update cookies
          Cookies.set("userRole", role);
          Cookies.set("firstName", firstName);

          // Redirect based on role
          router.push(role === "admin" ? "/admin" : "/user");
        }
      } catch (err) {
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    completeAuth();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
        <p>Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-lg">Completando inicio de sesión...</p>
    </div>
  );
}

