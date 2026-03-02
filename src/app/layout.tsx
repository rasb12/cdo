import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import Script from "next/script";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { IncompleteProfilePopup } from "@/components/IncompleteProfilePopup";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Corredores de Oriente",
  description: "Escuela de Atletismo - Corredores de Oriente",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CDOriente",
  }
};

export const viewport: Viewport = {
  themeColor: "#0AFF5F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </head>
      <body className={`${lexend.variable} font-display antialiased h-[100dvh] bg-background-dark text-slate-100 flex flex-col lg:flex-row overflow-hidden`}>
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background-dark scroll-smooth relative">
            {children}
          </main>
          <IncompleteProfilePopup />
          <Script id="register-sw" strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration.scope);
                  }, function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }
            `}
          </Script>
        </AuthProvider>
      </body>
    </html>
  );
}
