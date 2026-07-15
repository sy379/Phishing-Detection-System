import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import StatsCard from "../components/StatsCard";
import RiskBadge from "../components/RiskBadge";

export default function Dashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    fetchStats();
  }, [token]);

  async function fetchStats() {
    try {
      const res = await axios.get("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-red-400">Failed to load data. Please try again.</p>
        </div>
      </div>
    );
  }

  const riskColors = { SAFE: "#22c55e", LOW: "#eab308", MEDIUM: "#f97316", HIGH: "#ef4444", CRITICAL: "#7f1d1d" };

  const icons = {
    TOTAL: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    URL: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    EMAIL: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, <span className="text-white font-medium">{user?.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Scans" value={stats.totalScans} color="#3b82f6" icon={icons.TOTAL} />
        {Object.entries(stats.riskDistribution).map(([level, count]) => (
          <StatsCard key={level} title={`${level} Scans`} value={count} color={riskColors[level] || "#6b7280"} />
        ))}
        <StatsCard title="URL Scans" value={stats.typeBreakdown?.URL || 0} color="#8b5cf6" icon={icons.URL} />
        <StatsCard title="Email Scans" value={stats.typeBreakdown?.EMAIL || 0} color="#06b6d4" icon={icons.EMAIL} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Risk Distribution</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.riskDistribution).map(([level, count]) => (
              <div key={level} className="flex items-center space-x-2">
                <RiskBadge level={level} />
                <span className="text-sm text-gray-400">x{count}</span>
              </div>
            ))}
            {Object.keys(stats.riskDistribution).length === 0 && (
              <p className="text-gray-500 text-sm">No scans yet. Start by scanning a URL or email.</p>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/scan/url" className="flex items-center space-x-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-200">Scan URL</span>
            </a>
            <a href="/scan/email" className="flex items-center space-x-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-200">Scan Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold text-white mb-1">Recent Scans</h2>
          <p className="text-sm text-gray-400 mb-4">Latest scan activities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Type</th>
                <th>Input</th>
                <th>Risk</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentScans?.length > 0 ? (
                stats.recentScans.map((scan) => (
                  <tr key={scan.id}>
                    <td>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        scan.type === "URL"
                          ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}>
                        {scan.type}
                      </span>
                    </td>
                    <td className="max-w-xs truncate text-gray-300">{scan.input}</td>
                    <td><RiskBadge level={scan.riskLevel} score={scan.score} /></td>
                    <td className="text-gray-500">{new Date(scan.scannedAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="text-center text-gray-500 py-8">No scans yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
