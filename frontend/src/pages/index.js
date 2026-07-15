import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Web-Based Intelligent Phishing Detection System
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Protect yourself from credential theft by scanning URLs and email content
        for phishing attacks. Real-time analysis with risk assessment powered by
        VirusTotal and intelligent heuristics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-10">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-semibold mb-2">URL Scanning</h3>
          <p className="text-sm text-gray-600">
            Analyze URLs for phishing indicators, suspicious patterns, and cross-reference with threat intelligence.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
          <div className="text-3xl mb-2">📧</div>
          <h3 className="font-semibold mb-2">Email Analysis</h3>
          <p className="text-sm text-gray-600">
            Scan email content for urgency tactics, credential requests, and embedded malicious links.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-500">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold mb-2">Dashboard & Reports</h3>
          <p className="text-sm text-gray-600">
            View scan history, risk distributions, and generate detailed security reports.
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <Link
          href="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
