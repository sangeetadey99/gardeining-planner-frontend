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
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Tasks</h2>

        <form
          onSubmit={handleAdd}
          className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-4 gap-4"
        >
          <select
            value={plantId}
            onChange={(e) => setPlantId(e.target.value)}
            required
            className="border p-3 rounded"
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
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="border p-3 rounded"
          />

          <button className="bg-green-600 text-white rounded-lg">
            Add Task
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h3 className="font-semibold text-lg">
                {task.task_type}
              </h3>

              <p className="text-gray-600">
                Plant: {task.plants?.name}
              </p>

              <p className="text-gray-600">
                Due: {task.due_date}
              </p>

              <p className="mt-2 text-sm">
                Status: {task.status}
              </p>

              <div className="flex gap-3 mt-4">
                {task.status !== "completed" && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Tasks;