import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RiskBadge from "../components/RiskBadge";

export default function History() {
  const { token } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const limit = 20;

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    fetchScans();
  }, [token, page, typeFilter, riskFilter]);

  async function fetchScans() {
    try {
      const params = new URLSearchParams({ page, limit });
      if (typeFilter) params.set("type", typeFilter);
      if (riskFilter) params.set("riskLevel", riskFilter);
      const res = await axios.get(`/api/scans?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch scans:", err);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Scan History</h1>
        <p className="text-gray-400 mt-1">View all your scan activities</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="select-modern">
          <option value="">All Types</option>
          <option value="URL">URL</option>
          <option value="EMAIL">Email</option>
        </select>
        <select value={riskFilter} onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }} className="select-modern">
          <option value="">All Risk Levels</option>
          <option value="SAFE">Safe</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
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
              {data?.scans?.length > 0 ? (
                data.scans.map((scan) => (
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
                <tr><td colSpan={4} className="text-center text-gray-500 py-8">No scans found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4 mt-6">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              page === 1 ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}>
            Previous
          </button>
          <span className="text-sm text-gray-400">Page {page} of {data.totalPages}</span>
          <button onClick={() => setPage(Math.min(data.totalPages, page + 1))} disabled={page === data.totalPages}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              page === data.totalPages ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
