"use client";
import React from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, ShieldCheck, Activity, Image as ImageIcon, FileText, FileBadge2 } from "lucide-react";

const STATS = [
  { label: "Total Operations", value: "24,892", icon: Activity, trend: "+12%" },
  { label: "Fraud Stopped", value: "1,204", icon: ShieldAlert, trend: "+4%" },
  { label: "Avg Trust Score", value: "82/100", icon: ShieldCheck, trend: "Stable" },
];

const RECENT = [
  { id: "req_u98xa", type: "Refund Image", method: "AI Forensics", status: "FLAGGED", risk: "HIGH", time: "2m ago", icon: ImageIcon },
  { id: "req_z09bc", type: "Degree Certificate", method: "Watermark", status: "VERIFIED", risk: "LOW", time: "14m ago", icon: FileBadge2 },
  { id: "req_m12px", type: "Product Review", method: "Network Trust", status: "FLAGGED", risk: "HIGH", time: "1h ago", icon: FileText },
  { id: "req_b76qk", type: "ID Verification", method: "QR Ground Truth", status: "VERIFIED", risk: "LOW", time: "2h ago", icon: ShieldCheck },
];

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, Partner</h1>
          <p className={styles.subtitle}>Here is your platform trust overview.</p>
        </div>
        <div className={styles.globalScore}>
          <span>Network Health:</span>
          <div className={styles.scoreBadge}>Excellent</div>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsGrid}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card glass>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <Icon size={20} className={styles.statIcon} />
                </div>
                <div className={styles.statValueRow}>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                  <span className={styles.statTrend}>{stat.trend}</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className={styles.mainGrid}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.chartCol}
        >
          <Card glass hoverEffect>
            <h3 className={styles.cardTitle}>Live Threat Map</h3>
            <div className={styles.chartPlaceholder}>
              {/* Decorative radar/map or lines could go here */}
              <div className={styles.radarEffect} />
              <p>Scanning global trust network...</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={styles.recentCol}
        >
          <Card glass>
            <h3 className={styles.cardTitle}>Recent Operations</h3>
            <div className={styles.recentList}>
              {RECENT.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className={styles.recentItem}>
                    <div className={styles.recentIconWrapper}>
                      <Icon size={20} className={item.risk === "HIGH" ? styles.destructive : styles.primary} />
                    </div>
                    <div className={styles.recentDetails}>
                      <p className={styles.recentType}>{item.type}</p>
                      <p className={styles.recentMethod}>vias {item.method} • {item.time}</p>
                    </div>
                    <div className={cn(styles.recentStatus, item.status === "FLAGGED" ? styles.bgDestructive : styles.bgSuccess)}>
                      {item.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Utility class concatenator if cn doesn't work out of the box in the same file
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}
