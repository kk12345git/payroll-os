import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataInitializer } from "@/hooks/useInitializeData";
import ToastContainer from "@/components/ToastContainer";
import { ThemeProvider } from "@/components/ThemeProvider";
import InstallPrompt from "@/components/InstallPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Payroll Management System - Indian Compliance",
  description: "Enterprise payroll management with PF, ESI, TDS, and Tamil Nadu Professional Tax",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Antigravity" />
        <meta name="theme-color" content="#4f46e5" />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered');
                }, function(err) {
                  console.log('SW registration failed: ', err);
                });
              });
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <DataInitializer>
              {children}
              <ToastContainer />
              <InstallPrompt />
            </DataInitializer>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
