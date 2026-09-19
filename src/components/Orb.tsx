"use client";

import { motion, useReducedMotion } from "motion/react";

export function Orb({ speaking = false, size = 300 }: { speaking?: boolean; size?: number }) {
  const reduced = useReducedMotion();
  const body = size * 0.86;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {speaking && !reduced && (
        <>
          <motion.span
            className="absolute rounded-full border border-accent/30"
            style={{ width: size * 1.14, height: size * 1.14 }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0.25, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute rounded-full border border-accent/20"
            style={{ width: size * 1.02, height: size * 1.02 }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </>
      )}
      <motion.div
        className="orb orb-drift"
        style={{ width: body, height: body }}
        animate={reduced ? undefined : { scale: speaking ? [1, 1.035, 1] : [1, 1.01, 1], rotate: [0, 2, -2, 0] }}
        transition={{ duration: speaking ? 2.2 : 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute h-4 w-4 rounded-full bg-accent-2"
        style={{ top: size * 0.26, right: size * 0.03 }}
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute h-2.5 w-2.5 rounded-full bg-accent-3"
        style={{ bottom: size * 0.24, left: size * 0.02 }}
        animate={reduced ? undefined : { y: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
