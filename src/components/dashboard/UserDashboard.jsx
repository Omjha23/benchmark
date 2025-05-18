
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaChartBar,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaInfinity,
  FaChartPie,
  FaUsers,
  FaExchangeAlt,
  FaSignOutAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import image2 from "../../assets/image2.png";


import Option1 from "../../pages/reports/Option1CurrentBillability";
import Option2 from "../../pages/reports/Option2UpcomingRolloff";
import Option3 from "../../pages/reports/Option3BenchSummary";
import Option4 from "../../pages/reports/Option4BenchAging";
import Option5 from "../../pages/reports/Option5SkillWise";
import Option6 from "../../pages/reports/Option6Utilization";
import Option7 from "../../pages/reports/Option7ManagerWiseBench";
import Option8 from "../../pages/reports/Option8BenchReallocationEfficiency";
import Option9 from "../../pages/reports/Option9AttritionFromBench";
import Option10 from "../../pages/reports/Option10ForecastedBenchLoad";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        setUser({
          name: decodedPayload.name || "User Name",
          email: decodedPayload.emailId || "user@example.com",
        });
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://benchmark-env.eba-6bdmiihw.ap-south-1.elasticbeanstalk.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        sessionStorage.removeItem("token");
        window.location.href = "/"; // Redirect to homepage
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const menuItems = [
    {
      label: "Current Billability",
      icon: <FaClipboardList />,
      route: "/dashboard/option1",
    },
    {
      label: "Upcoming Roll-off",
      icon: <FaChartBar />,
      route: "/dashboard/option2",
    },
    {
      label: "Bench Summary",
      icon: <FaClipboardList />,
      route: "/dashboard/option3",
    },
    { label: "Bench Aging", icon: <FaChartBar />, route: "/dashboard/option4" },
    {
      label: "Skill-wise Report",
      icon: <FaCheckCircle />,
      route: "/dashboard/option5",
    },
    {
      label: "Utilization Report",
      icon: <FaTachometerAlt />,
      route: "/dashboard/option6",
    },
    {
      label: "Manager-wise Bench Report",
      icon: <FaUsers />,
      route: "/dashboard/option7",
    },
    {
      label: "Bench Reallocation Efficiency",
      icon: <FaExchangeAlt />,
      route: "/dashboard/option8",
    },
    {
      label: "Attrition from Bench Report",
      icon: <FaSignOutAlt />,
      route: "/dashboard/option9",
    },
    {
      label: "Forecasted Bench Load",
      icon: <FaChartPie />,
      route: "/dashboard/option10",
    },
  ];

  const renderContent = () => {
    switch (location.pathname) {
      case "/dashboard/option1":
        return <Option1 />;
      case "/dashboard/option2":
        return <Option2 />;
      case "/dashboard/option3":
        return <Option3 />;
      case "/dashboard/option4":
        return <Option4 />;
      case "/dashboard/option5":
        return <Option5 />;
      case "/dashboard/option6":
        return <Option6 />;
      case "/dashboard/option7":
        return <Option7 />;
      case "/dashboard/option8":
        return <Option8 />;
      case "/dashboard/option9":
        return <Option9 />;
      case "/dashboard/option10":
        return <Option10 />;
      default:
        return (
          <main className="flex-1 overflow-y-auto bg-gray-50 ">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Insights - Survey Analysis
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Analyzing collaboration and teamwork effectiveness in the
              organization.
            </p>

            <div className="flex justify-between items-center bg-gray-200 rounded-xl p-6 mb-8">
              <div>
                <p className="text-sm text-gray-600">
                  Collaboration Survey Data
                </p>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <FaUser /> 95 team members
              </div>
              <div className="flex gap-2">
                <button className="bg-white px-4 py-1 rounded shadow text-sm hover:bg-gray-100">
                  Download
                </button>
                <button className="bg-white px-4 py-1 rounded shadow text-sm hover:bg-gray-100">
                  Invite
                </button>
              </div>
            </div>

            {/* Analytics Animation */}
            <div className="w-full h-[calc(100vh-200px)] flex justify-center items-center overflow-hidden bg-white">
              <DotLottieReact
                src="https://lottie.host/8b266e71-849b-4562-b5c3-d9ee724def01/XLJP12Ce2U.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </main>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white  flex flex-col justify-between">
        <div>
          <h1
            className="text-2xl font-bold p-6 text-black cursor-pointer hover:text-blue-600"
            onClick={() => navigate("/dashboard")}
          >
            User Dashboard
          </h1>
          <nav className="px-4 space-y-2 text-gray-700">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.route;
              return (
                <div
                  key={index}
                  onClick={() => navigate(item.route)}
                  className={`p-2 rounded-lg cursor-pointer flex items-center gap-2 font-medium 
                    ${
                      isActive ? "bg-gray-300 text-black" : "hover:bg-gray-200"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </div>
              );
            })}
          </nav>

          {/* Teams Section */}
          <div className="mt-6 px-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Teams</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="cursor-pointer hover:text-black">Strategies</li>
              <li className="cursor-pointer hover:text-black">Aesthetics</li>
              <li className="cursor-pointer hover:text-black">Safety</li>
              <li className="cursor-pointer hover:text-black">Procedures</li>
            </ul>
          </div>
        </div>

        {/* User Section */}
        <div className="p-2 mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center gap-1 w-57">
          <img
            src={image2}
            alt="profile"
            className="rounded-full w-12 h-12 border-2 border-blue-500"
          />
          <div className="flex flex-col justify-center">
            <p className="text-base font-semibold text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div
            className="ml-4 text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
            onClick={() => setShowModal(true)}
            title="Sign Out"
          >
            <FaSignOutAlt size={20} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto bg-gray-50">
        {renderContent()}
      </main>

      {/* Sign Out Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-center text-gray-800">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-around mt-4">
              <button
                className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600"
                onClick={handleSignOut}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
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

export default UserDashboard;
