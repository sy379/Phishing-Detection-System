import React from "react";

const config = {
  SAFE:    { cls: "risk-safe",    glow: "shadow-green-500/20" },
  LOW:     { cls: "risk-low",     glow: "shadow-yellow-500/20" },
  MEDIUM:  { cls: "risk-medium",  glow: "shadow-orange-500/20" },
  HIGH:    { cls: "risk-high",    glow: "shadow-red-500/20" },
  CRITICAL:{ cls: "risk-critical",glow: "shadow-red-700/30" },
};

export default function RiskBadge({ level, score }) {
  const c = config[level] || { cls: "", glow: "" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${c.cls} ${c.glow}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        level === "SAFE" ? "bg-green-400" :
        level === "LOW" ? "bg-yellow-400" :
        level === "MEDIUM" ? "bg-orange-400" :
        level === "HIGH" ? "bg-red-400" : "bg-red-300"
      }`}></span>
      {level}
      {score !== undefined && <span className="ml-1 opacity-70">({score})</span>}
    </span>
  );
}
