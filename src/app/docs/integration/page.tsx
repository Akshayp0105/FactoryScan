"use client";
import React from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Code2, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  Cpu,
  Lock,
  UserCheck,
  FileSearch,
  Activity,
  ShieldAlert,
  ShoppingBag,
  CreditCard,
  Users,
  Terminal
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

const BENEFITS = [
  { 
    title: "Zero-Trust Architecture", 
    desc: "Every transaction is mathematically verified using cryptographic signatures and AI forensics.",
    icon: ShieldCheck,
    color: "var(--primary)"
  },
  { 
    title: "Global Intelligence", 
    desc: "Benefit from fraud signals shared across our entire partner network in real-time.",
    icon: Globe,
    color: "var(--secondary)"
  },
  { 
    title: "Ultra-Fast Execution", 
    desc: "Our edge network ensures verification results in under 200ms, maintaining a seamless UX.",
    icon: Zap,
    color: "#f59e0b"
  }
];

const STEPS = [
  { id: "01", title: "API Configuration", desc: "Generate your secure access credentials in the dashboard." },
  { id: "02", title: "Endpoint Integration", desc: "Connect our unified API to your existing checkout or review flows." },
  { id: "03", title: "Live Protection", desc: "Start receiving real-time trust scores and automated fraud flags." }
];

