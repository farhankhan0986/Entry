"use client";
import { SessionProvider } from "next-auth/react";
import { BookmarksProvider } from "./BookmarksProvider";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <BookmarksProvider>{children}</BookmarksProvider>
    </SessionProvider>
  );
}
