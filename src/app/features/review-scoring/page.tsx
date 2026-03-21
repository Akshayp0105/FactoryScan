"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MessageSquareWarning, Bot, MessageSquareOff, UserX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ReviewScoringPage() {
  const [reviewText, setReviewText] = useState("This product is absolutely amazing! I have never seen anything like it before in my entire life, it works perfectly and everyone should buy it right now!");
  const [isScoring, setIsScoring] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScore = () => {
    if (!reviewText.trim()) return;
    setIsScoring(true);
    
    setTimeout(() => {
      setIsScoring(false);
      setResult({
        credibility_score: 31,
        recommendation: "HIDE",
        ai_probability: 87,
        spam_flags: ["generic_superlatives", "no_personal_detail", "extreme_sentiment"],
        reviewer_trust_score: 28,
        signals: {
          ai_detection: { result: "FAIL", probability: 87 },
          spam_check: { result: "FAIL", flags: 3 },
          trust_score: { result: "FAIL", score: 28 }
        }
      });
    }, 1500);
  };

  return (
    <div className={styles.container}>
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
              <label>Reviewer ID</label>
              <input type="text" className={styles.input} defaultValue="usr_abc123" disabled />
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
                      <div className={styles.signalVerdict}>FAIL</div>
                    </div>

                    <div className={styles.signalCard}>
                      <div className={styles.signalIconWrapper}><MessageSquareOff size={20} className={styles.iconFail} /></div>
                      <div className={styles.signalContent}>
                        <h4>Spam Heuristics</h4>
                        <p>Flags: {result.spam_flags.join(", ").replace(/_/g, " ")}</p>
                      </div>
                      <div className={styles.signalVerdict}>FAIL</div>
                    </div>

                    <div className={styles.signalCard}>
                      <div className={styles.signalIconWrapper}><UserX size={20} className={styles.iconFail} /></div>
                      <div className={styles.signalContent}>
                        <h4>Global Trust Score</h4>
                        <p>User score is {result.reviewer_trust_score}/100. Prior fraud history detected.</p>
                      </div>
                      <div className={styles.signalVerdict}>FAIL</div>
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
