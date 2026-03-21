"use client";
import React from "react";
import Link from "next/link";
import styles from "../login/page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Building2, Globe, CheckCircle2 } from "lucide-react";

export default function ProfileSetupPage() {
  return (
    <div className={styles.container}>
      <Card glass className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.iconSuccessWrapper}>
            <CheckCircle2 className={styles.iconSuccess} />
          </div>
          <h1 className={styles.title}>Complete Profile</h1>
          <p className={styles.subtitle}>Tell us about your organization to tailor your fraud protection.</p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label>Organization Name</label>
            <div className={styles.inputWrapper}>
              <Building2 className={styles.inputIcon} size={18} />
              <input type="text" placeholder="Acme Corp" className={styles.input} required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Website URL</label>
            <div className={styles.inputWrapper}>
              <Globe className={styles.inputIcon} size={18} />
              <input type="url" placeholder="https://acme.com" className={styles.input} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Industry / Use Case</label>
            <select className={styles.select} required>
              <option value="" disabled selected>Select an industry...</option>
              <option value="ecommerce">eCommerce & Retail</option>
              <option value="education">Education & Universities</option>
              <option value="finance">Banking & Finance</option>
              <option value="subscription">SaaS & Subscriptions</option>
            </select>
          </div>

          <Link href="/dashboard" className={styles.submitLink}>
            <Button size="lg" className={styles.submitBtn}>
              Complete Setup & Go to Dashboard
            </Button>
          </Link>
        </form>
      </Card>
    </div>
  );
}
