"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="red" 
      enableSystem={false}
      themes={["light", "dark", "red", "blue", "green", "purple"]}
    >
      {children}
    </NextThemesProvider>
  );
}