import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminSettings() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    if (user && user.role !== "ADMIN") { router.push("/dashboard"); return; }
    if (user) fetchStats();
  }, [user, token]);

  async function fetchStats() {
    try {
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Admin Settings</h1>
        <p className="text-gray-400 mt-1">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Users</div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-400">{stats?.totalUsers || 0}</div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Scans</div>
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-400">{stats?.totalScans || 0}</div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Distribution</div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {stats?.riskDistribution ? (
              Object.entries(stats.riskDistribution).map(([k, v]) => (
                <span key={k} className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                  {k}: {v}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">N/A</span>
            )}
          </div>
        </div>
      </div>

      {stats?.scansByDay?.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Scans Per Day (Last 30 Days)</h2>
          <div className="space-y-2">
            {stats.scansByDay.map((d) => {
              const maxCount = Math.max(...stats.scansByDay.map((x) => x.count));
              const pct = Math.min((d.count / maxCount) * 100, 100);
              return (
                <div key={d.date} className="flex items-center">
                  <span className="text-sm text-gray-400 w-32 shrink-0">{new Date(d.date).toLocaleDateString()}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-sm text-gray-400 ml-3 w-8 text-right">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
