import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Academia CHARME",
  description: "Formación profesional en belleza, colorimetría, barbería y maquillaje.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
