import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import { portfolio } from "@/content/portfolio";
import "./globals.css";

const title = portfolio.identity.name
  ? `${portfolio.identity.name} · Engineering Portfolio`
  : "Engineering Portfolio · Software Engineer";

export const metadata: Metadata = {
  title,
  description: portfolio.hero.description,
  openGraph: { title, description: portfolio.hero.description, type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
