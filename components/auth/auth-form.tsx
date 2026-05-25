"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ar } from "@/lib/i18n/ar";
import { useAuthStore } from "@/lib/store/auth-store";
import { RecaptchaField } from "@/components/auth/recaptcha-field";
import {
  useSupabaseAuth,
  supabaseLogin,
  supabaseRegister,
} from "@/lib/auth/client-auth";

interface AuthFormProps {
  mode: "login" | "register";
}

function AuthFormInner({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const setSession = useAuthStore((s) => s.setSession);
  const useSupabase = useSupabaseAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaOk, setCaptchaOk] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!captchaOk) {
      setError("أكمل التحقق الأمني");
      return;
    }

    if (useSupabase) {
      if (isLogin) {
        const result = await supabaseLogin(email, password);
        if (result.ok && result.user) {
          setSession(result.user);
          router.push(searchParams.get("next") || "/dashboard");
        } else setError(result.error ?? "حدث خطأ");
      } else {
        const result = await supabaseRegister(name, email, password);
        if (result.ok) {
          setError(
            "تم إنشاء الحساب. افتح بريدك واضغط رابط التأكيد ثم سجّل الدخول."
          );
        } else setError(result.error ?? "حدث خطأ");
      }
      return;
    }

    const result = isLogin
      ? login(email, password)
      : register(name, email, password);
    if (result.ok) {
      router.push(searchParams.get("next") || "/dashboard");
    } else setError(result.error ?? "حدث خطأ");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? ar.auth.welcomeBack : ar.auth.createAccount}
          </CardTitle>
          <CardDescription>
            {useSupabase
              ? "تأكيد البريد مطلوب • كلمة مرور 6+ أحرف"
              : "admin@ / artist@ / verified@ للأدوار • كلمة مرور 6+ أحرف"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">{ar.auth.name}</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{ar.auth.email}</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{ar.auth.password}</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <RecaptchaField onVerify={setCaptchaOk} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              {isLogin ? ar.auth.loginBtn : ar.auth.registerBtn}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? ar.auth.noAccount : ar.auth.hasAccount}{" "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-medium text-primary hover:underline"
            >
              {isLogin ? ar.nav.register : ar.nav.login}
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AuthForm(props: AuthFormProps) {
  return (
    <Suspense>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
