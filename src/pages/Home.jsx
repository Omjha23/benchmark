import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import user1 from "../assets/image1.png";
import user2 from "../assets/image2.png";
import user3 from "../assets/image3.png";
import {
  FaFacebookF,
  FaInstagram,
  FaBlogger,
  FaChartLine,
  FaChartPie,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AiFillHome } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const TiltCard = ({ children }) => (
  <motion.div
    whileHover={{ rotateX: 10, rotateY: -10 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="p-6 rounded-xl shadow cursor-pointer bg-amber-600 text-white hover:shadow-2xl"
  >
    {children}
  </motion.div>
);

const WhiteTiltCard = ({ children }) => (
  <motion.div
    whileHover={{ rotateX: 10, rotateY: -10 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="p-6 rounded-xl shadow cursor-pointer bg-white text-gray-800 hover:shadow-2xl"
  >
    {children}
  </motion.div>
);

const Home = () => {
  const helpRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const handleDashboardClick = () => {
    navigate(isLoggedIn ? "/dashboard" : "/login");
  };

  const scrollToHelp = () => {
    helpRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinkClass = `
    relative inline-block text-gray-700 hover:text-black transition-colors duration-200
    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5
    after:bg-orange-500 after:w-0 hover:after:w-full after:transition-all after:duration-300
  `;

  const authButtonClass = `
    bg-gray-100 px-4 py-1 text-sm rounded-full shadow-sm 
    hover:bg-gray-300 transition-colors duration-200
  `;

  return (
    <div className="font-sans bg-white min-h-screen w-screen">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
        <div
          className="flex items-center gap-2 font-bold text-xl text-black cursor-pointer"
          onClick={() =>
            window.open("https://www.nousinfosystems.com/", "_blank")
          }
        >
          <AiFillHome className="text-2xl" />
          NOUS INFOSYSTEMS
        </div>

        <nav className="hidden md:flex gap-6 text-sm">
          <div
            onClick={handleDashboardClick}
            className="relative group px-1 pb-1 text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer"
          >
            Dashboard
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-500 transition-all duration-300 group-hover:w-full group-hover:h-[4px]"></span>
          </div>

          <div className={navLinkClass}>Features</div>

          <div
            onClick={scrollToHelp}
            className="relative group px-1 pb-1 text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer"
          >
            Help
            <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-orange-500 transition-all duration-300 group-hover:w-full group-hover:h-[4px]"></span>
          </div>

          <div
            onClick={() =>
              window.open("https://www.nousinfosystems.com/company", "_blank")
            }
            className={navLinkClass}
          >
            About us
          </div>
        </nav>

        <div className="flex gap-2">
          {isLoggedIn ? (
            <button onClick={logout} className={authButtonClass}>
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={authButtonClass}
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={authButtonClass}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-orange-100 rounded-b-3xl p-10 flex flex-col md:flex-row justify-between items-center">
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track your progress and analyze data effectively
          </h1>
          <p className="text-gray-700 mb-6">
            Access tools for performance tracking and secure data analysis
          </p>
          <div className="flex gap-4">
            <button className={`${authButtonClass} px-5 py-2`}>Explore</button>
            <button className={`${authButtonClass} px-5 py-2`}>
              Watch demo
            </button>
          </div>
          <div className="w-38 h-40 mt-10 md:mt-0">
            <DotLottieReact
              src="https://lottie.host/9a839e8f-fbf3-4e82-a630-09e28d53edee/gInct4Ttup.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        <div className="text-7xl text-black mt-10 md:mt-0 mr-12">
          <FaChartLine />
        </div>
      </section>

      {/* Tilt Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6">
        <TiltCard>
          <p className="text-sm mb-2">Engaged users</p>
          <div className="text-2xl font-bold mb-2">10K+</div>
          <div className="flex -space-x-2 overflow-hidden">
            <img className="w-8 h-8 rounded-full" src={user1} alt="User1" />
            <img className="w-8 h-8 rounded-full" src={user2} alt="User2" />
            <img className="w-8 h-8 rounded-full" src={user3} alt="User3" />
          </div>
        </TiltCard>

        <TiltCard>
          <p className="text-sm mb-2">Data insights</p>
          <div className="text-2xl font-bold mb-2">50TB+</div>
          <FaChartPie className="text-3xl" />
        </TiltCard>

        <TiltCard>
          <p className="text-sm mb-2">Data analyzed</p>
          <div className="text-2xl font-bold mb-2">100M+</div>
          <FaCloudDownloadAlt className="text-3xl" />
        </TiltCard>

        <WhiteTiltCard>
          <p className="text-sm text-gray-600 mb-2">Upgrade now</p>
          <div className="text-xl font-semibold text-gray-800">Live Demo →</div>
        </WhiteTiltCard>
      </section>

      {/* Help Section with Scroll Snap */}
      <section ref={helpRef} className="p-10 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6 text-amber-600">
          Need Assistance?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Whether you're stuck, curious, or just exploring, our support tools
          and team are ready to help you make the most of Benchmark App.
        </p>

        <div className="overflow-x-auto flex justify-center gap-4 pb-4 px-2 snap-x scroll-smooth">
          <div className="flex gap-4 w-max">
            {[
              {
                title: "Getting Started",
                desc: "Learn how to create your first dataset and navigate the dashboard.",
                color: "bg-white",
              },
              {
                title: "Upload Errors",
                desc: "Troubleshoot common issues with file uploads and formats.",
                color: "bg-orange-100",
              },
              {
                title: "Data Privacy",
                desc: "Understand how we keep your data safe and secure.",
                color: "bg-white",
              },
              {
                title: "Live Chat",
                desc: "Chat with our support team in real time for instant help.",
                color: "bg-orange-100",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`${item.color} flex-shrink-0 snap-center w-72 p-6 rounded-xl shadow text-left`}
              >
                <h3 className="text-lg font-semibold mb-2 text-amber-700">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Community Forum",
              desc: "Join discussions and share insights with fellow users.",
              icon: "📢",
            },
            {
              title: "Video Tutorials",
              desc: "Watch step-by-step guides to master the app.",
              icon: "🎥",
            },
            {
              title: "System Status",
              desc: "Check the current status of our services.",
              icon: "⚙️",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow text-center"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-amber-700">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
            Visit FAQ
          </button>
          <button className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg hover:bg-amber-50 transition">
            Contact Support
          </button>
        </div>
      </section>

      {/* Why Benchmark Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-2xl font-bold mb-4">Why Choose Benchmark?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          We combine powerful analytics with an intuitive UI so you can make
          data-driven decisions effortlessly.
        </p>
        <div className="flex justify-center flex-wrap gap-8 mt-6">
          {["Real-Time Reports", "Secure & Reliable", "Custom Dashboards"].map(
            (title, idx) => (
              <div key={idx} className="w-60 bg-gray-100 rounded-xl p-4 shadow">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600">
                  {title === "Real-Time Reports"
                    ? "Instant access to the most recent trends and insights."
                    : title === "Secure & Reliable"
                    ? "Your data is encrypted and protected with modern standards."
                    : "Tailor your experience to what matters most to your goals."}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Trusted by analysts, educators, and entrepreneurs around the globe.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              quote:
                "Benchmark helped us spot performance issues we never saw before. Love the UI!",
              name: "— Ayesha R., Product Manager",
            },
            {
              quote:
                "The insights are actionable and timely. It’s like having a data analyst on demand.",
              name: "— Nikhil P., Startup Founder",
            },
          ].map((item, idx) => (
            <div key={idx} className="max-w-xs bg-white p-6 rounded-xl shadow">
              <p className="text-sm italic text-gray-700 mb-4">
                “{item.quote}”
              </p>
              <p className="font-semibold text-amber-600">{item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-2xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Get the latest updates, product tips, and analytics trends delivered
          straight to your inbox.
        </p>
        <form className="flex justify-center gap-2 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-lg w-72 focus:ring-2 focus:ring-amber-600"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 bg-white border-t mt-10 text-gray-700">
        <h2 className="text-xl font-semibold mb-4">Discover Our Vision</h2>
        <div className="flex justify-center gap-6 text-2xl mb-6">
          <a href="#" className="hover:text-amber-600">
            <FaBlogger />
          </a>
          <a href="#" className="hover:text-amber-600">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-amber-600">
            <FaInstagram />
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-sm mb-6">
          <a href="/help" className="hover:underline hover:text-amber-600">
            Help Us
          </a>
          <a href="/contact" className="hover:underline hover:text-amber-600">
            Contact Us
          </a>
          <a href="/about" className="hover:underline hover:text-amber-600">
            About Us
          </a>
          <a
            href="/privacy-policy"
            className="hover:underline hover:text-amber-600"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="hover:underline hover:text-amber-600"
          >
            Terms of Service
          </a>
          <a href="/feedback" className="hover:underline hover:text-amber-600">
            Feedback
          </a>
        </div>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Benchmark. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
