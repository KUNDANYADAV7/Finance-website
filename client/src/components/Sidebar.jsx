


import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  PiggyBank,
  BarChart3,
  Calendar,
  Clock,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useContext, useState } from "react"
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const { user, setUser, setIsAuthenticated } = useContext(Context);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/v1/user/logout`, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed!");
    }
  };

  return (
    <>
  {/* Mobile Sidebar Toggle Button */}
  <button
    className="fixed top-4 left-4 z-50 p-2 rounded-full bg-light-purple-500 text-white md:hidden"
    onClick={toggleSidebar}
  >
    {isOpen ? <X size={20} /> : <Menu size={20} />}
  </button>

  {/* Sidebar Container */}
  <div
    className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0`}
  >
    <div className="h-full w-64 bg-light-purple-100/80 backdrop-blur-md shadow-lg p-6 flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold text-light-purple-800 ml-2">
          Finance Tracker
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5 mr-3" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bank-account"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <Wallet className="h-5 w-5 mr-3" /> Bank Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/credit-card"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <CreditCard className="h-5 w-5 mr-3" /> Credit Card
            </NavLink>
          </li>
          <li>
                <NavLink 
                  to="/debit-card" 
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-light-purple-800 text-white "
                        : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                    }`
                  }
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Debit Card
                </NavLink>
              </li>
          <li>
            <NavLink
              to="/investment"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <PiggyBank className="h-5 w-5 mr-3" /> Investment
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <BarChart3 className="h-5 w-5 mr-3" /> Budget
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/expenses"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <Calendar className="h-5 w-5 mr-3" /> Monthly Expenses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/autopay"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-light-purple-800 text-white "
                    : "text-light-purple-700 hover:bg-light-purple-200 hover:text-light-purple-700"
                }`
              }
            >
              <Clock className="h-5 w-5 mr-3" /> Autopay EMIs
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-light-purple-200">
        <div className="space-y-2">
          <div className="text-sm text-light-purple-700 mb-2">
            Logged in as <span className="font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center p-3 rounded-lg text-light-purple-700 hover:bg-light-purple-200 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" /> Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</>

  );
};

export default Sidebar;
