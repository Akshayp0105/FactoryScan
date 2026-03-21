"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/BackButton";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UploadCloud, ScanLine, AlertTriangle, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RefundVerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const scanFile = async () => {
    if (!file) return;
    setIsScanning(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      // Sending mock data for trust scoring
      formData.append("email", "test@example.com");
      formData.append("phone_number", "+1234567890");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/refund/verify`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
      } else {
        console.error("API error:", data.error);
        setResult({ error: data.error || "Failed to scan image." });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult({ error: "Network error occurred." });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.header}>
        <h1 className={styles.title}>Refund Image Verification</h1>
        <p className={styles.subtitle}>
          Detect AI-generated product damage images used to claim fraudulent refunds across partner networks.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Upload Zone */}
        <div className={styles.leftCol}>
          <Card glass className={styles.uploadCard}>
            {!preview ? (
              <div 
                className={styles.dropzone}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <div className={styles.dropContext}>
                  <UploadCloud size={48} className={styles.dropIcon} />
                  <h3>Upload Damage Image</h3>
                  <p>Drag & drop or click to browse</p>
                  <Button variant="secondary" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                    Select File
                  </Button>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
                    className={styles.hiddenInput} 
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <img src={preview} alt="Preview" className={styles.previewImage} />
                <div className={styles.previewOverlay}>
                  <Button variant="secondary" size="sm" onClick={() => { setFile(null); setPreview(null); setResult(null); }}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Button 
            className={styles.scanBtn}
            size="lg" 
            disabled={!file || isScanning} 
            isLoading={isScanning}
            onClick={scanFile}
            leftIcon={<ScanLine />}
          >
            {isScanning ? "Scanning Deep Forensics..." : "Run AI Verification"}
          </Button>
        </div>

        {/* Results Visualizer */}
        <div className={styles.rightCol}>
          <Card glass className={styles.resultCard}>
            <AnimatePresence mode="wait">
              {!result && !isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className={styles.emptyState}
                >
                  <ImageIcon size={48} className={styles.emptyIcon} />
                  <p>Upload an image and run verification to see the analysis report.</p>
                </motion.div>
              )}

              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className={styles.scanningState}
                >
                  <div className={styles.scanLines}>
                    <div className={styles.scanLine} />
                    <div className={styles.scanLine} style={{ animationDelay: '0.5s' }} />
                    <div className={styles.scanLine} style={{ animationDelay: '1s' }} />
                  </div>
                  <p className={styles.scanText}>Analyzing pixel distribution...</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={styles.resultData}
                >
                  <div className={styles.resultHeader}>
                    <div className={styles.verdictBox}>
                      <span className={styles.verdictLabel}>VERDICT</span>
                      <h2 className={styles.verdictText}>{result.recommended_action}</h2>
                    </div>
                    <div className={styles.scoreBox}>
                      <span className={styles.scoreLabel}>TRUST SCORE</span>
                      <h2 className={styles.scoreText}>{result.trust_score}</h2>
                    </div>
                  </div>

                  <div className={styles.signalsList}>
                    <h3 className={styles.signalsTitle}>Detection Pipeline</h3>
                    
                    <div className={styles.signalItem}>
                      <div className={styles.signalHeader}>
                        <AlertTriangle className={styles.signalIconFail} />
                        <h4>AI Generation Forensics</h4>
                        <span className={styles.signalBadgeFail}>{result.signal_breakdown.ai_forensics.confidence}% Match</span>
                      </div>
                      <p className={styles.signalDesc}>{result.signal_breakdown.ai_forensics.details}</p>
                    </div>

                    <div className={styles.signalItem}>
                      <div className={styles.signalHeader}>
                        <AlertTriangle className={styles.signalIconFail} />
                        <h4>EXIF Metadata Analysis</h4>
                        <span className={styles.signalBadgeFail}>Anomalies</span>
                      </div>
                      <p className={styles.signalDesc}>{result.signal_breakdown.exif_analysis.details}</p>
                    </div>

                    <div className={styles.signalItem}>
                      <div className={styles.signalHeader}>
                        <ShieldCheck className={styles.signalIconFail} />
                        <h4>Global Trust Network</h4>
                        <span className={styles.signalBadgeFail}>History</span>
                      </div>
                      <p className={styles.signalDesc}>{result.signal_breakdown.trust_score_check.details}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
