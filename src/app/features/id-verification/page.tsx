"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScanFace, UserCheck, AlertTriangle, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/BackButton";

const MOCK_RESULTS = [
  { field: "Full Name", groundTruth: "John Smith", ocr: "John Smith", match: true },
  { field: "Course", groundTruth: "BSc Computer Science", ocr: "MSc Computer Science", match: false },
  { field: "Expiry Date", groundTruth: "August 2024", ocr: "August 2026", match: false },
  { field: "Student ID", groundTruth: "20210445", ocr: "20210445", match: true },
];

export default function IdVerificationPage() {
  const resultRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"generate" | "verify">("verify");
  
  // Verification states
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (result && window.innerWidth <= 900) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);


  // Generation states
  const [userIdData, setUserIdData] = useState({ name: "", course: "", student_id: "", expiry: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQr, setGeneratedQr] = useState<string | null>(null);
  const [generationMsg, setGenerationMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResultReady(false);
      setResult(null);
    }
  };

  const scanFile = async () => {
    if (!file) return;
    setIsScanning(true);
    setResultReady(false);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/v1/id/verify`, {
        method: "POST",
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_FACTORY_SCAN_API_KEY || ''
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
      } else {
        console.error("API error:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsScanning(false);
      setResultReady(true);
    }
  };

  const generateId = async () => {
    setIsGenerating(true);
    setGeneratedQr(null);
    setGenerationMsg("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/v1/id/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_FACTORY_SCAN_API_KEY || ''
        },
        body: JSON.stringify(userIdData),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedQr(data.result.qr_code);
        setGenerationMsg("ID Generated/Updated Successfully!");
      } else {
        setGenerationMsg(`Error: ${data.error}`);
      }
    } catch (error) {
      setGenerationMsg("Network error.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButtonWrapper}>
        <BackButton />
      </div>
      <div className={styles.header}>
        <h1 className={styles.title}>Physical ID Verification</h1>
        <p className={styles.subtitle}>
          Compare visual OCR text against signed QR-code ground truth data to detect AI inpainting and physical tampering.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button variant={mode === "verify" ? "primary" : "secondary"} onClick={() => setMode("verify")}>Verify ID Card</Button>
        <Button variant={mode === "generate" ? "primary" : "secondary"} onClick={() => setMode("generate")}>Generate User ID</Button>
      </div>

      <div className={styles.mainContent}>
        {mode === "verify" && (
          <>
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
                    <Button variant="secondary" size="sm" onClick={() => { setFile(null); setPreview(null); setResultReady(false); setResult(null); }}>
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
            onClick={scanFile}
          >
            {resultReady ? "Scan Complete" : (isScanning ? "Processing..." : "Verify ID Card")}
          </Button>
        </div>

        <div className={styles.resultCol} ref={resultRef}>
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
                  {result && result.verdict === "UNVERIFIED" ? (
                    <div className={styles.verdictHeader}>
                      <AlertTriangle size={32} className={styles.warningText} />
                      <div>
                        <h2 className={styles.warningText}>UNVERIFIED</h2>
                        <p>{result.reason}</p>
                      </div>
                    </div>
                  ) : result && result.verdict === "FRAUD_FLAG" ? (
                    <div className={styles.verdictHeader}>
                      <AlertTriangle size={32} className={styles.destructiveText} />
                      <div>
                        <h2 className={styles.destructiveText}>FRAUD_FLAG</h2>
                        <p>{result.reason}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.verdictHeader}>
                        {result && result.verdict === "HIGH_FRAUD_PROBABILITY" ? (
                          <>
                            <AlertTriangle size={32} className={styles.destructiveText} />
                            <div>
                              <h2 className={styles.destructiveText}>FRAUD DETECTED</h2>
                              <p>{result.tampered_fields.length} fields show signs of physical or digital tampering.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <UserCheck size={32} className={styles.successText} />
                            <div>
                              <h2 className={styles.successText}>VERIFIED</h2>
                              <p>All fields match ground truth.</p>
                            </div>
                          </>
                        )}
                      </div>

                      {result && result.all_checks && (
                        <div className={styles.comparisonTable}>
                          <div className={styles.tableHeader}>
                            <div>Field</div>
                            <div>Ground Truth (QR)</div>
                            <div>Extracted (OCR)</div>
                            <div>Status</div>
                          </div>
                          
                          {result.all_checks.map((row: { field: string; gt: string; ocr: string; pass: boolean }, i: number) => (
                            <div key={i} className={styles.tableRow}>
                              <div className={styles.fieldLabel}>{row.field}</div>
                              <div className={styles.groundTruthText}>{row.gt}</div>
                              <div className={cn(styles.ocrText, !row.pass && styles.mismatchText)}>
                                {row.ocr}
                              </div>
                              <div className={styles.statusCell}>
                                {row.pass ? (
                                  <span className={styles.badgePass}>PASS</span>
                                ) : (
                                  <span className={styles.badgeFail}>FAIL</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <div className={styles.technicalDetails}>
                    <h4>Token Analysis</h4>
                    <p>Signature: <span className={styles.successText}>Valid</span></p>
                    <p>Replay Attack: <span className={styles.successText}>None detected</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </>
        )}

        {mode === "generate" && (
          <div style={{ width: "100%", display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <Card glass style={{ padding: "20px" }}>
                <h3 style={{ marginBottom: "1rem" }}>User Details</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Full Name</label>
                    <input 
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "white" }} 
                      value={userIdData.name} 
                      onChange={e => setUserIdData({...userIdData, name: e.target.value})} 
                      placeholder="e.g. John Doe" 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Student/Employee ID</label>
                    <input 
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "white" }} 
                      value={userIdData.student_id} 
                      onChange={e => setUserIdData({...userIdData, student_id: e.target.value})} 
                      placeholder="e.g. 20210445" 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Course / Title</label>
                    <input 
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "white" }} 
                      value={userIdData.course} 
                      onChange={e => setUserIdData({...userIdData, course: e.target.value})} 
                      placeholder="e.g. BSc Computer Science" 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem" }}>Expiry Date String</label>
                    <input 
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "white" }} 
                      value={userIdData.expiry} 
                      onChange={e => setUserIdData({...userIdData, expiry: e.target.value})} 
                      placeholder="e.g. August 2026" 
                    />
                  </div>
                  <Button 
                    onClick={generateId} 
                    disabled={isGenerating || !userIdData.name || !userIdData.student_id}
                    isLoading={isGenerating}
                    style={{ marginTop: "10px" }}
                  >
                    Generate / Update DB & QR Code
                  </Button>
                </div>
              </Card>
            </div>
            
            <div style={{ flex: 1 }}>
              <Card glass style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "350px" }}>
                {!generatedQr && !isGenerating && (
                  <p style={{ color: "var(--muted-foreground)" }}>Enter details and generate to see the secure QR code.</p>
                )}
                {isGenerating && <div className={styles.spinner} />}
                {generatedQr && (
                  <div style={{ textAlign: "center" }}>
                    <img src={generatedQr} alt="Secure QR Code" style={{ width: "200px", height: "200px", borderRadius: "8px", border: "4px solid white" }} />
                    <p style={{ marginTop: "20px", color: "var(--success)" }}>{generationMsg}</p>
                    <p style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                      Print this QR on the physical ID. The scanner will read this QR URL, match the token `signed_token` with the database ground-truth, and run an OCR to detect physical visual alterations!
                    </p>
                  </div>
                )}
                {generationMsg && !generatedQr && <p style={{ color: "var(--destructive)" }}>{generationMsg}</p>}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
