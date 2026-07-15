import React from "react";
import Link from "next/link";

const features = [
  {
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    title: "URL Scanning",
    desc: "Analyze URLs for phishing indicators, suspicious patterns, and cross-reference with VirusTotal threat intelligence.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "Email Analysis",
    desc: "Scan email content for urgency tactics, credential requests, and embedded malicious links.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "Dashboard & Reports",
    desc: "View scan history, risk distributions, and generate detailed security reports.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const stats = [
  { value: "Real-time", label: "Analysis" },
  { value: "AI-Powered", label: "Detection" },
  { value: "VT-Enabled", label: "Threat Intel" },
];

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>
      <div className="absolute inset-0 bg-radial-purple pointer-events-none"></div>

      <div className="relative pt-16 pb-24 text-center">
        <div className="animate-float">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
            Next-Gen Phishing Protection
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent glow-text">
            Intelligent Phishing
          </span>
          <br />
          <span className="text-white">Detection System</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Protect yourself from credential theft by scanning URLs and email content
          for phishing attacks. Real-time analysis with risk assessment powered by
          VirusTotal and intelligent heuristics.
        </p>

        <div className="flex items-center justify-center space-x-4">
          <Link href="/register" className="btn-primary text-lg px-8 py-3.5">
            Get Started Free
          </Link>
          <Link href="/login" className="btn-secondary text-lg px-8 py-3.5">
            Sign In
          </Link>
        </div>

        <div className="flex items-center justify-center space-x-10 mt-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-16">
        {features.map((f, i) => (
          <div key={i} className="card-3d">
            <div className="card-3d-inner glass rounded-2xl p-6 h-full">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
