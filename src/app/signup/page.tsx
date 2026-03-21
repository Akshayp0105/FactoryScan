"use client";
import React from "react";
import Link from "next/link";
import styles from "../login/page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  return (
    <div className={styles.container}>
      <Card glass className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <ShieldCheck className={styles.icon} />
          </div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join the Unified Trust Score network.</p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={18} />
              <input type="text" placeholder="John Doe" className={styles.input} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Work Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input type="email" placeholder="you@company.com" className={styles.input} required />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input type="password" placeholder="Create a secure password" className={styles.input} required />
            </div>
          </div>

          <Link href="/profile-setup" className={styles.submitLink}>
            <Button size="lg" className={styles.submitBtn}>
              Continue to Setup
            </Button>
          </Link>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login" className={styles.link}>Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
