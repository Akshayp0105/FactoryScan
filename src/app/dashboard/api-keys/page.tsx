"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Copy, Eye, EyeOff, KeyRound, Server, ShieldCheck, Zap, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { authClient } from "@/lib/auth/client";

export default function APIKeysPage() {
  const { data: session } = authClient.useSession();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  
  // New Key Form
  const [newKeyName, setNewKeyName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(30);

  useEffect(() => {
    if (session?.user?.id) {
      fetchKeys();
    }
  }, [session?.user?.id]);

  const fetchKeys = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/keys/${session?.user?.id}`);
      const data = await res.json();
      if (data.success) {
        setKeys(data.result);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + Number(expiresInDays));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          name: newKeyName || "Standard Key",
          expiresAt: expiry.toISOString()
        })
      });
      const data = await res.json();
      if (data.success) {
        setKeys([...keys, data.result]);
        setNewKeyName("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/keys/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setKeys(keys.filter(k => k.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (id: string, keyVal: string) => {
    navigator.clipboard.writeText(keyVal);
    setCopied({ ...copied, [id]: true });
    setTimeout(() => setCopied({ ...copied, [id]: false }), 2000);
  };

  const toggleVisibility = (id: string) => {
    setShowKey({ ...showKey, [id]: !showKey[id] });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <BackButton />
      </div>
      <div className={styles.header}>
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className={styles.title}>API Management</h1>
          <p className={styles.subtitle}>
            Manage your credentials and secure your server-to-server integrations. This locks your SDK endpoints.
          </p>
        </motion.div>
      </div>

      <div className={styles.grid}>
        {/* API Key Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card glass>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <KeyRound size={24} className={styles.iconPrimary} />
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.cardTitle}>Live API Keys</h2>
                <p className={styles.cardDesc}>These keys provide full access to your production scanner endpoints.</p>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <input 
                type="text" 
                placeholder="Key Name (e.g. Prod Config)" 
                className={styles.input} 
                style={{ flex: 1, minWidth: "150px" }}
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
              />
              <select 
                className={styles.input} 
                style={{ width: "auto" }}
                value={expiresInDays}
                onChange={e => setExpiresInDays(Number(e.target.value))}
              >
                <option value={7}>7 Days</option>
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
                <option value={365}>1 Year</option>
              </select>
              <Button onClick={handleCreate} disabled={loading} leftIcon={<Plus size={16} />}>Generate</Button>
            </div>

            {keys.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>No active API keys found. Generate one to use the endpoints.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {keys.map(k => (
                  <div key={k.id} className={styles.apiKeyContainer}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 600 }}>{k.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", alignSelf: "center" }}>
                        Expires: {k.expires_at ? new Date(k.expires_at).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                    <div className={styles.keyBox}>
                      <code className={styles.keyText}>
                        {showKey[k.id] ? k.key : "fs_live_********************************"}
                      </code>
                      <div className={styles.keyActions}>
                        <button onClick={() => toggleVisibility(k.id)} className={styles.iconBtn} title="Toggle visibility">
                          {showKey[k.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button onClick={() => handleCopy(k.id, k.key)} className={styles.iconBtn} title="Copy to clipboard">
                          {copied[k.id] ? <Check size={18} className={styles.successColor} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className={styles.keyFooter} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p className={styles.warning}>
                        <ShieldCheck size={14} /> Keep this key secret.
                      </p>
                      <Button variant="ghost" size="sm" onClick={() => handleRevoke(k.id)} style={{ color: "var(--destructive)" }}>
                        <Trash2 size={14} style={{ marginRight: "4px" }} /> Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Usage Stats / Quota */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card glass>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <Zap size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.cardTitle}>Plan Usage</h2>
                <p className={styles.cardDesc}>Developer Sandbox Plan</p>
              </div>
            </div>

            <div className={styles.quotaSection}>
              <div className={styles.quotaRow}>
                <span>Requests used</span>
                <span>892 / 5,000</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div 
                    className={styles.progressFill} 
                    initial={{ width: 0 }}
                    animate={{ width: '18%' }}
                    transition={{ duration: 1 }}
                />
              </div>
              <div className={styles.quotaRow}>
                <span>Monthly reset in</span>
                <span>12 days</span>
              </div>
            </div>

            <Button variant="primary" className="w-full">Upgrade Plan</Button>
          </Card>
        </motion.div>
      </div>

      {/* Webhooks Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card glass className={styles.fullWidthCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper} style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <Server size={24} style={{ color: 'var(--secondary)' }} />
              </div>
              <div className={styles.headerText}>
                <h2 className={styles.cardTitle}>Incoming Webhooks</h2>
                <p className={styles.cardDesc}>Receive real-time notifications for event-driven workflows.</p>
              </div>
            </div>

            <div className={styles.webhookSetup}>
                <div className={styles.inputGroup}>
                    <label>Webhook endpoint URL</label>
                    <div className={styles.inputRow}>
                        <input type="text" placeholder="https://your-api.com/webhooks/factory-scan" className={styles.input} />
                        <Button>Save Config</Button>
                    </div>
                </div>
            </div>
          </Card>
      </motion.div>
    </div>
  );
}
