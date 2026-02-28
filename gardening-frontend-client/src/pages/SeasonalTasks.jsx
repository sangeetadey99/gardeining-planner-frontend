import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function SeasonalTasks() {
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    season: "spring",
    task_type: "maintenance",
    due_date: "",
    priority: "medium",
  });

  const seasons = ["spring", "summer", "fall", "winter"];
  const taskTypes = ["planting", "maintenance", "harvesting", "preparation"];

  useEffect(() => {
    fetchTasks();
    fetchRecommendations();
  }, [selectedSeason]);

  const fetchTasks = async () => {
    try {
      const params = selectedSeason !== "all" ? `?season=${selectedSeason}` : "";
      const res = await API.get(`/seasonal/tasks${params}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching seasonal tasks:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await API.get("/seasonal/recommendations");
      setRecommendations(res.data.recommendations || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/seasonal/tasks/${editingId}`, formData);
      } else {
        await API.post("/seasonal/tasks", formData);
      }
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      season: task.season,
      task_type: task.task_type,
      due_date: task.due_date,
      priority: task.priority,
    });
    setEditingId(task.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/seasonal/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      season: "spring",
      task_type: "maintenance",
      due_date: "",
      priority: "medium",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSeasonIcon = (season) => {
    switch (season) {
      case "spring":
        return "🌸";
      case "summer":
        return "☀️";
      case "fall":
        return "🍂";
      case "winter":
        return "❄️";
      default:
        return "🌿";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Seasonal Task Planner
        </h2>

        {/* Season Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Filter by Season</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSeason("all")}
              className={`px-4 py-2 rounded-lg transition ${
                selectedSeason === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Seasons
            </button>
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 rounded-lg transition capitalize ${
                  selectedSeason === season
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getSeasonIcon(season)} {season}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              💡 Seasonal Recommendations
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                        rec.priority
                      )}`}
                    >
                      {rec.priority}
                    </span>
                    <span className="text-xs text-gray-500">{rec.timing}</span>
                  </div>
                  <div className="font-medium text-gray-800">{rec.task}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Task Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {showForm ? "Cancel" : "+ Add Seasonal Task"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Task" : "Add New Task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) =>
                      setFormData({ ...formData, season: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    {seasons.map((season) => (
                      <option key={season} value={season} className="capitalize">
                        {season}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Task Type</label>
                  <select
                    value={formData.task_type}
                    onChange={(e) =>
                      setFormData({ ...formData, task_type: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    {taskTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingId ? "Update Task" : "Add Task"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Seasonal Tasks ({tasks.length})
          </h3>
          {tasks.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No seasonal tasks planned yet 🌿
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getSeasonIcon(task.season)}</span>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {task.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize">
                          📋 {task.task_type}
                        </span>
                        {task.due_date && (
                          <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                        {task.season}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SeasonalTasks;
