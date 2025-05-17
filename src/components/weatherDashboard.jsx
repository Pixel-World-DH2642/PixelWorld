import { useSelector } from "react-redux";

export function WeatherDashboard() {
  const weather = useSelector((state) => state.weather);

  return (
    <div className="w-full max-w-md mx-auto font-pixel">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        🌦️ Weather Dashboard
      </h2>

      <div className="space-y-2 text-gray-700 text-lg">
        <p>
          🌤️ <span className="font-semibold">Weather:</span>{" "}
          {weather.currentWeather}
        </p>
        <p>
          🌡️ <span className="font-semibold">Temperature:</span>{" "}
          {weather.weatherData?.weatherTemperature} °C
        </p>
        <p>
          💨 <span className="font-semibold">Wind Speed:</span>{" "}
          {weather.weatherData?.windSpeed} m/s
        </p>
        <p>
          🌬️ <span className="font-semibold">Air Pressure:</span>{" "}
          {weather.weatherData?.airPressure} hPa
        </p>
        <p>
          🌧️ <span className="font-semibold">Precipitation:</span>{" "}
          {weather.weatherData?.meanPrecipitation} kg/m²/h
        </p>
      </div>
    </div>
  );
}
