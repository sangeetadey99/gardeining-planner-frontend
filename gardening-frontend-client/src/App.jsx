import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Plants from "./pages/Plants";
import Tasks from "./pages/Tasks";
import GardenLayout from "./pages/GardenLayout";
import PestTracker from "./pages/PestTracker";
import SeasonalTasks from "./pages/SeasonalTasks";
import Weather from "./pages/Weather";
import Harvest from "./pages/Harvest";
import Tips from "./pages/Tips";
import Community from "./pages/Community";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/plants"
        element={
          <ProtectedRoute>
            <Plants />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/garden"
        element={
          <ProtectedRoute>
            <GardenLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pest"
        element={
          <ProtectedRoute>
            <PestTracker />
          </ProtectedRoute>
        }
      />

      <Route
        path="/seasonal"
        element={
          <ProtectedRoute>
            <SeasonalTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/weather"
        element={
          <ProtectedRoute>
            <Weather />
          </ProtectedRoute>
        }
      />

      <Route
        path="/harvest"
        element={
          <ProtectedRoute>
            <Harvest />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tips"
        element={
          <ProtectedRoute>
            <Tips />
          </ProtectedRoute>
        }
      />

      <Route
        path="/community"
        element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;