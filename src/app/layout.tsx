import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/layout/site-header";
import { CartProvider } from "@/components/cart/cart-provider";

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const bricolageGrotesque = Bricolage_Grotesque({
  weight: ["600", "700", "800"],
  variable: "--font-bricolage-grotesque",
});

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Indumentaria, bazar y regalos. Armá tu pedido y cerralo por WhatsApp: sin cuentas ni pago online.",
  openGraph: {
    title: "Catálogo",
    description:
      "Indumentaria, bazar y regalos. Armá tu pedido y cerralo por WhatsApp.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-AR"
      className={cn("h-full", dmSans.variable, bricolageGrotesque.variable)}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <CartProvider>
          <SiteHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
