import React, { useEffect, useState } from 'react';
import image1 from "../../assets/image3.png";
import {
  FaUsers,
  FaChartPie,
  FaDatabase,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUserInfo({
          name: decoded.name || 'Admin',
          email: decoded.emailId || 'admin@example.com'
        });
      } catch (err) {
        console.error('Failed to decode admin token:', err);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        sessionStorage.removeItem('token');
        window.location.href = '/'; // Redirect to homepage
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold p-6 text-black">Admin Panel</h1>
          <nav className="px-4 space-y-3 text-gray-700">
            <div className="p-2 rounded-lg bg-gray-100 font-medium flex items-center gap-2">
              <FaChartPie />
              Create
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center gap-2">
              <FaUsers />
              Update
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center gap-2">
              <FaDatabase />
              Delete
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center gap-2">
              <FaUsers />
              Employees
            </div>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto bg-gray-50">
        {/* Top bar with user info and logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Admin</h2>
            <p className="text-sm text-gray-600">
              Monitor platform performance and manage data efficiently.
            </p>
          </div>

{userInfo.name && (
  <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-lg border border-gray-200">
    <img
      src={image1}
      alt="User Avatar"
      className="rounded-full w-12 h-12 border-2 border-blue-500"
    />
    <div className="flex flex-col justify-center">
      <p className="text-base font-semibold text-gray-800">{userInfo.name}</p>
      <p className="text-xs text-gray-500">{userInfo.email}</p>
    </div>
    <div
      className="ml-4 text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
      onClick={() => setShowLogoutConfirmation(true)}
      title="Sign Out"
    >
      <FaSignOutAlt size={20} />
    </div>
  </div>
)}

        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <SummaryCard title="Total Users" value="1,204" icon={<FaUsers />} />
          <SummaryCard title="Active Sessions" value="312" icon={<FaChartPie />} />
          <SummaryCard title="Database Size" value="1.4 GB" icon={<FaDatabase />} />
        </div>

        {/* Dashboard Factors */}
        <div className="grid grid-cols-2 gap-6">
          <Factor title="System Health" value="Good" trend="up" />
          <Factor title="Server Response Time" value="320ms" trend="down" highlight />
          <Factor title="Data Sync Rate" value="99.6%" trend="up" />
          <Factor title="Error Rate" value="0.8%" trend="down" highlight />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => {
                  handleLogout();
                  setShowLogoutConfirmation(false);
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={() => setShowLogoutConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Summary card component
const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
    <div className="text-2xl text-gray-500">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Factor card component
const Factor = ({ title, value, trend, highlight }) => {
  const color = highlight ? 'text-red-600' : 'text-gray-700';
  return (
    <div
      className={`bg-white p-4 rounded-xl shadow flex items-center justify-between ${
        highlight ? 'border-l-4 border-red-500' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-gray-400" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-gray-500">{value}</p>
        </div>
      </div>
      <div className={color}>
        {trend === 'up' ? <FaChevronUp /> : <FaChevronDown />}
      </div>
    </div>
  );
};

export default AdminDashboard;
