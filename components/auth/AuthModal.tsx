
"use client";

import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
        onClose();
      } else {
        await signUp(email.trim(), password);
        setMessage(
          "Registration submitted. Check your email if confirmation is required.",
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md rounded-3xl border border-pink-200 bg-white p-6 shadow-2xl dark:border-[#4B3048] dark:bg-[#231B26] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close authentication dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-pink-50 hover:text-pink-600 disabled:opacity-50 dark:hover:bg-[#3D293F]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 dark:bg-[#4B3048] dark:text-pink-300">
            <Lock className="h-7 w-7" />
          </div>

          <h2
            id="auth-modal-title"
            className="text-2xl font-extrabold text-[#27212A] dark:text-[#FDF2F8]"
          >
            {mode === "login" ? "Welcome back!" : "Create your account"}
          </h2>

          <p className="mt-2 text-sm text-[#5C5262] dark:text-[#C4B5CD]">
            {mode === "login"
              ? "Sign in to create and manage your tasks."
              : "Create an account to save your tasks online."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl bg-pink-50 p-1 dark:bg-[#18111A]">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-white text-pink-600 shadow-sm dark:bg-[#3D293F] dark:text-pink-300"
                : "text-[#5C5262] dark:text-[#C4B5CD]"
            }`}
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-white text-pink-600 shadow-sm dark:bg-[#3D293F] dark:text-pink-300"
                : "text-[#5C5262] dark:text-[#C4B5CD]"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-email"
              className="mb-1.5 block text-sm font-semibold text-[#27212A] dark:text-[#FDF2F8]"
            >
              Email address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-pink-200 px-3.5 focus-within:border-pink-500 dark:border-[#4B3048]">
              <Mail className="h-5 w-5 shrink-0 text-pink-500" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 text-sm outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1.5 block text-sm font-semibold text-[#27212A] dark:text-[#FDF2F8]"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-pink-200 px-3.5 focus-within:border-pink-500 dark:border-[#4B3048]">
              <Lock className="h-5 w-5 shrink-0 text-pink-500" />
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent py-3 text-sm outline-none dark:text-white"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-gray-500 hover:text-pink-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-xl bg-pink-50 p-3 text-sm text-[#9D174D] dark:bg-[#3D293F] dark:text-pink-200"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-[#5C5262] dark:text-[#C4B5CD]">
          Your tasks are associated with your account when you sign in.
        </p>
      </section>
    </div>
  );
}
