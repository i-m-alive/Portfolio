import "./globals.css";
import type { Metadata } from "next";
// import PageTransition from "@/components/PageTransition";
import CrosshairOverlay from "@/app/components/CrosshairOverlay";
import PageReadySignal from "@/app/components/PageReadySignal";
import ClientOverlays from "./components/ClientOverlays";
export const metadata: Metadata = {
  title: "Kumar Shivraj Bhakat | AI/ML Engineer",
  description: "Portfolio of Kumar Shivraj Bhakat — AI/ML Engineer, Artist, Rapper, Sports Enthusiast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-white bg-black">
        {/* <PageTransition /> */}
        <PageReadySignal />

        <ClientOverlays />
        {children}
      </body>
    </html>
  );
}
