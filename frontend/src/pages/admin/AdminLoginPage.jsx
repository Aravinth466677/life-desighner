import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Logo from "@/components/brand/Logo";
import { api } from "@/services/api";
import { getAdminToken, setAdminToken } from "@/services/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password is too short"),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/admin/projects";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const token = getAdminToken();
  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, from, navigate]);

  if (token) return null;

  const onSubmit = async (values) => {
    try {
      const res = await api.post("/auth/login", values);
      setAdminToken(res.data.token);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-dvh bg-surface text-ink">
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6 shadow-soft md:p-8">
          <p className="text-xs tracking-[0.24em] text-muted uppercase text-center">
            Admin Access
          </p>
          <h1 className="mt-2 text-center font-serif text-3xl">
            Sign in
          </h1>

          <form className="mt-7 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email"
              placeholder="admin@studio.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              error={errors.password?.message}
            />
            <Button type="submit" variant="gold" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
