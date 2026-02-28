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
  FaUsers 
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-10">
        🌿 GardenPro
      </h1>

      <nav className="flex flex-col gap-4">
        <NavLink to="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaChartBar /> Dashboard
        </NavLink>

        <NavLink to="/plants" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaLeaf /> Plants
        </NavLink>

        <NavLink to="/tasks" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaTasks /> Tasks
        </NavLink>

        <NavLink to="/garden" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaTh /> Garden Layout
        </NavLink>

        <NavLink to="/pest" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaBug /> Pest Tracker
        </NavLink>

        <NavLink to="/seasonal" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaCalendarAlt /> Seasonal Tasks
        </NavLink>

        <NavLink to="/weather" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaCloudSun /> Weather
        </NavLink>

        <NavLink to="/harvest" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaShoppingBasket /> Harvest
        </NavLink>

        <NavLink to="/tips" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaLightbulb /> Tips & Resources
        </NavLink>

        <NavLink to="/community" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaUsers /> Community
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;