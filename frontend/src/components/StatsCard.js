import React from "react";

export default function StatsCard({ title, value, color = "#3b82f6", icon }) {
  return (
    <div className="card-3d">
      <div className="card-3d-inner glass rounded-2xl p-5 glow-sm h-full">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</div>
            <div className="text-3xl font-bold mt-2" style={{ color }}>{value}</div>
          </div>
          {icon && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}></div>
      </div>
    </div>
  );
}
