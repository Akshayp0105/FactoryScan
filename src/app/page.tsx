"use client";
import React from "react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ShieldCheck,
  Fingerprint,
  Scan,
  MessageSquareWarning,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
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
            <Link href="/docs/integration">
              <Button variant="secondary" size="lg">
                View Integration
              </Button>
            </Link>
          </motion.div>
        </motion.div>
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
          {/* Feature 1 */}
          <Card hoverEffect glowColor="var(--primary)">
            <div className={styles.featureIcon}>
              <Scan />
            </div>
            <h3 className={styles.featureTitle}>Refund Image Verification</h3>
            <p className={styles.featureDesc}>
              Detect AI-generated product damage images used for fraudulent refunds. Scans for GAN artifacts, EXIF anomalies, and cross-platform history.
            </p>
            <Link href="/features/refund-verification" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>

          {/* Feature 2 */}
          <Card hoverEffect glowColor="var(--secondary)">
            <div className={styles.featureIcon}>
              <Fingerprint />
            </div>
            <h3 className={styles.featureTitle}>Document Watermarking</h3>
            <p className={styles.featureDesc}>
              Invisible cryptographic fingerprints for digital certificates. AI regeneration destroys the watermark—providing mathematical proof of tampering.
            </p>
            <Link href="/features/document-watermark" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>

          {/* Feature 3 */}
          <Card hoverEffect glowColor="var(--success)">
            <div className={styles.featureIcon}>
              <ShieldCheck />
            </div>
            <h3 className={styles.featureTitle}>Physical ID Card Verification</h3>
            <p className={styles.featureDesc}>
              QR-code-based ground truth verification for photographed identity documents. Defeats AI inpainting tools by comparing OCR against signed data.
            </p>
            <Link href="/features/id-verification" className={styles.featureLink}>
              Try Demo <ArrowRight size={16} />
            </Link>
          </Card>

          {/* Feature 4 */}
          <Card hoverEffect glowColor="var(--destructive)">
            <div className={styles.featureIcon}>
              <MessageSquareWarning />
            </div>
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

      {/* Partner Network / Trust Score Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContent}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={styles.trustText}
          >
            <h2>The Unified Trust Score</h2>
            <p>
              When a fraudster is flagged on one platform, their Trust Score degrades across the entire network. Gain enterprise-grade protection instantly through collective security intelligence.
            </p>
            <ul className={styles.trustList}>
              <li>
                <div className={styles.statusIndicator} data-status="success" />
                <span><strong>80-100:</strong> Auto-Approve</span>
              </li>
              <li>
                <div className={styles.statusIndicator} data-status="warning" />
                <span><strong>50-79:</strong> Flag for Manual Review</span>
              </li>
              <li>
                <div className={styles.statusIndicator} data-status="danger" />
                <span><strong>0-49:</strong> Auto-Deny & Escalate</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.trustVisual}
          >
            <div className={styles.mockScoreCard}>
              <div className={styles.mockHeader}>
                <ShieldCheck className={styles.mockIcon} />
                <span>Network Evaluation</span>
              </div>
              <div className={styles.mockBody}>
                <div className={styles.scoreCircle}>23</div>
                <div className={styles.scoreDetails}>
                  <h4>Overall Risk: <span className={styles.riskHigh}>CRITICAL</span></h4>
                  <p>Prior flags across partner networks: 4</p>
                  <div className={styles.actionDenied}>TRANSACTION BLOCKED</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
