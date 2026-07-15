import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token]);

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-3xl font-bold shadow-lg shadow-blue-500/25 mb-4">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Name</p>
            <p className="text-white font-medium mt-0.5">{user.name}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
            <p className="text-white font-medium mt-0.5">{user.email}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Role</p>
            <p className="text-white font-medium mt-0.5">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Member Since</p>
            <p className="text-white font-medium mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
