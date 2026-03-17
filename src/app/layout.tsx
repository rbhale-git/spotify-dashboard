import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";

export const metadata: Metadata = {
  title: "Spotify Listening Analytics",
  description: "8 years of Spotify listening history, visualized",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <main className="md:ml-56 pt-16 md:pt-0 px-4 md:px-8 py-8 max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
