"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

/** Scroll-triggered fade + rise. Used across the page for a consistent rhythm. */
export function Reveal({ children, delay = 0, y = 26, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type SectionHeadingProps = {
  tag: string;
  title: string;
  description?: string;
};

export function SectionHeading({ tag, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10">
      <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-cyber-tan">
        {`// ${tag}`}
      </span>
      <h2 className="mt-3 font-heading text-xl leading-relaxed uppercase md:text-2xl">{title}</h2>
      {description && (
        <p className="mt-4 max-w-2xl font-mono text-[12px] leading-relaxed text-cyber-gray">
          {description}
        </p>
      )}
    </Reveal>
  );
}
