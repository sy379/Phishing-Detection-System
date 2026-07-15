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
      <h1 className="text-2xl font-bold mb-6">Scan History</h1>

      <div className="flex space-x-3 mb-4">
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Types</option>
          <option value="URL">URL</option>
          <option value="EMAIL">Email</option>
        </select>
        <select value={riskFilter} onChange={(e) => { setRiskFilter(e.target.value); setPage(1); }}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Risk Levels</option>
          <option value="SAFE">Safe</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

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
            {data?.scans?.length > 0 ? (
              data.scans.map((scan) => (
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
              <tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No scans found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-500">
            Page {page} of {data.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
