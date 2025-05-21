import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import AuthProviders from "@/context/AuthProviders";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/components/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "400", "600"],
});

export const metadata: Metadata = {
  title: "Stealth Q&A",
  description:
    "Stealth Q&A is an anonymous Q&A platform with AI-powered question suggestions to spark engaging conversations. Send and receive messages privately without revealing your identity. Whether for fun, deep discussions, or secrets, StealthChat makes anonymous chatting seamless, secure, and interactive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProviders>
        <body
          className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <MainLayout>
            {children}
            <Toaster />
          </MainLayout>
        </body>
      </AuthProviders>
    </html>
  );
}
