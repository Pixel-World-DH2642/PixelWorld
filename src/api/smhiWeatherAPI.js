export async function fetchWeatherData(longitude, latitude) {
  console.log("weather fetch");
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;
  const response = await fetch(smhiURL);
  if (!response.ok)
    throw new Error("SMHI API call failed with status: " + response.status);
  const data = await response.json();
  const weatherCode = data.timeSeries[0].parameters[18].values[0];
  return {
    weatherData: weatherCode,
    timestamp: Date.now(),
  };
}

async function checkWeather() {
  const result = await fetchWeatherData(18.06324, 59.334591);
  const weatherCheck = result.weatherData;
  let currentWeather = null;

  switch (String(weatherCheck)) {
    case "1":
    case "2":
      currentWeather = "clear sky";
      break;
    case "3":
    case "4":
      currentWeather = "slightly cloudy sky";
      break;
    case "5":
    case "6":
      currentWeather = "cloudy sky";
      break;
    case "7":
      currentWeather = "fog";
      break;
    case "8":
    case "9":
      currentWeather = "light to moderate rain showers";
      break;
  }
  console.log("Current weather is:", currentWeather);
}
checkWeather();

//https://opendata.smhi.se/metfcst/pmp/demo_get_point
//https://opendata.smhi.se/metfcst/pmp/parameters

//TESTER
/*
//https://opendata.smhi.se/metfcst/pmp/demo_get_point
//https://opendata.smhi.se/metfcst/pmp/parameters

const lat = 59.334591; //Standard cordinates (Stockholm)
const lon = 18.063240;

const dataDiv = document.createElement("div");
document.body.append(dataDiv);
getWeatherData(lon, lat);

function setup() {
  createCanvas(100, 100);
}

async function getWeatherData(longitude, latitude) {
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;
  const response = await fetch(smhiURL);
  if (!response.ok)
    throw new Error("SMHI API call failed with status: " + response.status);
  const data = await response.json();
  console.log(data)
  dataDiv.innerHTML = JSON.stringify(data);
}

*/
