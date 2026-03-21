"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { BackButton } from "@/components/ui/BackButton";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, ShieldCheck, Activity, Image as ImageIcon, FileText, FileBadge2, ArrowRight } from "lucide-react";

const INITIAL_STATS = [
  { id: "total", label: "Total Operations", value: "...", icon: Activity, trend: "Auto" },
  { id: "fraud", label: "Fraud Stopped", value: "...", icon: ShieldAlert, trend: "Auto" },
  { id: "trust", label: "Avg Trust Score", value: ".../100", icon: ShieldCheck, trend: "Stable" },
];

const QUICK_ACCESS = [
  { id: "id-verify", label: "ID Verification", desc: "Scan and authenticate Passports & IDs", href: "/features/id-verification", icon: ShieldCheck, color: "var(--primary)" },
  { id: "refund-verify", label: "Refund Review", desc: "Analyze return requests for fraud", href: "/features/refund-verification", icon: ImageIcon, color: "var(--success)" },
  { id: "review-score", label: "Review Scoring", desc: "Detect fake or AI-generated reviews", href: "/features/review-scoring", icon: FileText, color: "#f59e0b" },
  { id: "doc-watermark", label: "Watermark Check", desc: "Find alterations in documents", href: "/features/document-watermark", icon: FileBadge2, color: "var(--secondary)" },
];

// Helper to format time diff
function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  if (Number.isNaN(diff)) return "just now";
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Convert DB endpoint routing to UI format
function formatDbLog(log: any) {
  const isFraud = log.result_status === "FLAGGED" || log.result_status === "FLAG" || log.result_status === "FAIL";
  let icon = Activity;
  let type = "Verification";
  let method = "API Check";

  if (log.endpoint.includes("refund")) {
    icon = ImageIcon;
    type = "Refund Request";
    method = "AI Forensics";
  } else if (log.endpoint.includes("document")) {
    icon = FileBadge2;
    type = "Document Check";
    method = "Watermark/Steganography";
  } else if (log.endpoint.includes("review")) {
    icon = FileText;
    type = "Product Review";
    method = "Network Trust";
  } else if (log.endpoint.includes("id")) {
    icon = ShieldCheck;
    type = "ID Verification";
    method = "QR Ground Truth";
  }

  return {
    id: `req_${log.id}`,
    type,
    method,
    status: isFraud ? "FLAGGED" : "VERIFIED",
    risk: isFraud ? "HIGH" : "LOW",
    time: log.created_at ? timeAgo(log.created_at) : "just now",
    icon
  };
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [recent, setRecent] = useState<any[]>([]);

  const userName = profile?.full_name || session?.user?.name || "Partner";

  useEffect(() => {
    if (session?.user?.id) {
      // 1. Fetch profile
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/profile/${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProfile(data.result);
          }
        })
        .catch(err => console.error("Failed to fetch profile:", err));
      
      // 2. Fetch stats
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/dashboard/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.stats) {
            setStats([
              { id: "total", label: "Total Operations", value: data.stats.totalOperations.toLocaleString(), icon: Activity, trend: "+0%" },
              { id: "fraud", label: "Fraud Stopped", value: data.stats.fraudStopped.toLocaleString(), icon: ShieldAlert, trend: "+0%" },
              { id: "trust", label: "Avg Trust Score", value: `${data.stats.avgTrustScore}/100`, icon: ShieldCheck, trend: "Stable" },
            ]);
          }
        })
        .catch(err => console.error("Failed to fetch stats:", err));

      // 3. Fetch recent
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/dashboard/recent`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.result) {
            setRecent(data.result.map(formatDbLog));
          }
        })
        .catch(err => console.error("Failed to fetch recent records:", err));
    }
  }, [session]);

  return (
    <div className={styles.container}>
      <div className="mb-4">
        <BackButton />
      </div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {userName}</h1>
          <p className={styles.subtitle}>{profile?.company ? `Overview for ${profile.company}` : "Here is your platform trust overview."}</p>
        </div>
        <div className={styles.globalScore}>
          <span>Network Health:</span>
          <div className={styles.scoreBadge}>Excellent</div>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => {
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

      {/* Quick Access Grid */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <p className={styles.sectionSubtitle}>Jump directly into core fraud detection tools.</p>
      </div>
      <div className={styles.quickActionsGrid}>
        {QUICK_ACCESS.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link href={action.href} key={action.id}>
              <motion.div
                className={styles.quickActionCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className={styles.cardGlow} style={{ background: action.color }} />
                <div className={styles.quickActionIcon} style={{ background: `color-mix(in srgb, ${action.color} 15%, transparent)` }}>
                  <Icon size={24} style={{ color: action.color }} />
                </div>
                <div className={styles.quickActionContent}>
                  <h3 className={styles.quickActionTitle}>{action.label}</h3>
                  <p className={styles.quickActionDesc}>{action.desc}</p>
                </div>
                <div className={styles.quickActionFooter} style={{ color: action.color }}>
                  Start Scan <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
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
              <div className={styles.mapGrid} />
              <div className={styles.radarEffect}>
                <div className={styles.radarScanningBar} />
              </div>
              <div className={styles.radarDot} style={{ top: '20%', left: '30%', animationDelay: '0s' }} />
              <div className={styles.radarDot} style={{ top: '60%', left: '70%', animationDelay: '1.2s' }} />
              <div className={styles.radarDot} style={{ top: '45%', left: '80%', animationDelay: '0.5s' }} />
              <p className={styles.scanningText}>Scanning global trust network...</p>
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
              {recent.length === 0 ? (
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", padding: "1rem 0" }}>No recent operations found.</p>
              ) : recent.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className={styles.recentItem}>
                    <div className={styles.recentIconWrapper}>
                      {Icon && <Icon size={20} className={item.risk === "HIGH" ? styles.destructive : styles.primary} />}
                    </div>
                    <div className={styles.recentDetails}>
                      <p className={styles.recentType}>{item.type}</p>
                      <p className={styles.recentMethod}>via {item.method} • {item.time}</p>
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
