import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Dashboard() {
  const [plants, setPlants] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const plantRes = await API.get("/plants");
      const taskRes = await API.get("/tasks");
      setPlants(plantRes.data);
      setTasks(taskRes.data);
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-sm sm:text-base font-medium">Total Plants</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-green-600 text-xl">🌿</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {plants.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Active plants in your garden
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-sm sm:text-base font-medium">Total Tasks</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {tasks.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Tasks to be completed
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-sm sm:text-base font-medium">Completed Tasks</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <span className="text-purple-600 text-xl">✅</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {tasks.filter((t) => t.status === "completed").length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Tasks successfully completed
            </p>
          </div>
        </div>

        {/* Additional mobile-friendly sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Plants</h3>
            {plants.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No plants added yet</p>
            ) : (
              <div className="space-y-2">
                {plants.slice(0, 3).map((plant) => (
                  <div key={plant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{plant.name}</span>
                    <span className="text-xs text-gray-500">{plant.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h3>
            {tasks.filter((t) => t.status !== "completed").length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending tasks</p>
            ) : (
              <div className="space-y-2">
                {tasks.filter((t) => t.status !== "completed").slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">{task.task_type}</span>
                    <span className="text-xs text-gray-500">{task.due_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;