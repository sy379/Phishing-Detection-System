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
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-500">Name</label>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Role</label>
          <p className="font-medium">{user.role}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Member Since</label>
          <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
