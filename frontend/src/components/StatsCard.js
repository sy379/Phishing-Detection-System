import React from "react";

export default function StatsCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderLeftColor: color || "#3b82f6" }}>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
