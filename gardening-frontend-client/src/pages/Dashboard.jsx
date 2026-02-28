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
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Plants</h3>
          <p className="text-3xl font-bold text-green-600">
            {plants.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600">
            {tasks.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Completed Tasks</h3>
          <p className="text-3xl font-bold text-purple-600">
            {tasks.filter((t) => t.status === "completed").length}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;