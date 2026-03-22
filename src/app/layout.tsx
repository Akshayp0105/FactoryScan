import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { authClient } from '@/lib/auth/client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Factory Scan | AI Fraud Prevention',
  description: 'AI-Powered Fraud Prevention & Document Verification SDK and SaaS Platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NeonAuthUIProvider
          authClient={authClient}
          redirectTo="/profile-setup"
          emailOTP
          social={{ providers: ['google'] }}
        >
          <Navbar />
          <main className="app-main">
            {children}
          </main>
          <Footer />
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
