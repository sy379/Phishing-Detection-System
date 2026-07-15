import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import RiskBadge from "../../components/RiskBadge";

export default function ScanEmail() {
  const { token } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState("");
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
        "/api/scans/email",
        { content },
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
      <h1 className="text-2xl font-bold mb-6">Scan Email Content</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Paste email content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="Paste the full email content here including headers, body, and links..."
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          required
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-400">{content.length} characters</span>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Email"}
          </button>
        </div>
        {error && <div className="mt-3 bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      </form>

      {loading && (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Analyzing email content for phishing indicators...
        </div>
      )}

      {result && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Analysis Result</h2>
            <RiskBadge level={result.riskLevel} score={result.score} />
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Findings:</p>
            <ul className="list-disc pl-5 space-y-1">
              {result.details?.reasons?.map((r, i) => (
                <li key={i} className="text-sm text-gray-700">{r}</li>
              ))}
            </ul>
          </div>

          {result.details?.urls?.length > 0 && (
            <div className="border-t pt-3">
              <p className="text-sm font-semibold mb-2">URLs Found in Email ({result.details.urlCount})</p>
              <div className="space-y-2">
                {result.details.urls.map((u, i) => (
                  <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-mono break-all">{u.url}</p>
                    {u.reasons?.length > 0 && (
                      <p className="text-red-600 mt-1">Issues: {u.reasons.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4 text-sm">
            <span className={`px-2 py-1 rounded ${result.details?.containsSensitiveRequests ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {result.details?.containsSensitiveRequests ? "Requests sensitive data detected" : "No sensitive data requests"}
            </span>
            <span className={`px-2 py-1 rounded ${result.details?.urgencyPhrasesFound ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
              {result.details?.urgencyPhrasesFound ? "Urgency tactics detected" : "No urgency tactics"}
            </span>
          </div>

          <div className="text-xs text-gray-400">
            Scanned at: {new Date(result.scannedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
