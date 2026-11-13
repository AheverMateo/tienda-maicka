import type { Metadata } from "next";
import { DM_Sans, Bricolage_Grotesque, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["700", "800"],
  variable: "--font-bricolage-grotesque",
});

export const metadata: Metadata = {
  title: "Plan día por día – Catálogo con IA",
  description: "Tienda con pedidos por WhatsApp y fotos mejoradas con IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", dmSans.variable, bricolageGrotesque.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}