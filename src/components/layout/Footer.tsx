"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Twitter, Github, Linkedin, ArrowUpRight } from "lucide-react";
import styles from "./Footer.module.css";

export const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard") || pathname.includes("/login") || pathname.includes("/signup") || pathname.includes("/profile-setup")) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          
          {/* Brand Column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIconWrapper}>
                <ShieldCheck size={20} />
              </div>
              Factory Scan
            </Link>
            <p className={styles.bio}>
              Enterprise-grade AI fraud prevention, review classification, and document verification protecting the next generation of commerce.
            </p>
            <div className={styles.social}>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className={styles.column}>
            <h4>Products</h4>
            <ul className={styles.linkList}>
              <li><Link href="/features/document-watermark">Doc Watermark</Link></li>
              <li><Link href="/features/id-verification">ID Verification</Link></li>
              <li><Link href="/features/review-scoring">Review Intelligence</Link></li>
              <li><Link href="/features/refund-verification">Refund Analysis</Link></li>
            </ul>
          </div>

          {/* Developers Column */}
          <div className={styles.column}>
            <h4>Developers</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/docs/integration">
                  API Documentation <ArrowUpRight size={14} />
                </Link>
              </li>
              <li><Link href="/dashboard/api-keys">API Keys</Link></li>
              <li><a href="#" target="_blank" rel="noreferrer">Status Page</a></li>
              <li><a href="#" target="_blank" rel="noreferrer">Open Source</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className={styles.column}>
            <h4>Company</h4>
            <ul className={styles.linkList}>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Factory-Scan Inc. All rights reserved.
          </div>
          <div className={styles.status}>
            <div className={styles.statusDot} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};
