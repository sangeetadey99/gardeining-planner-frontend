import { NavLink } from "react-router-dom";
import { FaLeaf, FaTasks, FaChartBar } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-10">
        🌿 GardenPro
      </h1>

      <nav className="flex flex-col gap-6">
        <NavLink to="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaChartBar /> Dashboard
        </NavLink>

        <NavLink to="/plants" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaLeaf /> Plants
        </NavLink>

        <NavLink to="/tasks" className="flex items-center gap-3 text-gray-700 hover:text-green-600">
          <FaTasks /> Tasks
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;