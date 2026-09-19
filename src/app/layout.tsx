import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";
import { Header } from "@/components/Header";
import { TabBar } from "@/components/TabBar";
import { SwRegister } from "@/components/SwRegister";

export const metadata: Metadata = {
  title: { default: "Bila · Miskito", template: "%s · Bila" },
  description: "A small companion for learning Miskito, little by little.",
  applicationName: "Bila",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Bila" },
};

export const viewport: Viewport = {
  themeColor: "#fdf6e7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <SettingsProvider>
          <div
            className="mx-auto w-full max-w-[480px] px-5"
            style={{
              paddingTop: "calc(var(--safe-top) + 8px)",
              paddingBottom: "calc(var(--safe-bottom) + 128px)",
            }}
          >
            <Header />
            <main>{children}</main>
          </div>
          <TabBar />
          <SwRegister />
        </SettingsProvider>
      </body>
    </html>
  );
}
