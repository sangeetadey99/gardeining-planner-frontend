import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Tips() {
  const [tips, setTips] = useState([]);
  const [resources, setResources] = useState([]);
  const [categoryTips, setCategoryTips] = useState([]);
  const [plantTips, setPlantTips] = useState([]);
  const [activeTab, setActiveTab] = useState("tips");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");

  const categories = ["watering", "soil", "planting", "pests", "containers"];
  const plantTypes = ["tomato", "lettuce", "herbs", "peppers"];

  useEffect(() => {
    fetchTips();
    fetchResources();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryTips();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedPlant) {
      fetchPlantTips();
    }
  }, [selectedPlant]);

  const fetchTips = async () => {
    try {
      const res = await API.get("/tips");
      setTips(res.data.tips || []);
      setCurrentSeason(res.data.current_season || "");
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await API.get("/tips/resources");
      setResources(res.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  const fetchCategoryTips = async () => {
    try {
      const res = await API.get(`/tips/category/${selectedCategory}`);
      setCategoryTips(res.data.tips || []);
    } catch (error) {
      console.error("Error fetching category tips:", error);
    }
  };

  const fetchPlantTips = async () => {
    try {
      const res = await API.get(`/tips/plant/${selectedPlant}`);
      setPlantTips(res.data.tips || []);
    } catch (error) {
      console.error("Error fetching plant tips:", error);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "article":
        return "📄";
      case "video":
        return "🎥";
      case "course":
        return "🎓";
      case "tool":
        return "🔧";
      default:
        return "📚";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Gardening Tips & Resources
        </h2>

        {currentSeason && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              🌿 Current Season: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
            </h3>
            <p className="text-blue-700">
              Here are some seasonal tips and recommendations for your garden.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("tips")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "tips"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Seasonal Tips
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "categories"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setActiveTab("plants")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "plants"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            By Plant Type
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-6 py-2 rounded-lg transition ${
              activeTab === "resources"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Resources
          </button>
        </div>

        {/* Seasonal Tips */}
        {activeTab === "tips" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Seasonal Gardening Tips</h3>
            {tips.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No tips available at the moment 🌿
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {tips.map((tip) => (
                  <div
                    key={tip.id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {tip.title}
                      </h4>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            tip.difficulty
                          )}`}
                        >
                          {tip.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                          {tip.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{tip.content}</p>
                    <div className="text-sm text-gray-500">
                      Season: {tip.season}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Tips */}
        {activeTab === "categories" && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Category</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedCategory === ""
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg transition capitalize ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {selectedCategory && (
              <div>
                <h3 className="text-xl font-semibold mb-4 capitalize">
                  {selectedCategory} Tips
                </h3>
                {categoryTips.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No tips available for this category 🌿
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categoryTips.map((tip, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-700">• {tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!selectedCategory && (
              <div className="text-gray-500 text-center py-8">
                Select a category to view specific tips 🌿
              </div>
            )}
          </div>
        )}

        {/* Plant Type Tips */}
        {activeTab === "plants" && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Plant Type</label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedPlant("")}
                  className={`px-4 py-2 rounded-lg transition ${
                    selectedPlant === ""
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  All Plants
                </button>
                {plantTypes.map((plant) => (
                  <button
                    key={plant}
                    onClick={() => setSelectedPlant(plant)}
                    className={`px-4 py-2 rounded-lg transition capitalize ${
                      selectedPlant === plant
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {plant}
                  </button>
                ))}
              </div>
            </div>

            {selectedPlant && (
              <div>
                <h3 className="text-xl font-semibold mb-4 capitalize">
                  {selectedPlant} Growing Tips
                </h3>
                {plantTips.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    No tips available for this plant type 🌿
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plantTips.map((tip, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow">
                        <p className="text-gray-700">• {tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!selectedPlant && (
              <div className="text-gray-500 text-center py-8">
                Select a plant type to view specific growing tips 🌿
              </div>
            )}
          </div>
        )}

        {/* Resources */}
        {activeTab === "resources" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Gardening Resources</h3>
            {resources.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No resources available at the moment 🌿
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          resource.difficulty
                        )}`}
                      >
                        {resource.difficulty}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {resource.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">
                        {resource.category}
                      </span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Resource →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Tips;
