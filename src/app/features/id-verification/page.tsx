"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScanFace, UserCheck, AlertTriangle, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MOCK_RESULTS = [
  { field: "Full Name", groundTruth: "John Smith", ocr: "John Smith", match: true },
  { field: "Course", groundTruth: "BSc Computer Science", ocr: "MSc Computer Science", match: false },
  { field: "Expiry Date", groundTruth: "August 2024", ocr: "August 2026", match: false },
  { field: "Student ID", groundTruth: "20210445", ocr: "20210445", match: true },
];

export default function IdVerificationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResultReady(false);
    }
  };

  const simulateScan = () => {
    if (!file) return;
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setResultReady(true);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Physical ID Verification</h1>
        <p className={styles.subtitle}>
          Compare visual OCR text against signed QR-code ground truth data to detect AI inpainting and physical tampering.
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.scanCol}>
          <Card glass className={styles.uploadCard}>
            {!preview ? (
              <div className={styles.uploadBox}>
                <ScanFace size={48} className={styles.uploadIcon} />
                <h3>Upload ID Card Photo</h3>
                <p>Ensure the QR code and text are clearly visible</p>
                <Button variant="secondary" onClick={() => document.getElementById('id-upload')?.click()}>
                  Browse Files
                </Button>
                <input id="id-upload" type="file" accept="image/*" className={styles.hiddenInput} onChange={handleFileChange} />
              </div>
            ) : (
              <div className={styles.previewContainer}>
                <img src={preview} alt="ID Preview" className={styles.previewImage} />
                
                {isScanning && (
                  <div className={styles.scanOverlay}>
                    <div className={styles.targetBox} />
                    <div className={styles.scanningText}>Extracting visual text & QR token...</div>
                  </div>
                )}
                
                {resultReady && (
                  <div className={styles.highlightsOverlay}>
                    <div className={cn(styles.highlightBox, styles.qrHighlight)}><QrCode size={16}/> Signed Token</div>
                    <div className={cn(styles.highlightBox, styles.tamperHighlight)}>Text Tampering</div>
                  </div>
                )}
                
                <div className={styles.clearBtnWrapper}>
                  {!isScanning && (
                    <Button variant="secondary" size="sm" onClick={() => { setFile(null); setPreview(null); setResultReady(false); }}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Button 
            className={styles.actionBtn}
            size="lg" 
            disabled={!file || isScanning || resultReady} 
            isLoading={isScanning}
            onClick={simulateScan}
          >
            {resultReady ? "Scan Complete" : (isScanning ? "Processing..." : "Verify ID Card")}
          </Button>
        </div>

        <div className={styles.resultCol}>
          <Card glass className={styles.resultCard}>
            <AnimatePresence mode="wait">
              {!resultReady && !isScanning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.emptyState}>
                  <UserCheck size={48} className={styles.emptyIcon} />
                  <p>Upload an ID card to see field-level comparison results.</p>
                </motion.div>
              )}

              {isScanning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.processingState}>
                  <QrCode size={40} className={styles.spinningIcon} />
                  <h4>Decoding Cryptographic Token</h4>
                  <p>Fetching ground truth from institution database...</p>
                </motion.div>
              )}

              {resultReady && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.resultData}>
                  <div className={styles.verdictHeader}>
                    <AlertTriangle size={32} className={styles.destructiveText} />
                    <div>
                      <h2 className={styles.destructiveText}>FRAUD DETECTED</h2>
                      <p>2 fields show signs of physical or digital tampering.</p>
                    </div>
                  </div>

                  <div className={styles.comparisonTable}>
                    <div className={styles.tableHeader}>
                      <div>Field</div>
                      <div>Ground Truth (QR)</div>
                      <div>Extracted (OCR)</div>
                      <div>Status</div>
                    </div>
                    
                    {MOCK_RESULTS.map((row, i) => (
                      <div key={i} className={styles.tableRow}>
                        <div className={styles.fieldLabel}>{row.field}</div>
                        <div className={styles.groundTruthText}>{row.groundTruth}</div>
                        <div className={cn(styles.ocrText, !row.match && styles.mismatchText)}>
                          {row.ocr}
                        </div>
                        <div className={styles.statusCell}>
                          {row.match ? (
                            <span className={styles.badgePass}>PASS</span>
                          ) : (
                            <span className={styles.badgeFail}>FAIL</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.technicalDetails}>
                    <h4>Token Analysis</h4>
                    <p>Signature: <span className={styles.successText}>Valid</span> (Signed by Univ_Key_B)</p>
                    <p>Replay Attack: <span className={styles.successText}>None detected</span></p>
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
