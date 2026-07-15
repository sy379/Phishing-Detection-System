import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RiskBadge from "../../components/RiskBadge";

export default function ScanUrl() {
  const { token } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post("/api/scans/url", { url }, { headers: { Authorization: `Bearer ${token}` } });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Scan URL</h1>
        <p className="text-gray-400 mt-1">Analyze a URL for phishing indicators and threats</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Enter URL to scan</label>
        <div className="flex space-x-2">
          <input
            type="url" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com" className="input-modern flex-1" required
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Scanning</span>
              </span>
            ) : "Scan"}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center space-x-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </form>

      {loading && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="shimmer rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-gray-300">Analyzing URL with VirusTotal and heuristic engine...</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Scan Result</h2>
            <RiskBadge level={result.riskLevel} score={result.score} />
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Scanned URL</p>
            <p className="text-sm font-mono text-gray-200 break-all">{url}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Analysis Findings</p>
            <div className="space-y-2">
              {result.details?.reasons?.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {result.details?.virusTotal && (
            <div className="border-t border-white/5 pt-4">
              <p className="text-sm font-medium text-gray-300 mb-3">VirusTotal Results</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Malicious", count: result.details.virusTotal.malicious, color: "from-red-500/20 to-red-600/10", text: "text-red-400", border: "border-red-500/20" },
                  { label: "Suspicious", count: result.details.virusTotal.suspicious, color: "from-yellow-500/20 to-yellow-600/10", text: "text-yellow-400", border: "border-yellow-500/20" },
                  { label: "Harmless", count: result.details.virusTotal.harmless, color: "from-green-500/20 to-green-600/10", text: "text-green-400", border: "border-green-500/20" },
                  { label: "Undetected", count: result.details.virusTotal.undetected, color: "from-gray-500/20 to-gray-600/10", text: "text-gray-400", border: "border-gray-500/20" },
                ].map((v) => (
                  <div key={v.label} className={`bg-gradient-to-br ${v.color} rounded-xl p-3 text-center border ${v.border}`}>
                    <div className={`text-2xl font-bold ${v.text}`}>{v.count}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{v.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 border-t border-white/5 pt-3">
            Scanned at: {new Date(result.scannedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
