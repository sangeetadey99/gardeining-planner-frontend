import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function PestTracker() {
  const [issues, setIssues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [plants, setPlants] = useState([]);
  const [formData, setFormData] = useState({
    plant_id: "",
    pest_type: "",
    severity: "medium",
    symptoms: "",
    treatment: "",
    status: "active",
  });

  useEffect(() => {
    fetchIssues();
    fetchAlerts();
    fetchPlants(); // Fetch plants for dropdown
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await API.get("/plants");
      console.log("Plants response:", res.data); // Debug log
      setPlants(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setPlants([]); // Set empty array on error
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await API.get("/pest/issues");
      setIssues(res.data);
    } catch (error) {
      console.error("Error fetching pest issues:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/pest/alerts");
      setAlerts(res.data.alerts || []);
    } catch (error) {
      console.error("Error fetching pest alerts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/pest/issues/${editingId}`, formData);
      } else {
        await API.post("/pest/issues", formData);
      }
      fetchIssues();
      resetForm();
    } catch (error) {
      console.error("Error saving pest issue:", error);
    }
  };

  const handleEdit = (issue) => {
    setFormData({
      plant_id: issue.plant_id,
      pest_type: issue.pest_type,
      severity: issue.severity,
      symptoms: issue.symptoms,
      treatment: issue.treatment,
      status: issue.status,
    });
    setEditingId(issue.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/pest/issues/${id}`);
      fetchIssues();
    } catch (error) {
      console.error("Error deleting pest issue:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      plant_id: "",
      pest_type: "",
      severity: "medium",
      symptoms: "",
      treatment: "",
      status: "active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 text-yellow-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "treating":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Pest & Disease Tracker
        </h2>

        {/* Seasonal Alerts */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              🚨 Seasonal Pest Alerts
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {alerts.map((alert, index) => (
                <div key={index} className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-gray-800">{alert.type}</div>
                  <div className="text-sm text-gray-600">{alert.prevention}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Issue Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {showForm ? "Cancel" : "+ Log New Issue"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Pest Issue" : "Log New Pest Issue"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plant
                  </label>
                  <select
                    value={formData.plant_id}
                    onChange={(e) =>
                      setFormData({ ...formData, plant_id: e.target.value })
                    }
                    required
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                    disabled={plants.length === 0}
                  >
                    <option value="">
                      {plants.length === 0 ? "Loading plants..." : "Select a plant"}
                    </option>
                    {plants.map((plant) => (
                      <option key={plant.id} value={plant.id}>
                        {plant.name} (ID: {plant.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pest Type
                  </label>
                  <input
                    type="text"
                    value={formData.pest_type}
                    onChange={(e) =>
                      setFormData({ ...formData, pest_type: e.target.value })
                    }
                    required
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) =>
                      setFormData({ ...formData, severity: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="treating">Treating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Symptoms
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                  rows="3"
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Treatment
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  rows="3"
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  {editingId ? "Update Issue" : "Log Issue"}
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

        {/* Issues List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Logged Issues</h3>
          {issues.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No pest issues logged yet 🌿
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {issue.pest_type}
                      </h4>
                      {issue.plants && (
                        <p className="text-sm text-gray-600">
                          Plant: {issue.plants.name} ({issue.plants.type})
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                          issue.severity
                        )}`}
                      >
                        {issue.severity}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          issue.status
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </div>
                  </div>

                  {issue.symptoms && (
                    <div className="mb-3">
                      <strong className="text-sm">Symptoms:</strong>
                      <p className="text-sm text-gray-600">{issue.symptoms}</p>
                    </div>
                  )}

                  {issue.treatment && (
                    <div className="mb-3">
                      <strong className="text-sm">Treatment:</strong>
                      <p className="text-sm text-gray-600">{issue.treatment}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(issue)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(issue.id)}
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

export default PestTracker;
