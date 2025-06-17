import React from "react";
import type { Metadata } from "next";
import "reset-css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Панель администратора",
  description: "Панель администратора оранжевого youtube",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
