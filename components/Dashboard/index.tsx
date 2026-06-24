
'use client';

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Dashboardcomponent = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-semibold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome, <span className="text-blue-600">{session?.user?.name || 'User'}</span>!
          </h2>
          <p className="text-gray-600">
            Email: <span className="font-medium">{session?.user?.email || 'N/A'}</span>
          </p>
          <p className="text-gray-600 mt-1">You are logged in successfully to your account.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
              </div>
              <div className="text-4xl text-blue-200">👥</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Sessions</p>
                <p className="text-3xl font-bold text-green-600 mt-2">56</p>
              </div>
              <div className="text-4xl text-green-200">✓</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Last Login</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">Today</p>
              </div>
              <div className="text-4xl text-purple-200">📅</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition">
              View Profile
            </button>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition">
              Settings
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition">
              Generate Report
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition">
              Help & Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardcomponent;

