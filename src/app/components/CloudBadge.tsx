"use client";

import { motion } from "framer-motion";

type Props = {
  provider: "aws" | "azure" | "gcp";   // 👈 Added GCP here
  size?: number;
  deployed?: number;
};

export default function CloudBadge({ provider, size = 56, deployed = 0 }: Props) {
  // Set label + color based on provider
  let label = "";
  let color = "";

  switch (provider) {
    case "aws":
      label = "AWS";
      color = "#FF9900";
      break;

    case "azure":
      label = "Azure";
      color = "#008AD9";
      break;

    case "gcp":
      label = "GCP";
      color = "#4285F4"; // Google Cloud primary blue
      break;
  }

  // Ring calculations
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.round((deployed / 6) * 100));

  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-center gap-3 p-3 rounded-lg border border-white/6 bg-white/2"
      title={`${label} — Deployed services: ${deployed}`}
    >
      <div style={{ width: size, height: size, position: "relative" }}>
        <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden>
          <circle
            cx="28"
            cy="28"
            r={radius}
            stroke="#ffffff20"
            strokeWidth="4"
            fill="transparent"
          />
          <motion.circle
            cx="28"
            cy="28"
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: (1 - pct / 100) * circumference }}
            transition={{ duration: 1 }}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        </svg>

        <div
          style={{ position: "absolute", inset: 0 }}
          className="flex items-center justify-center pointer-events-none"
        >
          <div className="text-xs font-semibold">{deployed}</div>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-xs text-white/60">Cloud • {deployed} deployed</div>
      </div>
    </motion.div>
  );
}
