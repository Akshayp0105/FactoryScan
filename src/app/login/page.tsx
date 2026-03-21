"use client";
import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <Card glass className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <ShieldCheck className={styles.icon} />
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your Factory Scan dashboard.</p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input type="email" placeholder="you@company.com" className={styles.input} required />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label>Password</label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input type="password" placeholder="••••••••" className={styles.input} required />
            </div>
          </div>

          <Link href="/dashboard" className={styles.submitLink}>
            <Button size="lg" className={styles.submitBtn}>
              Sign In
            </Button>
          </Link>
        </form>

        <p className={styles.footerText}>
          Don't have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
        </p>
      </Card>
    </div>
  );
}
