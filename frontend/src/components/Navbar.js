import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const navLinks = [];
  if (user) {
    navLinks.push(
      { href: "/dashboard", label: "Dashboard" },
      { href: "/scan/url", label: "Scan URL" },
      { href: "/scan/email", label: "Scan Email" },
      { href: "/history", label: "History" }
    );
    if (user.role === "ADMIN") {
      navLinks.push(
        { href: "/admin/users", label: "Users" },
        { href: "/admin/scans", label: "All Scans" }
      );
    }
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-700">
              PhishDetect
            </Link>
            {user && (
              <div className="hidden md:flex ml-10 space-x-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-2 rounded text-sm font-medium ${
                      router.pathname === l.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden md:inline">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  href="/login"
                  className="text-blue-600 px-3 py-1.5 rounded text-sm hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}

            <button onClick={() => setOpen(!open)} className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {open && user && (
          <div className="md:hidden pb-3 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded text-sm ${
                  router.pathname === l.href ? "bg-blue-100" : "text-gray-600"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
