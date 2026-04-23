import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abanacars — Showroom Kiosk",
  description: "Explore Nigeria's finest automobiles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@200;300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: "#060606", color: "#F4EFE4", overflow: "hidden", width: "100vw", height: "100vh", margin: 0, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
