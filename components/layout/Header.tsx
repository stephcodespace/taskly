
"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Plus,
  RotateCcw,
  Sun,
  Moon,
  UserRound,
  LogOut,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenCreateTask: () => void;
  onOpenResetConfirm: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenCreateTask,
  onOpenResetConfirm,
  onOpenAuth,
}) => {
  const { user, loading, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError("");

    try {
      await signOut();
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
      setSignOutError(
        error instanceof Error ? error.message : "Failed to sign out. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#FBCFE8]/70 bg-white/90 backdrop-blur-md transition-all dark:border-[#3D293F] dark:bg-[#231B26]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DB2777] text-white shadow-xs shadow-pink-300/40 dark:shadow-none">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#27212A] dark:text-[#FDF2F8]">
              Taskly
            </h1>
            <p className="hidden text-xs text-[#5C5262] dark:text-[#C4B5CD] sm:block">
              Productivity Task Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FBCFE8] bg-white text-[#5C5262] transition-all hover:bg-pink-50 hover:text-[#DB2777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] dark:border-[#3D293F] dark:bg-[#18111A] dark:text-[#C4B5CD] dark:hover:bg-[#2E2332] dark:hover:text-[#F472B6]"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {!loading && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                className="flex h-9 items-center gap-2 rounded-xl border border-[#FBCFE8] bg-white px-2 text-[#5C5262] transition-all hover:bg-pink-50 hover:text-[#DB2777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] dark:border-[#3D293F] dark:bg-[#18111A] dark:text-[#FDF2F8] dark:hover:bg-[#2E2332]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-[#DB2777] dark:bg-[#3D293F] dark:text-[#F472B6]">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="hidden max-w-36 truncate text-sm sm:inline">
                  {user.email}
                </span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {isProfileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-[#FBCFE8] bg-white p-2 shadow-xl dark:border-[#3D293F] dark:bg-[#231B26]">
                    <div className="border-b border-[#FCE7F3] px-3 py-3 dark:border-[#3D293F]">
                      <p className="text-xs text-[#8B7D8E] dark:text-[#C4B5CD]">
                        Signed in as
                      </p>
                      <p className="mt-1 break-all text-sm font-medium text-[#27212A] dark:text-[#FDF2F8]">
                        {user.email}
                      </p>
                    </div>

                    {signOutError && (
                      <p role="alert" className="px-3 py-2 text-xs text-red-600 dark:text-red-400">
                        {signOutError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {isSigningOut ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && !user && (
            <button
              type="button"
              onClick={onOpenAuth}
              title="Sign in or create an account"
              aria-label="Sign in or create an account"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#FBCFE8] bg-white text-[#DB2777] transition-all hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DB2777] dark:border-[#3D293F] dark:bg-[#18111A] dark:text-[#F472B6] dark:hover:bg-[#2E2332]"
            >
              <UserRound className="h-4 w-4" />
            </button>
          )}

          <div className="hidden sm:block">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenResetConfirm}
              title="Restore default sample tasks"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onOpenCreateTask}
            className="font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
