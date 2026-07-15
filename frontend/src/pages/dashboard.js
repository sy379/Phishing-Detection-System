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

  if (loading) return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  if (!stats) return <div className="text-center py-10 text-red-500">Failed to load data</div>;

  const riskColors = { SAFE: "#22c55e", LOW: "#eab308", MEDIUM: "#f97316", HIGH: "#ef4444", CRITICAL: "#7f1d1d" };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome back, <span className="font-semibold">{user?.name}</span></p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Scans" value={stats.totalScans} color="#3b82f6" />
        {Object.entries(stats.riskDistribution).map(([level, count]) => (
          <StatsCard
            key={level}
            title={`${level} Scans`}
            value={count}
            color={riskColors[level] || "#6b7280"}
          />
        ))}
        <StatsCard
          title="URL Scans"
          value={stats.typeBreakdown?.URL || 0}
          color="#8b5cf6"
        />
        <StatsCard
          title="Email Scans"
          value={stats.typeBreakdown?.EMAIL || 0}
          color="#06b6d4"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Risk Distribution</h2>
      <div className="flex space-x-3 mb-8">
        {Object.entries(stats.riskDistribution).map(([level, count]) => (
          <div key={level} className="flex items-center space-x-1">
            <RiskBadge level={level} />
            <span className="text-sm text-gray-500">x{count}</span>
          </div>
        ))}
        {Object.keys(stats.riskDistribution).length === 0 && (
          <p className="text-gray-400 text-sm">No scans yet. Start by scanning a URL or email.</p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Input</th>
              <th className="text-left px-4 py-3 font-medium">Risk</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {stats.recentScans?.length > 0 ? (
              stats.recentScans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      scan.type === "URL" ? "bg-purple-100 text-purple-700" : "bg-cyan-100 text-cyan-700"
                    }`}>
                      {scan.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{scan.input}</td>
                  <td className="px-4 py-3"><RiskBadge level={scan.riskLevel} score={scan.score} /></td>
                  <td className="px-4 py-3 text-gray-500">{new Date(scan.scannedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No scans yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
