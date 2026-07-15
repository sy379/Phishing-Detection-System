import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Sign In
        </button>
        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
}
