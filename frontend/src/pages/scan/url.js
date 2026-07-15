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
      const res = await axios.post(
        "/api/scans/url",
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scan URL</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Enter URL to scan</label>
        <div className="flex space-x-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>
        {error && <div className="mt-3 bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      </form>

      {loading && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Analyzing URL with VirusTotal and heuristic engine...
        </div>
      )}

      {result && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scan Result</h2>
            <RiskBadge level={result.riskLevel} score={result.score} />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Scanned URL:</p>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">{url}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Reasons:</p>
            <ul className="list-disc pl-5 space-y-1">
              {result.details?.reasons?.map((r, i) => (
                <li key={i} className="text-sm text-gray-700">{r}</li>
              ))}
            </ul>
          </div>

          {result.details?.virusTotal && (
            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">VirusTotal Results</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-lg font-bold text-red-600">{result.details.virusTotal.malicious}</div>
                  <div className="text-xs text-gray-500">Malicious</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <div className="text-lg font-bold text-yellow-600">{result.details.virusTotal.suspicious}</div>
                  <div className="text-xs text-gray-500">Suspicious</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-lg font-bold text-green-600">{result.details.virusTotal.harmless}</div>
                  <div className="text-xs text-gray-500">Harmless</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-lg font-bold text-gray-600">{result.details.virusTotal.undetected}</div>
                  <div className="text-xs text-gray-500">Undetected</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-400">
            Scanned at: {new Date(result.scannedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
