import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academia CHARME",
  description:
    "Formación profesional en belleza, colorimetría, barbería y maquillaje.",

  icons: {
    icon: "/images/favicon.ico",
    shortcut: "/images/favicon.ico",
    apple: "/images/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
