"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button size="icon" variant="outline" aria-label="Toggle theme" />;
  }

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <Button
      aria-label="Toggle theme"
      size="icon"
      type="button"
      variant="outline"
      onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
    >
      {activeTheme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
    </Button>
  );
}
