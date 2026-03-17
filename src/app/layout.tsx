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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {/* Ambient background glows — multiple small, diffuse spots for organic feel */}
        <div aria-hidden="true" style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-8%", right: "10%", width: "35%", height: "35%",
            background: "radial-gradient(ellipse at center, rgba(30, 215, 96, 0.025) 0%, transparent 65%)",
            filter: "blur(40px)",
          }} />
          <div style={{
            position: "absolute", bottom: "5%", left: "15%", width: "25%", height: "25%",
            background: "radial-gradient(ellipse at center, rgba(78, 205, 196, 0.015) 0%, transparent 60%)",
            filter: "blur(50px)",
          }} />
        </div>
        <Sidebar />
        <main className="relative z-10 md:ml-60 pt-16 md:pt-0 px-5 md:px-10 py-10 max-w-[1200px]">
          {children}
        </main>
      </body>
    </html>
  );
}
