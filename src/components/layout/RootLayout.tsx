import Navbar from "./Navbar";
import Footer from "./Footer";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import bgArt from "../../assets/images/bg_art.png";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div
      className="flex flex-col w-full min-h-screen max-w-screen bg-gradient-to-b from-background to-primary bg-fixed bg-cover bg-center"
      style={{
        backgroundImage:
          `radial-gradient(var(--chart-1), var(--chart-4)), url(${bgArt})`,
        backgroundBlendMode: "multiply",
      }}
    >
      <Toaster className="text-foreground" />
      <Navbar />
      <main className="flex-1 flex flex-col w-full items-center py-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
