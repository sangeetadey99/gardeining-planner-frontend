import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Hamburger menu for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaBars className="text-xl" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome {user?.name}
        </h2>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;