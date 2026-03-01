import { NavLink } from "react-router-dom";
import { 
  FaLeaf, 
  FaTasks, 
  FaChartBar, 
  FaTh, 
  FaBug, 
  FaCalendarAlt, 
  FaCloudSun, 
  FaShoppingBasket, 
  FaLightbulb, 
  FaUsers,
  FaTimes
} from "react-icons/fa";

function Sidebar({ onClose }) {
  return (
    <div className="w-64 bg-white shadow-lg p-6 h-full overflow-y-auto">
      {/* Close button for mobile */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-600">
          🌿 GardenPro
        </h1>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      <nav className="flex flex-col gap-3">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaChartBar className="text-lg" />
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/plants" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaLeaf className="text-lg" />
          <span className="font-medium">Plants</span>
        </NavLink>

        <NavLink 
          to="/tasks" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaTasks className="text-lg" />
          <span className="font-medium">Tasks</span>
        </NavLink>

        <NavLink 
          to="/garden" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaTh className="text-lg" />
          <span className="font-medium">Garden Layout</span>
        </NavLink>

        <NavLink 
          to="/pest" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaBug className="text-lg" />
          <span className="font-medium">Pest Tracker</span>
        </NavLink>

        <NavLink 
          to="/seasonal" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaCalendarAlt className="text-lg" />
          <span className="font-medium">Seasonal Tasks</span>
        </NavLink>

        <NavLink 
          to="/weather" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaCloudSun className="text-lg" />
          <span className="font-medium">Weather</span>
        </NavLink>

        <NavLink 
          to="/harvest" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaShoppingBasket className="text-lg" />
          <span className="font-medium">Harvest</span>
        </NavLink>

        <NavLink 
          to="/tips" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaLightbulb className="text-lg" />
          <span className="font-medium">Tips & Resources</span>
        </NavLink>

        <NavLink 
          to="/community" 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-green-50 text-green-600 border-l-4 border-green-600' 
              : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
            }
          `}
          onClick={onClose}
        >
          <FaUsers className="text-lg" />
          <span className="font-medium">Community</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;