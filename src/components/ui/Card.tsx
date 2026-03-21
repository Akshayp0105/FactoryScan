"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import styles from "./Card.module.css";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
  children?: React.ReactNode;
  hoverEffect?: boolean;
  glowColor?: string;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glass = true, glowColor, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(styles.card, glass && styles.glass, hoverEffect && styles.hoverEffect, className)}
        whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : {}}
        style={glowColor ? { "--glow": glowColor } as React.CSSProperties : undefined}
        {...props}
      >
        <div className={styles.inner}>{children}</div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";
