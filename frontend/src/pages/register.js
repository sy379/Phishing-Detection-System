import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/register", { name, email, password });
      login(res.data.token, res.data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
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
            minLength={6}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Register
        </button>
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
