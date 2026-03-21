"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Briefcase, 
  ArrowRight,
  Sparkles,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";
import { authClient } from "@/lib/auth/client";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    role: ""
  });

  // Autofill from session when it loads
  React.useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || session.user.name || "",
        email: prev.email || session.user.email || ""
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      // 1. Create organization in Neon Auth (optional, keeps current logic)
      if (formData.company) {
        await authClient.organization.create({
          name: formData.company,
          slug: formData.company.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        });
      }

      // 2. Save profile details to our backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          ...formData
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Profile setup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topNav} style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 20 }}>
          <BackButton />
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card glass className={styles.setupCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
               <Sparkles size={32} />
            </div>
            <h1 className={styles.title}>Welcome to Factory Scan</h1>
            <p className={styles.subtitle}>Let's complete your professional profile to get started.</p>
          </div>

          <div className={styles.stepper}>
              <div className={styles.stepDot} />
              <div className={styles.stepDotActive} />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <div className={styles.inputWrapper}>
                        <User className={styles.inputIcon} size={18} />
                        <input 
                            name="fullName"
                            type="text" 
                            className={styles.input} 
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe" 
                            required 
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <div className={styles.inputWrapper}>
                        <Mail className={styles.inputIcon} size={18} />
                        <input 
                            name="email"
                            type="email" 
                            className={styles.input} 
                            value={formData.email}
                            readOnly
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <div className={styles.inputWrapper}>
                        <Phone className={styles.inputIcon} size={18} />
                        <input 
                            name="phone"
                            type="tel" 
                            className={styles.input} 
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000" 
                            required 
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Current Location</label>
                    <div className={styles.inputWrapper}>
                        <MapPin className={styles.inputIcon} size={18} />
                        <input 
                            name="location"
                            type="text" 
                            className={styles.input} 
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="New York, USA" 
                            required 
                        />
                    </div>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Company / Organization</label>
                    <div className={styles.inputWrapper}>
                        <Building2 className={styles.inputIcon} size={18} />
                        <input 
                            name="company"
                            type="text" 
                            className={styles.input} 
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Engineering Co." 
                            required 
                        />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Your Role</label>
                    <div className={styles.inputWrapper}>
                        <Briefcase className={styles.inputIcon} size={18} />
                        <input 
                            name="role"
                            type="text" 
                            className={styles.input} 
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="Security Lead" 
                            required 
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className={styles.submitBtn} rightIcon={<ArrowRight />} disabled={loading}>
                {loading ? "Setting up..." : "Complete Profile & Launch"}
            </Button>
          </form>

          <p className={styles.footerNote}>
              Need help? <span>Contact our support team</span>.
          </p>
        </Card>
      </motion.div>hetics.)
    </div>
  );
}
