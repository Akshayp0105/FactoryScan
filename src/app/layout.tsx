import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: 'Factory Scan | AI Fraud Prevention',
  description: 'AI-Powered Fraud Prevention & Document Verification SDK and SaaS Platform.',
};

import { Navbar } from '@/components/layout/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="app-main">
          {children}
        </main>
      </body>
    </html>
  );
}
