import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { deleteTask, updateTask } from "../services/taskService";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [plants, setPlants] = useState([]);
  const [taskType, setTaskType] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [plantId, setPlantId] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskRes = await API.get("/tasks");
        setTasks(taskRes.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const plantRes = await API.get("/plants");
        setPlants(plantRes.data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        plant_id: plantId,
        task_type: taskType,
        due_date: dueDate,
      });

      setTaskType("");
      setDueDate("");
      setPlantId("");

      // Refetch tasks after adding
      try {
        const taskRes = await API.get("/tasks");
        setTasks(taskRes.data);
      } catch (error) {
        console.error("Error refetching tasks:", error);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await updateTask(id);

      // Refetch tasks after updating
      try {
        const taskRes = await API.get("/tasks");
        setTasks(taskRes.data);
      } catch (error) {
        console.error("Error refetching tasks:", error);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          Tasks
        </h2>

        {/* Add Task Form */}
        <form
          onSubmit={handleAdd}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6 sm:mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select Plant</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Task Type"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <button className="bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
              Add Task
            </button>
          </div>
        </form>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-gray-500 text-center mt-10 p-8 bg-white rounded-xl shadow">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg">No tasks added yet</p>
            <p className="text-sm mt-2">Start by adding your first task above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {task.task_type}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === "completed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {task.status}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Plant:</span>
                    <span className="text-sm text-gray-800">{task.plants?.name || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Due:</span>
                    <span className="text-sm text-gray-800">{task.due_date}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Tasks;