import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function GardenLayout() {
  const [layouts, setLayouts] = useState([]);
  const [name, setName] = useState("");
  const [dimensions, setDimensions] = useState({ width: 10, height: 10 });
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      const res = await API.get("/garden");
      setLayouts(res.data);
    } catch (error) {
      console.error("Error fetching layouts:", error);
    }
  };

  const initializeGrid = () => {
    const grid = [];
    for (let i = 0; i < dimensions.height; i++) {
      const row = [];
      for (let j = 0; j < dimensions.width; j++) {
        row.push({ type: "empty", plant: null });
      }
      grid.push(row);
    }
    setGridData(grid);
    setShowGrid(true);
  };

  const handleSaveLayout = async (e) => {
    e.preventDefault();
    try {
      const layoutData = {
        grid: gridData,
        dimensions,
      };

      if (editingId) {
        await API.put(`/garden/${editingId}`, {
          name,
          layout_data: layoutData,
          dimensions,
          notes,
        });
      } else {
        await API.post("/garden", {
          name,
          layout_data: layoutData,
          dimensions,
          notes,
        });
      }

      fetchLayouts();
      resetForm();
    } catch (error) {
      console.error("Error saving layout:", error);
    }
  };

  const handleEdit = (layout) => {
    setName(layout.name);
    setDimensions(layout.dimensions);
    setNotes(layout.notes);
    setGridData(layout.layout_data.grid);
    setEditingId(layout.id);
    setShowGrid(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/garden/${id}`);
      fetchLayouts();
    } catch (error) {
      console.error("Error deleting layout:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDimensions({ width: 10, height: 10 });
    setNotes("");
    setEditingId(null);
    setShowGrid(false);
    setGridData([]);
  };

  const handleCellClick = (row, col) => {
    const newGrid = [...gridData];
    newGrid[row][col] = {
      type: newGrid[row][col].type === "plant" ? "empty" : "plant",
      plant: newGrid[row][col].type === "plant" ? null : "🌱",
    };
    setGridData(newGrid);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Garden Layout Planner
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Layout" : "Create New Layout"}
            </h3>

            <form onSubmit={handleSaveLayout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Layout Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        width: parseInt(e.target.value),
                      })
                    }
                    min="5"
                    max="20"
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        height: parseInt(e.target.value),
                      })
                    }
                    min="5"
                    max="20"
                    className="w-full border p-2 rounded-lg focus:outline-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full border p-2 rounded-lg focus:outline-green-500"
                />
              </div>

              {!showGrid && (
                <button
                  type="button"
                  onClick={initializeGrid}
                  className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Grid
                </button>
              )}

              {showGrid && (
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                  >
                    {editingId ? "Update Layout" : "Save Layout"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Grid Section */}
          {showGrid && (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Garden Grid</h3>
              <div className="text-sm text-gray-600 mb-4">
                Click cells to place plants 🌱
              </div>
              <div className="inline-block border-2 border-gray-300">
                {gridData.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                      <div
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`w-8 h-8 border border-gray-200 cursor-pointer flex items-center justify-center text-xs ${
                          cell.type === "plant"
                            ? "bg-green-100 hover:bg-green-200"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {cell.plant}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Saved Layouts */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Saved Layouts</h3>
          {layouts.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No garden layouts created yet 🌿
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {layouts.map((layout) => (
                <div
                  key={layout.id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    {layout.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Dimensions: {layout.dimensions.width} × {layout.dimensions.height}
                  </p>
                  {layout.notes && (
                    <p className="text-sm text-gray-600 mb-4">{layout.notes}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(layout)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(layout.id)}
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
      </div>
    </Layout>
  );
}

export default GardenLayout;
