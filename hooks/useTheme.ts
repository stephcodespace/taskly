"use client";

import { useSyncExternalStore, useCallback } from "react";

export type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  // Listen for cross-tab storage changes
  window.addEventListener("storage", callback);

  // Observe class mutations on document.documentElement
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme: Theme = isDark ? "light" : "dark";

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    try {
      localStorage.setItem("taskly-theme", nextTheme);
    } catch {
      // Ignore localStorage write failures
    }
  }, []);

  return { theme, toggleTheme };
}
