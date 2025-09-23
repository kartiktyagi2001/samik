"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center rounded-full p-[2.5px]
                 bg-zinc-100 text-zinc-900 dark:bg-transparent hover:cursor-pointer"
    >
      {isDark ? <img src="/light.svg" alt="" className="w-5 h-5" /> : <img src="/dark.svg" alt="" className="w-5 h-5" />}
    </button>
  );
}
