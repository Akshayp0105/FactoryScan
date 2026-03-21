"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import styles from "./layout.module.css";
import { Menu, ShieldCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <div className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          <ShieldCheck color="var(--primary)" size={18} />
          <span>Factory Scan</span>
        </div>
        <button 
          className={styles.mobileMenuBtn} 
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
