"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const Callback = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    // GSAP animation for login form
    gsap.fromTo(
      ".login-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!code) return;

    const authenticate = async () => {
      setLoading(true);
      const result = await login(code);

      if (!user) {
        setError("Authentication failed. Please try again.");
      }

      setLoading(false);
    };

    authenticate();
  }, [code]);

  const router = useRouter();

  if (user) {
    router.push("/");
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <Card className="login-card w-full max-w-md">
          <CardHeader className="text-center">
            <Image
              src="/assets/logo.svg"
              alt="Jetpack Snippets Logo"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Jetpack Compose Snippets
            </CardTitle>
            <CardDescription>Logging You In</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Callback;
