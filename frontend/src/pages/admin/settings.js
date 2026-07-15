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
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Total Scans</div>
          <div className="text-2xl font-bold">{stats?.totalScans || 0}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Risk Distribution</div>
          <div className="text-lg font-bold">
            {stats?.riskDistribution ? Object.entries(stats.riskDistribution).map(([k, v]) => (
              <span key={k} className="mr-2">{k}: {v}</span>
            )) : "N/A"}
          </div>
        </div>
      </div>

      {stats?.scansByDay?.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Scans Per Day (Last 30 Days)</h2>
          <div className="space-y-1">
            {stats.scansByDay.map((d) => (
              <div key={d.date} className="flex items-center">
                <span className="text-sm text-gray-600 w-32">{new Date(d.date).toLocaleDateString()}</span>
                <div className="flex-1 bg-gray-100 rounded h-5">
                  <div
                    className="bg-blue-500 h-5 rounded"
                    style={{ width: `${Math.min((d.count / Math.max(...stats.scansByDay.map((x) => x.count))) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 ml-2 w-8">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