export default function PluginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <BackButton />
      </div>
      {/* Integrated Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroGrid}>
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.heroTextContent}
            >
                <div className={styles.miniBadge}>Native Integration</div>
                <h1 className={styles.heroTitle}>
                    Protect Every <span className="text-gradient">Transaction</span> with One Plugin.
                </h1>
                <p className={styles.heroSubtitle}>
                    Factory Scan embeds directly into your marketplace&apos;s existing workflows. 
                    No invasive UI, just pure, AI-powered security intelligence.
                </p>
                <div className={styles.heroActions}>
                    <Link href="/dashboard/api-keys">
                        <Button size="lg" leftIcon={<Zap size={18} />}>Deploy Now</Button>
                    </Link>
                    <Link href="#how-it-works">
                        <Button variant="ghost" size="lg">Technical Overview</Button>
                    </Link>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={styles.heroVisual}
            >
                <Card glass className={styles.previewCard}>
                    <div className={styles.previewHeader}>
                        <div className={styles.windowDots}>
                            <div className={styles.dotRed} />
                            <div className={styles.dotYellow} />
                            <div className={styles.dotGreen} />
                        </div>
                        <span className={styles.previewUrl}>api.factoryscan.io/v1/verify</span>
                    </div>
                    <div className={styles.previewContent}>
                        <pre className={styles.codeSnippet}>
{`const res = await fetch('https://api.factoryscan.io/v1/review/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'fs_live_YourApiKeyHere...'
  },
  body: JSON.stringify({
    reviewer_email: 'user@example.com',
    review_text: 'Great product, works as expected!',
    platform_id: 'shopify_01'
  })
});

const data = await res.json();
console.log(data.recommendation); // "DISPLAY"`}
                        </pre>
                    </div>
                    <div className={styles.previewStats}>
                        <div className={styles.pStat}>
                            <span className={styles.pVal}>182ms</span>
                            <span className={styles.pLab}>Latency</span>
                        </div>
                        <div className={styles.pStat}>
                            <span className={styles.pVal}>Encrypted</span>
                            <span className={styles.pLab}>Tunnel</span>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
      </section>

      {/* Benefits Layer - More Integrated Look */}
      <section className={styles.benefitsSection}>
        <div className={styles.grid}>
          {BENEFITS.map((benefit, i) => (
            <motion.div 
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card glass hoverEffect className={styles.benefitCard}>
                <div className={styles.benefitIcon} style={{ background: `color-mix(in srgb, ${benefit.color} 10%, transparent)`, color: benefit.color }}>
                  <benefit.icon size={28} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.worksSection}>
        <div className={styles.sectionHeader}>
            <h2>Integration in 3 Easy Steps</h2>
            <p>Designed by developers, for developers. Simple, powerful, and robust.</p>
        </div>
        <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
                <div key={step.id} className={styles.stepItem}>
                    <div className={styles.stepNumber}>{step.id}</div>
                    <div className={styles.stepContent}>
                        <h4>{step.title}</h4>
                        <p>{step.desc}</p>
                    </div>
                    {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
                </div>
            ))}
        </div>
      </section>

      {/* Immersive Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.sectionHeader}>
            <div className={styles.miniBadge}>The Security Stack</div>
            <h2 className={styles.sectionTitle}>Provided Services</h2>
            <p className={styles.sectionDesc}>
                Our plugin provides a suite of modular services that integrate into your core logic.
            </p>
        </div>

        <div className={styles.featureGrid}>
            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><Cpu size={24} /></div>
                <h4>AI Image Forensics</h4>
                <p>Detect deepfakes and AI-generated content in user uploads with 99.4% accuracy.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><ShieldCheck size={24} /></div>
                <h4>Global Fraud Registry</h4>
                <p>Instantly cross-reference users against 5M+ known fraud signals globally.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><Zap size={24} /></div>
                <h4>Real-time Trust Scoring</h4>
                <p>Proprietary algorithms compute a 1-100 trust score for every transaction.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><Lock size={24} /></div>
                <h4>Cryptographic Proof</h4>
                <p>Secure every verified event with a tamper-proof digital signature.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><UserCheck size={24} /></div>
                <h4>Liveness Verification</h4>
                <p>3D biometric checks to ensure real presence and prevent deepfake injection.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><FileSearch size={24} /></div>
                <h4>Document Intelligence</h4>
                <p>OCR-powered scanning of 5,000+ government ID types with instant verification.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><Activity size={24} /></div>
                <h4>Behavioral Biometrics</h4>
                <p>Analyze user interaction patterns to detect bots and non-human behavior.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className={styles.featureCard}>
                <div className={styles.fIcon}><ShieldAlert size={24} /></div>
                <h4>AML Compliance</h4>
                <p>Native integration with global sanctions lists and anti-money laundering databases.</p>
                <div className={styles.fBadge}>ACTIVE</div>
            </motion.div>
        </div>
      </section>

      {/* NEW Who We Serve Section */}
      <section className={styles.targetSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.miniBadge}>Target Markets</div>
            <h2 className={styles.sectionTitle}>Who We Serve</h2>
            <p className={styles.sectionDesc}>
               Designed for industries where trust is the primary currency. 
               We bridge the gap between user growth and risk mitigation.
            </p>
          </div>

          <div className={styles.targetGrid}>
              <div className={styles.targetCard}>
                  <div className={styles.targetIcon}><ShoppingBag /></div>
                  <h3>Marketplaces</h3>
                  <p>Secure every trade and review with decentralized trust scores.</p>
              </div>
              <div className={styles.targetCard}>
                  <div className={styles.targetIcon}><CreditCard /></div>
                  <h3>Fintech & Payments</h3>
                  <p>KYC/AML flows that feel native to your app and never break UX.</p>
              </div>
              <div className={styles.targetCard}>
                  <div className={styles.targetIcon}><Users /></div>
                  <h3>Gig Economy</h3>
                  <p>Verify identities of thousands of workers across borders in seconds.</p>
              </div>
              <div className={styles.targetCard}>
                  <div className={styles.targetIcon}><Terminal /></div>
                  <h3>SaaS Developers</h3>
                  <p>Embed security directly into your core API logic with zero UI overhead.</p>
              </div>
          </div>
      </section>

      {/* Technical Architecture - Minimalist & High-end */}
      <section className={styles.architectureSection}>
          <div className={styles.archContainer}>
              <div className={styles.archTitle}>Technical Architecture</div>
              <div className={styles.archFlow}>
                  <div className={styles.archNode}>Your Platform</div>
                  <div className={styles.archLine}><div className={styles.pulse} /></div>
                  <div className={styles.archNodeMain}>Factory Scan Plugin</div>
                  <div className={styles.archLine}><div className={styles.pulse} /></div>
                  <div className={styles.archNode}>AI Threat Engine</div>
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
              <h2>Ready to secure your future?</h2>
              <p>Join 200+ companies already using Factory Scan to protect their users.</p>
              <Link href="/dashboard/api-keys">
                 <Button variant="primary" size="lg">Get Your API Key Now</Button>
              </Link>
          </div>
      </section>
    </div>
  );
}
