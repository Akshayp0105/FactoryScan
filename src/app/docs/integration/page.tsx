"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, Copy, Eye, EyeOff, KeyRound, ServerCrash } from "lucide-react";
import { motion } from "framer-motion";

export default function IntegrationPage() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const apiKey = "fs_live_9x81mNkLp2Qv5RdEz4WcY";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippet = `// Example: verify a refund image in an existing Node.js backend
const response = await fetch('https://api.factoryscan.io/api/v1/refund/verify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'multipart/form-data'
  },
  body: formDataWithImage
});

const { overall_risk, recommended_action, trust_score } = await response.json();
// → { overall_risk: "HIGH", recommended_action: "DENY", trust_score: 23 }`;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Plugin & Integration</h1>
        <p className={styles.subtitle}>
          Factory Scan is an API-first platform. Integrate in under 5 minutes to protect your application.
        </p>
      </div>

      <div className={styles.grid}>
        {/* API Key Management */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card glass>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <KeyRound className={styles.iconPrimary} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>API Keys</h2>
                <p className={styles.cardDesc}>Use this key to authenticate your server requests.</p>
              </div>
            </div>

            <div className={styles.apiKeyContainer}>
              <div className={styles.keyLabel}>Live Secret Key</div>
              <div className={styles.keyBox}>
                <code className={styles.keyText}>
                  {showKey ? apiKey : "fs_live_•••••••••••••••••••••••"}
                </code>
                <div className={styles.keyActions}>
                  <button onClick={() => setShowKey(!showKey)} className={styles.iconBtn} title="Toggle visibility">
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button onClick={handleCopy} className={styles.iconBtn} title="Copy to clipboard">
                    {copied ? <Check size={18} className={styles.successColor} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.webhookSection}>
              <h3 className={styles.subTitle}>Webhooks</h3>
              <p className={styles.cardDesc}>Listen for async verification events.</p>
              <div className={styles.inputGroup}>
                <input type="text" placeholder="https://your-api.com/webhooks/factory-scan" className={styles.input} />
                <Button size="sm">Save</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Integration Code Snippet */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card glass>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <ServerCrash className={styles.iconSecondary} />
              </div>
              <div>
                <h2 className={styles.cardTitle}>Quickstart Example</h2>
                <p className={styles.cardDesc}>Submit an image to the refund verification endpoint.</p>
              </div>
            </div>

            <div className={styles.codeBlock}>
              <div className={styles.codeHeader}>
                <span className={styles.langBadge}>Node.js</span>
              </div>
              <pre className={styles.pre}>
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
