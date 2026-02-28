import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Harvest() {
  const [plans, setPlans] = useState([]);
  const [history, setHistory] = useState([]);
  const [plants, setPlants] = useState([]);
  const [activeTab, setActiveTab] = useState("plans");
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [predictions, setPredictions] = useState({});

  const [planFormData, setPlanFormData] = useState({
    plant_id: "",
    expected_yield: "",
    expected_date: "",
    notes: "",
  });

  const [logFormData, setLogFormData] = useState({
    plant_id: "",
    actual_yield: "",
    quality_notes: "",
    harvest_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, historyRes, plantsRes] = await Promise.all([
        API.get("/harvest/plans"),
        API.get("/harvest/history"),
        API.get("/plants"),
      ]);

      setPlans(plansRes.data);
      setHistory(historyRes.data);
      setPlants(plantsRes.data);

      // Get predictions for each plant
      const predictionPromises = plantsRes.data.map(async (plant) => {
        try {
          const predRes = await API.get(`/harvest/predict/${plant.id}`);
          return { [plant.id]: predRes.data };
        } catch (error) {
          return { [plant.id]: null };
        }
      });

      const predictionResults = await Promise.all(predictionPromises);
      const allPredictions = predictionResults.reduce((acc, pred) => ({ ...acc, ...pred }), {});
      setPredictions(allPredictions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/harvest/plans/${editingId}`, planFormData);
      } else {
        await API.post("/harvest/plans", planFormData);
      }
      fetchData();
      resetPlanForm();
    } catch (error) {
      console.error("Error saving harvest plan:", error);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/harvest/log", logFormData);
      fetchData();
      resetLogForm();
    } catch (error) {
      console.error("Error logging harvest:", error);
    }
  };

  const handleEditPlan = (plan) => {
    setPlanFormData({
      plant_id: plan.plant_id,
      expected_yield: plan.expected_yield,
      expected_date: plan.expected_date,
      notes: plan.notes,
    });
    setEditingId(plan.id);
    setShowPlanForm(true);
  };

  const handleDeletePlan = async (id) => {
    try {
      await API.delete(`/harvest/plans/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting harvest plan:", error);
    }
  };

  const resetPlanForm = () => {
    setPlanFormData({
      plant_id: "",
      expected_yield: "",
      expected_date: "",
      notes: "",
    });
    setEditingId(null);
    setShowPlanForm(false);
  };

  const resetLogForm = () => {
    setLogFormData({
      plant_id: "",
      actual_yield: "",
      quality_notes: "",
      harvest_date: new Date().toISOString().split('T')[0],
    });
    setShowLogForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "harvested":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Harvest Planning & Tracking
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "plans"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Harvest Plans ({plans.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "history"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Harvest History ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("predictions")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "predictions"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Predictions
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowPlanForm(!showPlanForm)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            {showPlanForm ? "Cancel" : "+ Create Harvest Plan"}
          </button>
          <button
            onClick={() => setShowLogForm(!showLogForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {showLogForm ? "Cancel" : "+ Log Harvest"}
          </button>
        </div>

        {/* Harvest Plan Form */}
        {showPlanForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Harvest Plan" : "Create Harvest Plan"}
            </h3>
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plant</label>
                  <select
                    value={planFormData.plant_id}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, plant_id: e.target.value })
                    }
                    required
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    <option value="">Select a plant</option>
                    {plants.map((plant) => (
                      <option key={plant.id} value={plant.id}>
                        {plant.name} ({plant.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Yield
                  </label>
                  <input
                    type="text"
                    value={planFormData.expected_yield}
                    onChange={(e) =>
                      setPlanFormData({ ...planFormData, expected_yield: e.target.value })
                    }
                    placeholder="e.g., 2 kg, 10 pieces"
                    required
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Expected Harvest Date
                </label>
                <input
                  type="date"
                  value={planFormData.expected_date}
                  onChange={(e) =>
                    setPlanFormData({ ...planFormData, expected_date: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={planFormData.notes}
                  onChange={(e) =>
                    setPlanFormData({ ...planFormData, notes: e.target.value })
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
                  {editingId ? "Update Plan" : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={resetPlanForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Harvest Log Form */}
        {showLogForm && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Log Harvest</h3>
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plant</label>
                  <select
                    value={logFormData.plant_id}
                    onChange={(e) =>
                      setLogFormData({ ...logFormData, plant_id: e.target.value })
                    }
                    required
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  >
                    <option value="">Select a plant</option>
                    {plants.map((plant) => (
                      <option key={plant.id} value={plant.id}>
                        {plant.name} ({plant.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Actual Yield
                  </label>
                  <input
                    type="text"
                    value={logFormData.actual_yield}
                    onChange={(e) =>
                      setLogFormData({ ...logFormData, actual_yield: e.target.value })
                    }
                    placeholder="e.g., 1.5 kg, 8 pieces"
                    required
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Quality Notes
                </label>
                <textarea
                  value={logFormData.quality_notes}
                  onChange={(e) =>
                    setLogFormData({ ...logFormData, quality_notes: e.target.value })
                  }
                  rows="3"
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Harvest Date
                </label>
                <input
                  type="date"
                  value={logFormData.harvest_date}
                  onChange={(e) =>
                    setLogFormData({ ...logFormData, harvest_date: e.target.value })
                  }
                  required
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Log Harvest
                </button>
                <button
                  type="button"
                  onClick={resetLogForm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === "plans" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Harvest Plans</h3>
            {plans.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No harvest plans created yet 🌿
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {plan.plants?.name || "Unknown Plant"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {plan.plants?.type || "Unknown type"}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          plan.status || "planned"
                        )}`}
                      >
                        {plan.status || "planned"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected Yield:</span>
                        <span className="font-medium">{plan.expected_yield}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected Date:</span>
                        <span className="font-medium">
                          {new Date(plan.expected_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {plan.notes && (
                      <p className="text-sm text-gray-600 mb-4">{plan.notes}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Harvest History</h3>
            {history.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No harvests logged yet 🌿
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((harvest) => (
                  <div
                    key={harvest.id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {harvest.plants?.name || "Unknown Plant"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {harvest.plants?.type || "Unknown type"}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(harvest.harvest_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm text-gray-500">Actual Yield: </span>
                      <span className="font-medium">{harvest.actual_yield}</span>
                    </div>

                    {harvest.quality_notes && (
                      <div className="mb-3">
                        <strong className="text-sm">Quality Notes:</strong>
                        <p className="text-sm text-gray-600">{harvest.quality_notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "predictions" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Harvest Predictions</h3>
            {Object.keys(predictions).length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No predictions available 🌿
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(predictions).map(([plantId, prediction]) => (
                  prediction && (
                    <div
                      key={plantId}
                      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        {prediction.plant_name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {prediction.plant_type}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Growth Progress</span>
                            <span className="font-medium">{prediction.growth_progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${prediction.growth_progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="text-gray-500 mb-1">Estimated Harvest Window:</div>
                          <div className="font-medium">
                            {prediction.estimated_harvest_window.earliest} to{" "}
                            {prediction.estimated_harvest_window.latest}
                          </div>
                          <div className="text-gray-600">
                            {prediction.estimated_harvest_window.timeframe}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Harvest;
