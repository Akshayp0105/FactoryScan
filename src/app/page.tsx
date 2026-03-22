"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { motion, useInView, useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ShieldCheck,
  Fingerprint,
  Scan,
  MessageSquareWarning,
  ArrowRight,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Ban,
} from "lucide-react";
import Link from "next/link";

import { Footer } from "@/components/layout/Footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Animated number counter hook
function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(100);
  useEffect(() => {
    if (!trigger) return;
    const start = 100;
    const diff = start - target;
    const steps = Math.ceil(duration / 16);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCount(Math.round(start - (diff * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

const TRUST_LEVELS = [
  {
    range: "80–100",
    label: "Auto-Approve",
    status: "success",
    icon: CheckCircle2,
    color: "#06b6d4",
    desc: "Instant clearance. No friction.",
  },
  {
    range: "50–79",
    label: "Flag for Review",
    status: "warning",
    icon: AlertTriangle,
    color: "#f59e0b",
    desc: "Human review triggered.",
  },
  {
    range: "0–49",
    label: "Auto-Deny & Escalate",
    status: "danger",
    icon: Ban,
    color: "#ef4444",
    desc: "Transaction blocked network-wide.",
  },
];

export default function Home() {
  const trustRef = useRef(null);
  const isInView = useInView(trustRef, { once: true, margin: "-100px" });
  const score = 23;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const animatedScore = useCountUp(score, 1500, isInView);

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridOverlay} />
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>
        
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={fadeIn} className={styles.badge}>
            <span className={styles.badgeLabel}>v1.0 Hackathon Release</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className={styles.title}>
            AI-Powered <br />
            <span className="text-gradient">Fraud Prevention</span> & <br /> Document Verification
          </motion.h1>
          
          <motion.p variants={fadeIn} className={styles.subtitle}>
            Protect your platform from AI-assisted fraud, tampered certificates, and fake reviews. 
            Join the decentralized Unified Trust Score network.
          </motion.p>
          
          <motion.div variants={fadeIn} className={styles.ctaGroup}>
            <Link href="/dashboard">
              <Button size="lg" rightIcon={<ArrowRight />}>
                Launch Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/api-keys">
              <Button variant="secondary" size="lg">
                Get API Access
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeIn} className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>2M+</span>
              <span className={styles.statLabel}>Scans/Day</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>99.9%</span>
              <span className={styles.statLabel}>Accuracy</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>&lt;200ms</span>
              <span className={styles.statLabel}>Latency</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating UI Elements */}
        <div className={styles.floatingElements}>
            <motion.div 
                className={styles.floatCard}
                style={{ top: '15%', left: '12%' }}
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className={styles.floatIcon}><ShieldCheck size={18} /></div>
                <span>Tamper-Proof</span>
            </motion.div>
            
            <motion.div 
                className={styles.floatCircle}
                style={{ top: '35%', right: '8%' }}
                animate={{ y: [0, 15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
                <div className={styles.floatIcon} style={{ color: 'var(--secondary)' }}><Zap size={16} /></div>
            </motion.div>

            <motion.div 
                className={styles.floatCard}
                style={{ top: '65%', left: '15%' }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <div className={styles.floatIcon} style={{ color: '#10b981' }}><CheckCircle2 size={18} /></div>
                <span>Trust Score: 98</span>
            </motion.div>

            <motion.div 
                className={styles.floatCard}
                style={{ top: '55%', right: '15%' }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className={styles.floatIcon} style={{ color: 'var(--secondary)' }}><Fingerprint size={18} /></div>
                <span>Identity Verified</span>
            </motion.div>
        </div>
      </section>

      {/* Trust Ticker */}
      <section className={styles.tickerSection}>
         <div className={styles.tickerWrapper}>
            <div className={styles.tickerContent}>
                <span>TRUSTED BY INDUSTRY LEADERS</span>
                <div className={styles.dot} />
                <span>SECURED OVER $400M IN TRANSACTIONS</span>
                <div className={styles.dot} />
                <span>ACTIVE NODES: 4,892</span>
                <div className={styles.dot} />
                <span>ZERO FALSE POSITIVES IN LAST 24H</span>
                <div className={styles.dot} />
                <span>TRUSTED BY INDUSTRY LEADERS</span>
                <div className={styles.dot} />
                <span>SECURED OVER $400M IN TRANSACTIONS</span>
                <div className={styles.dot} />
                <span>ACTIVE NODES: 4,892</span>
                <div className={styles.dot} />
                <span>ZERO FALSE POSITIVES IN LAST 24H</span>
            </div>
         </div>
      </section>

      {/* Features Overview */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Four Layers of Protection</h2>
          <p className={styles.sectionSubtitle}>
            Every signal combines into a unified Trust Score to mathematically prove document integrity.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <Card hoverEffect glowColor="var(--primary)">
            <div className={styles.featureIcon}><Scan /></div>
            <h3 className={styles.featureTitle}>Refund Image Verification</h3>
            <p className={styles.featureDesc}>
              Detect AI-generated product damage images used for fraudulent refunds. Scans for GAN artifacts, EXIF anomalies, and cross-platform history.
            </p>
            <Link href="/features/refund-verification" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>
          <Card hoverEffect glowColor="var(--secondary)">
            <div className={styles.featureIcon}><Fingerprint /></div>
            <h3 className={styles.featureTitle}>Document Watermarking</h3>
            <p className={styles.featureDesc}>
              Invisible cryptographic fingerprints for digital certificates. AI regeneration destroys the watermark—providing mathematical proof of tampering.
            </p>
            <Link href="/features/document-watermark" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>
          <Card hoverEffect glowColor="var(--success)">
            <div className={styles.featureIcon}><ShieldCheck /></div>
            <h3 className={styles.featureTitle}>Physical ID Card Verification</h3>
            <p className={styles.featureDesc}>
              QR-code-based ground truth verification for photographed identity documents. Defeats AI inpainting tools by comparing OCR against signed data.
            </p>
            <Link href="/features/id-verification" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>
          <Card hoverEffect glowColor="var(--destructive)">
            <div className={styles.featureIcon}><MessageSquareWarning /></div>
            <h3 className={styles.featureTitle}>Review Credibility</h3>
            <p className={styles.featureDesc}>
              Score product reviews for AI generation, spam rings, and prior fraud history to protect sellers and maintain marketplace integrity.
            </p>
            <Link href="/features/review-scoring" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>
        </div>
      </section>

      {/* === REDESIGNED: Unified Trust Score Section === */}
      <section className={styles.trustSection} ref={trustRef}>
        {/* Background glow blobs */}
        <div className={styles.trustBg}>
          <div className={styles.trustBlob1} />
          <div className={styles.trustBlob2} />
        </div>

        <div className={styles.trustContent}>
          {/* LEFT: Text + Trust Levels */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.trustText}
          >
            <div className={styles.trustEyebrow}>Decentralized Intelligence</div>
            <h2 className={styles.trustHeading}>The Unified<br /><span className={styles.trustGradientWord}>Trust Score</span></h2>
            <p className={styles.trustDesc}>
              When a fraudster is flagged on one platform, their Trust Score degrades across the <em>entire network</em>. Gain enterprise-grade protection through collective security intelligence.
            </p>
            <ul className={styles.trustList}>
              {TRUST_LEVELS.map((level, i) => {
                const Icon = level.icon;
                return (
                  <motion.li
                    key={level.range}
                    className={styles.trustLevelItem}
                    style={{ "--level-color": level.color } as React.CSSProperties}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <div className={styles.trustLevelIcon}>
                      <Icon size={16} />
                    </div>
                    <div className={styles.trustLevelText}>
                      <span className={styles.trustLevelRange}>{level.range}</span>
                      <span className={styles.trustLevelLabel}>{level.label}</span>
                      <span className={styles.trustLevelDesc}>{level.desc}</span>
                    </div>
                    <div className={styles.trustLevelGlow} />
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* RIGHT: Animated Score Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={styles.trustVisual}
          >
            <div className={styles.mockScoreCard}>
              {/* Terminal header */}
              <div className={styles.mockHeader}>
                <div className={styles.terminalDots}>
                  <span className={styles.dotRed} />
                  <span className={styles.dotYellow} />
                  <span className={styles.dotGreen} />
                </div>
                <span className={styles.terminalTitle}>fs_network_eval.exe</span>
                <div className={styles.headerPing}>
                  <span className={styles.pingDot} />
                  LIVE
                </div>
              </div>

              {/* Scanning overlay */}
              <div className={styles.scanOverlay}>
                <div className={styles.scanLine} />
              </div>

              {/* Score body */}
              <div className={styles.mockBody}>
                {/* SVG Ring */}
                <div className={styles.svgRingWrapper}>
                  <svg width="140" height="140" viewBox="0 0 140 140" className={styles.svgRing}>
                    {/* Background ring */}
                    <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="8" stroke="rgba(255,255,255,0.06)" />
                    {/* Animated danger ring */}
                    <motion.circle
                      cx="70" cy="70" r={radius} fill="none" strokeWidth="8"
                      stroke="#ef4444"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={isInView ? { strokeDashoffset } : {}}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "center",
                        filter: "drop-shadow(0 0 8px #ef4444)",
                      }}
                    />
                    {/* Glow ring */}
                    <motion.circle
                      cx="70" cy="70" r={radius} fill="none" strokeWidth="1"
                      stroke="#ef4444"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={isInView ? { strokeDashoffset } : {}}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "center",
                        filter: "blur(4px)",
                        opacity: 0.5,
                      }}
                    />
                  </svg>
                  {/* Animated counter */}
                  <div className={styles.scoreInner}>
                    <span className={styles.scoreValue}>{animatedScore}</span>
                    <span className={styles.scoreSubtext}>/100</span>
                  </div>
                </div>

                {/* Details */}
                <div className={styles.scoreDetails}>
                  <div className={styles.riskBadge}>
                    <AlertTriangle size={14} />
                    CRITICAL RISK
                  </div>
                  <h4 className={styles.scoreTitle}>Overall Risk</h4>
                  <div className={styles.scoreMetrics}>
                    <div className={styles.metricRow}>
                      <span>Prior flags</span>
                      <span className={styles.metricVal}>4 networks</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span>Pattern match</span>
                      <span className={styles.metricVal}>94.2%</span>
                    </div>
                    <div className={styles.metricRow}>
                      <span>Identity check</span>
                      <span className={styles.metricValFail}>FAILED</span>
                    </div>
                  </div>
                  <motion.div
                    className={styles.actionDenied}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Ban size={12} />
                    TRANSACTION BLOCKED
                  </motion.div>
                </div>
              </div>

              {/* Holographic shimmer effect */}
              <div className={styles.holographicSheen} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* EXTENSION SECTION */}
      <section className={styles.extSection}>
        <div className={styles.extContainer}>
          <motion.div 
            className={styles.extTextContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Factory-Scan <br/><span className={styles.extHighlight}>Anywhere You Browse</span></h2>
            <p className={styles.extDesc}>
              Stop manually checking reviews. Install our secure extension to automatically classify reviews and detect suspicious patterns on any storefront.
            </p>

            <div className={styles.extSteps}>
              <div className={styles.extStep}>
                <div className={styles.extStepNumber}>1</div>
                <div className={styles.extStepText}>
                  <h4>Download & Extract</h4>
                  <p>Download the latest release and extract it to a local folder.</p>
                </div>
              </div>
              <div className={styles.extStep}>
                <div className={styles.extStepNumber}>2</div>
                <div className={styles.extStepText}>
                  <h4>Activate Developer Mode</h4>
                  <p>Go to <code>chrome://extensions</code> and toggle Developer mode on.</p>
                </div>
              </div>
              <div className={styles.extStep}>
                <div className={styles.extStepNumber}>3</div>
                <div className={styles.extStepText}>
                  <h4>Load Unpacked</h4>
                  <p>Click &quot;Load unpacked&quot; and select your extracted folder.</p>
                </div>
              </div>
            </div>

            <div className={styles.extDownloadBtnWrapper}>
              <div className={styles.pulseGlow}></div>
              <motion.a 
                href="/extension.zip"
                download
                className={styles.extDownloadBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={22} fill="currentColor" /> 
                Get the Extension
              </motion.a>
            </div>
          </motion.div>

          {/* VISUAL MOCKUP */}
          <motion.div 
            className={styles.extVisual}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.extBrowserMockup}>
              {/* Browser Header */}
              <div className={styles.extBrowserHeader}>
                <div className={styles.extBrowserDot}/>
                <div className={styles.extBrowserDot}/>
                <div className={styles.extBrowserDot}/>
                <div className={styles.extBrowserAddress}>https://examplestore.com/product</div>
              </div>

              {/* Browser Content */}
              <div className={styles.extBrowserBody}>
                
                {/* Fake Review 1 */}
                <div className={styles.extFakeReview}>
                  <div className={styles.extScanBadge}>
                    <AlertTriangle size={12} strokeWidth={3} />
                    AI GENERATED
                  </div>
                  <div className={styles.extReviewHeader}>
                    <span>&quot;Amazing product, changed my life...&quot;</span>
                    <span className={styles.extReviewStars}>★★★★★</span>
                  </div>
                  <div className={styles.extReviewBars}>
                    <div className={styles.extBar}></div>
                    <div className={`${styles.extBar} ${styles.medium}`}></div>
                  </div>
                </div>

                {/* Fake Review 2 */}
                <div className={styles.extFakeReview}>
                  <div className={`${styles.extScanBadge} ${styles.genuine}`}>
                    <CheckCircle2 size={12} strokeWidth={3} />
                    GENUINE
                  </div>
                  <div className={styles.extReviewHeader}>
                    <span>&quot;Works as expected, shipping was...&quot;</span>
                    <span className={styles.extReviewStars}>★★★★☆</span>
                  </div>
                  <div className={styles.extReviewBars}>
                    <div className={`${styles.extBar} ${styles.short}`}></div>
                    <div className={styles.extBar}></div>
                  </div>
                </div>

                {/* Scanner Beam Animation */}
                <motion.div 
                  className={styles.extScannerBeam}
                  animate={{
                    y: [0, 200, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      
    </div>
  );
}

