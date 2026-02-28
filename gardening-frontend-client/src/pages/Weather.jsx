import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";

function Weather() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState({ weather_alerts: [], gardening_alerts: [] });
  const [location, setLocation] = useState({ lat: 40.7128, lon: -74.0060 }); // Default: NYC
  const [loading, setLoading] = useState(false);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
    // Auto-detect user location on component mount
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fall back to default location (NYC)
          fetchWeatherData();
        }
      );
    } else {
      // Geolocation not supported, use default location
      fetchWeatherData();
    }
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const [currentRes, forecastRes, alertsRes] = await Promise.all([
        API.get(`/weather/current?lat=${location.lat}&lon=${location.lon}`),
        API.get(`/weather/forecast?lat=${location.lat}&lon=${location.lon}`),
        API.get(`/weather/alerts?lat=${location.lat}&lon=${location.lon}`),
      ]);

      setCurrentWeather(currentRes.data);
      setForecast(forecastRes.data.slice(0, 8)); // Next 8 forecasts
      setAlerts({
        weather_alerts: alertsRes.data?.weather_alerts || [],
        gardening_alerts: alertsRes.data?.gardening_alerts || []
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Set default empty values to prevent crashes
      setCurrentWeather(null);
      setForecast([]);
      setAlerts({
        weather_alerts: [],
        gardening_alerts: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const newLocation = {
      ...location,
      [name]: parseFloat(value)
    };
    setLocation(newLocation);
    
    // Get place name when location is manually changed
    if (newLocation.lat && newLocation.lon) {
      getPlaceName(newLocation.lat, newLocation.lon);
    }
  };

  const detectMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          // Get place name using reverse geocoding
          getPlaceName(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to detect your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter location manually.");
    }
  };

  const getPlaceName = async (lat, lon) => {
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding (free API)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        setPlaceName(data.display_name);
      }
    } catch (error) {
      console.error("Error getting place name:", error);
      setPlaceName("Unknown Location");
    }
  };

  const getWeatherIcon = (conditions) => {
    switch (conditions?.toLowerCase()) {
      case "clear":
        return "☀️";
      case "clouds":
        return "☁️";
      case "rain":
        return "🌧️";
      case "snow":
        return "❄️";
      case "thunderstorm":
        return "⛈️";
      case "drizzle":
        return "🌦️";
      case "mist":
        return "🌫️";
      default:
        return "🌤️";
    }
  };

  const getGardeningRecommendations = (weather) => {
    if (!weather) return [];
    
    const recommendations = [];
    
    if (weather.temperature > 25) {
      recommendations.push("🌵 High temperature - water plants in early morning or evening");
    }
    
    if (weather.humidity < 30) {
      recommendations.push("💨 Low humidity - consider misting sensitive plants");
    }
    
    if (weather.precipitation > 5) {
      recommendations.push("🌧️ Heavy rain expected - check drainage and protect young plants");
    }
    
    if (weather.windSpeed > 15) {
      recommendations.push("💨 Strong winds - secure tall plants and garden structures");
    }
    
    if (weather.temperature < 5) {
      recommendations.push("❄️ Frost warning - protect or bring sensitive plants indoors");
    }
    
    return recommendations;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading weather data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Weather Integration
        </h2>

        {/* Location Input */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Location Settings {placeName && `- ${placeName}`}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                name="lat"
                value={location.lat}
                onChange={handleLocationChange}
                step="0.0001"
                className="w-full border p-2 rounded-lg focus:outline-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                name="lon"
                value={location.lon}
                onChange={handleLocationChange}
                step="0.0001"
                className="w-full border p-2 rounded-lg focus:outline-green-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={detectMyLocation}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                📍 Detect My Location
              </button>
            </div>
          </div>
        </div>

        {/* Current Weather */}
        {currentWeather && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Current Weather</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold text-gray-800">
                    {Math.round(currentWeather.temperature)}°C
                  </div>
                  <div className="text-gray-600 capitalize">
                    {currentWeather.description}
                  </div>
                </div>
                <div className="text-5xl">
                  {getWeatherIcon(currentWeather.conditions)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Humidity:</span>
                  <span className="ml-2 font-medium">{currentWeather.humidity}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Wind Speed:</span>
                  <span className="ml-2 font-medium">{currentWeather.windSpeed} m/s</span>
                </div>
                <div>
                  <span className="text-gray-500">Precipitation:</span>
                  <span className="ml-2 font-medium">{currentWeather.precipitation} mm</span>
                </div>
                <div>
                  <span className="text-gray-500">Conditions:</span>
                  <span className="ml-2 font-medium capitalize">{currentWeather.conditions}</span>
                </div>
              </div>
            </div>

            {/* Gardening Recommendations */}
            <div className="bg-green-50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">🌿 Gardening Recommendations</h3>
              <div className="space-y-2">
                {getGardeningRecommendations(currentWeather).length > 0 ? (
                  getGardeningRecommendations(currentWeather).map((rec, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg text-sm">
                      {rec}
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-3 rounded-lg text-sm text-gray-600">
                    Good conditions for general gardening activities!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Weather Alerts */}
        {(alerts.weather_alerts.length > 0 || alerts.gardening_alerts.length > 0) && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">
              🚨 Weather Alerts
            </h3>
            
            {alerts.gardening_alerts.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-red-700 mb-2">Gardening Alerts:</h4>
                <div className="space-y-2">
                  {alerts.gardening_alerts.map((alert, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg">
                      <div className="font-medium text-gray-800">{alert.message}</div>
                      <div className="text-sm text-gray-600">Action: {alert.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {alerts.weather_alerts.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2">Weather Alerts:</h4>
                <div className="space-y-2">
                  {alerts.weather_alerts.map((alert, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg">
                      <div className="font-medium text-gray-800">{alert.event}</div>
                      <div className="text-sm text-gray-600">{alert.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Severity: {alert.severity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Forecast (Next 24 hours)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {forecast.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {item.date} {item.time}
                  </div>
                  <div className="text-2xl mb-2">
                    {getWeatherIcon(item.conditions)}
                  </div>
                  <div className="font-semibold text-lg">
                    {Math.round(item.temperature)}°C
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    {item.description}
                  </div>
                  {item.precipitation > 0 && (
                    <div className="text-xs text-blue-600 mt-1">
                      💧 {item.precipitation}mm
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Weather;
