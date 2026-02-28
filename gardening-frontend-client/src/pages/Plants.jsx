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
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Your Plants
        </h2>

        {/* Add / Update Form */}
        <form
          onSubmit={handleAddPlant}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8 grid md:grid-cols-4 gap-4"
        >
          <input
            type="text"
            placeholder="Plant Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-green-500"
          />

          <input
            type="text"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-green-500"
          />

          <input
            type="text"
            placeholder="Sunlight"
            value={sunlight}
            onChange={(e) => setSunlight(e.target.value)}
            required
            className="border p-3 rounded-lg focus:outline-green-500"
          />

          <button
            type="submit"
            className="bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            {editingId ? "Update Plant" : "Add Plant"}
          </button>
        </form>

        {/* Plants Grid */}
        {plants.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No plants added yet 🌿
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  {plant.name}
                </h3>

                <p className="text-sm text-gray-500 mb-1">
                  Plant ID: {plant.id}
                </p>

                <p className="text-gray-600">
                  Type: {plant.type}
                </p>

                <p className="text-gray-600">
                  Sunlight: {plant.sunlight}
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(plant)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(plant.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
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