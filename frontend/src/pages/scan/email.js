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
      const res = await axios.post("/api/scans/email", { content }, { headers: { Authorization: `Bearer ${token}` } });
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Scan Email Content</h1>
        <p className="text-gray-400 mt-1">Analyze email content for phishing attempts and suspicious patterns</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Paste email content</label>
        <textarea
          value={content} onChange={(e) => setContent(e.target.value)}
          rows={10} placeholder="Paste the full email content here including headers, body, and links..."
          className="input-modern w-full font-mono text-sm resize-none" required
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-gray-500">{content.length} characters</span>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Analyzing</span>
              </span>
            ) : "Analyze Email"}
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
              <svg className="animate-spin h-5 w-5 text-purple-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-gray-300">Analyzing email content for phishing indicators...</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Analysis Result</h2>
            <RiskBadge level={result.riskLevel} score={result.score} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Findings</p>
            <div className="space-y-2">
              {result.details?.reasons?.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {result.details?.urls?.length > 0 && (
            <div className="border-t border-white/5 pt-4">
              <p className="text-sm font-medium text-gray-300 mb-3">URLs Found ({result.details.urlCount})</p>
              <div className="space-y-2">
                {result.details.urls.map((u, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-3">
                    <p className="text-sm font-mono text-gray-200 break-all">{u.url}</p>
                    {u.reasons?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {u.reasons.map((r, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm ${
              result.details?.containsSensitiveRequests
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                result.details?.containsSensitiveRequests ? "bg-red-400" : "bg-green-400"
              }`}></span>
              {result.details?.containsSensitiveRequests ? "Sensitive data request detected" : "No sensitive data requests"}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm ${
              result.details?.urgencyPhrasesFound
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "bg-green-500/10 text-green-400 border border-green-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                result.details?.urgencyPhrasesFound ? "bg-yellow-400" : "bg-green-400"
              }`}></span>
              {result.details?.urgencyPhrasesFound ? "Urgency tactics detected" : "No urgency tactics"}
            </span>
          </div>

          <div className="text-xs text-gray-500 border-t border-white/5 pt-3">
            Scanned at: {new Date(result.scannedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
