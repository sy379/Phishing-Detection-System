import React from "react";

const styles = {
  SAFE: "bg-green-100 text-green-800 border-green-300",
  LOW: "bg-yellow-100 text-yellow-800 border-yellow-300",
  MEDIUM: "bg-orange-100 text-orange-800 border-orange-300",
  HIGH: "bg-red-100 text-red-800 border-red-300",
  CRITICAL: "bg-red-900 text-red-100 border-red-700",
};

export default function RiskBadge({ level, score }) {
  const cls = styles[level] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${cls}`}>
      {level}
      {score !== undefined && <span className="ml-1.5 opacity-75">({score}%)</span>}
    </span>
  );
}
