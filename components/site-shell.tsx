"use client";

import { ReactNode, useEffect, useState } from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MascotAssistant } from "@/components/mascot-assistant";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const nextTheme =
      document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(nextTheme);
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("onequicksolutions-theme", nextTheme);
  };

  return (
    <div className="App">
      <Header theme={theme} onToggleTheme={handleToggleTheme} />
      <main id="main-content">{children}</main>
      <Footer />
      <MascotAssistant theme={theme} onToggleTheme={handleToggleTheme} />
    </div>
  );
}
