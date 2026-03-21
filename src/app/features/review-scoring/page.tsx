"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquareWarning, Bot, MessageSquareOff, UserX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/BackButton";

export default function ReviewScoringPage() {
  const [reviewText, setReviewText] = useState("This product is absolutely amazing! I have never seen anything like it before in my entire life, it works perfectly and everyone should buy it right now!");
  const [reviewerEmail, setReviewerEmail] = useState("test_reviewer@example.com");
  const [reviewerPhone, setReviewerPhone] = useState("+1987654321");
  const [platformId, setPlatformId] = useState("shop_123");
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScore = async () => {
    if (!reviewText.trim()) return;
    setIsScoring(true);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/review/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review_text: reviewText,
          reviewer_email: reviewerEmail,
          reviewer_phone: reviewerPhone,
          platform_id: platformId
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        console.error("API error", data.error);
        setResult({ error: data.error });
      }
    } catch (error) {
      console.error("Fetch error", error);
      setResult({ error: "Network error" });
    } finally {
      setIsScoring(false);
    }
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <div className={styles.header}>
        <h1 className={styles.title}>Review Credibility Scoring</h1>
        <p className={styles.subtitle}>
          Analyze product reviews across three dimensions: AI Generation, Spam Rings, and global User Trust Score.
        </p>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.inputCol}>
          <Card glass className={styles.inputCard}>
            <div className={styles.cardHeader}>
              <MessageSquareWarning className={styles.cardIcon} />
              <h3>Evaluate Review</h3>
            </div>
            
            <div className={styles.formGroup}>
              <label>Reviewer Email</label>
              <input 
                type="email" 
                className={styles.input} 
                value={reviewerEmail} 
                onChange={(e) => setReviewerEmail(e.target.value)} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Reviewer Phone</label>
              <input 
                type="text" 
                className={styles.input} 
                value={reviewerPhone} 
                onChange={(e) => setReviewerPhone(e.target.value)} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Platform ID</label>
              <input 
                type="text" 
                className={styles.input} 
                value={platformId} 
                onChange={(e) => setPlatformId(e.target.value)} 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Review Content</label>
              <textarea 
                className={styles.textarea} 
                rows={6}
                value={reviewText}
                onChange={(e) => {
                  setReviewText(e.target.value);
                  setResult(null);
                }}
              />
            </div>

            <Button 
              className={styles.actionBtn}
              size="lg" 
              disabled={!reviewText.trim() || isScoring} 
              isLoading={isScoring}
              onClick={handleScore}
            >
              Calculate Credibility Score
            </Button>
          </Card>
        </div>

        <div className={styles.resultCol}>
          <Card glass className={styles.resultCard}>
            <AnimatePresence mode="wait">
              {!result && !isScoring && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.emptyState}>
                  <p>Submit a review to see the multi-dimensional credibility analysis.</p>
                </motion.div>
              )}

              {isScoring && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.processingState}>
                  <div className={styles.spinner} />
                  <h4>Running 3-Signal Pipeline</h4>
                  <p>Analyzing NLP syntax, checking spam heuristics, and querying Trust DB...</p>
                </motion.div>
              )}

              {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.resultData}>
                  <div className={styles.scoreBanner}>
                    <div className={styles.scoreCircleWrapper}>
                      <svg viewBox="0 0 36 36" className={styles.circularChart}>
                        <path className={styles.circleBg}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path className={cn(styles.circle, styles.circleLow)}
                          strokeDasharray={`${result.credibility_score}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className={styles.scoreTextOverlay}>
                        <span className={styles.scoreNumber}>{result.credibility_score}</span>
                      </div>
                    </div>
                    <div className={styles.scoreDetails}>
                      <span className={styles.scoreLabel}>CREDIBILITY SCORE</span>
                      <h2>{result.recommendation === "HIDE" ? "Low Credibility" : "High Credibility"}</h2>
                      <div className={styles.recommendationBadge}>
                        ACTION: {result.recommendation}
                      </div>
                    </div>
                  </div>

                  <div className={styles.signalsList}>
                    <div className={styles.signalCard}>
                      <div className={styles.signalIconWrapper}><Bot size={20} className={styles.iconFail} /></div>
                      <div className={styles.signalContent}>
                        <h4>AI Generation</h4>
                        <p>{result.ai_probability}% probability of LLM generation.</p>
                      </div>
                      <div className={cn(styles.signalVerdict, result.signals?.ai_detection?.result === "PASS" ? styles.badgePass : styles.badgeFail)}>
                        {result.signals?.ai_detection?.result || "FAIL"}
                      </div>
                    </div>

                    <div className={styles.signalCard}>
                      <div className={styles.signalIconWrapper}><MessageSquareOff size={20} className={result.signals?.spam_check?.result === "PASS" ? styles.iconPass : styles.iconFail} /></div>
                      <div className={styles.signalContent}>
                        <h4>Spam Heuristics</h4>
                        <p>Flags: {result.spam_flags?.length > 0 ? result.spam_flags.join(", ").replace(/_/g, " ") : "None detected"}</p>
                      </div>
                      <div className={cn(styles.signalVerdict, result.signals?.spam_check?.result === "PASS" ? styles.badgePass : styles.badgeFail)}>
                        {result.signals?.spam_check?.result || "FAIL"}
                      </div>
                    </div>

                    <div className={styles.signalCard}>
                      <div className={styles.signalIconWrapper}><UserX size={20} className={result.signals?.trust_score?.result === "PASS" ? styles.iconPass : styles.iconFail} /></div>
                      <div className={styles.signalContent}>
                        <h4>Global Trust Score</h4>
                        <p>Score: {result.reviewer_trust_score}/100 based on network history.</p>
                      </div>
                      <div className={cn(styles.signalVerdict, result.signals?.trust_score?.result === "PASS" ? styles.badgePass : styles.badgeFail)}>
                        {result.signals?.trust_score?.result || "FAIL"}
                      </div>
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
