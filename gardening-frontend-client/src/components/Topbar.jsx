import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Welcome {user?.name}</h2>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}

export default Topbar;