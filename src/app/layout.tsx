import type { Metadata } from "next";
import "reset-css";

export const metadata: Metadata = {
  title: "Панель администратора",
  description: "Панель администратора оранжевого youtube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}
