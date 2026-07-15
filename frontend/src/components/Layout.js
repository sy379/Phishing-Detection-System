import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6 max-w-7xl mx-auto">
        {children}
      </main>
      <footer className="relative border-t border-white/5 py-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent"></div>
        <p className="relative text-sm text-gray-500">
          PhishDetect &mdash; Intelligent Phishing Detection System
        </p>
      </footer>
    </div>
  );
}
