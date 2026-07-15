import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        Web-Based Intelligent Phishing Detection System
      </footer>
    </div>
  );
}
