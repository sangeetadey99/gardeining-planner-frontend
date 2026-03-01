import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { deletePlant, updatePlant } from "../services/plantService";

function Plants() {
  const [plants, setPlants] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [sunlight, setSunlight] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await API.get("/plants");
        setPlants(res.data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, []);

  // Add or Update plant
  const handleAddPlant = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        const res = await updatePlant(editingId, {
          name,
          type,
          sunlight,
        });

        const updatedPlant = res.data[0];

        setPlants((prev) =>
          prev.map((plant) =>
            plant.id === editingId ? updatedPlant : plant
          )
        );

        setEditingId(null);
      } else {
        // ADD
        const res = await API.post("/plants", {
          name,
          type,
          sunlight,
        });

        const newPlant = res.data[0];

        setPlants((prev) => [...prev, newPlant]);
      }

      // Reset form
      setName("");
      setType("");
      setSunlight("");
    } catch (error) {
      console.error("Error saving plant:", error);
    }
  };

  // Delete plant
  const handleDelete = async (id) => {
    try {
      await deletePlant(id);
      setPlants((prev) =>
        prev.filter((plant) => plant.id !== id)
      );
    } catch (error) {
      console.error("Error deleting plant:", error);
    }
  };

  // Edit plant
  const handleEdit = (plant) => {
    setName(plant.name);
    setType(plant.type);
    setSunlight(plant.sunlight);
    setEditingId(plant.id);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">
          Your Plants
        </h2>

        {/* Add / Update Form */}
        <form
          onSubmit={handleAddPlant}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mb-6 sm:mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? "Update Plant" : "Add New Plant"}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Plant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <input
              type="text"
              placeholder="Sunlight"
              value={sunlight}
              onChange={(e) => setSunlight(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <button
              type="submit"
              className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {editingId ? "Update Plant" : "Add Plant"}
            </button>
          </div>
        </form>

        {/* Plants Grid */}
        {plants.length === 0 ? (
          <div className="text-gray-500 text-center mt-10 p-8 bg-white rounded-xl shadow">
            <div className="text-4xl mb-4">🌿</div>
            <p className="text-lg">No plants added yet</p>
            <p className="text-sm mt-2">Start by adding your first plant above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-green-700">
                    {plant.name}
                  </h3>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-600">🌱</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Plant ID: {plant.id}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Type:</span>
                    <span className="text-xs sm:text-sm text-gray-800">{plant.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Sunlight:</span>
                    <span className="text-xs sm:text-sm text-gray-800">{plant.sunlight}</span>
                  </div>
                </div>

                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={() => handleEdit(plant)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(plant.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
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

export default Plants;