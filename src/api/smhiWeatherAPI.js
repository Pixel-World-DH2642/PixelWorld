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
    case "18":
    case "19":
      currentWeather = "light to moderate rain showers";
      break;
    case "10":
    case "20":
      currentWeather = "heavy rain";
      break;
    case "11":
    case "21":
      currentWeather = "heavy rain and thunderstorms";
      break;
    case "12":
    case "13":
    case "14":
    case "22":
    case "23":
    case "24":
      currentWeather = "sleet showers";
      break;
    case "15":
    case "16":
    case "25":
    case "26":
      currentWeather = "light to moderate snow";
      break;
    case "17":
    case "27":
      currentWeather = "heavy snow";
      break;
  }
  console.log("Current weather is:", currentWeather);
}
checkWeather();

/* Weather Symbol - value + meaning
1	Clear sky
2	Nearly clear sky
3	Variable cloudiness
4	Halfclear sky
5	Cloudy sky
6	Overcast
7	Fog
8	Light rain showers
9	Moderate rain showers
10	Heavy rain showers
11	Thunderstorm
12	Light sleet showers
13	Moderate sleet showers
14	Heavy sleet showers
15	Light snow showers
16	Moderate snow showers
17	Heavy snow showers
18	Light rain
19	Moderate rain
20	Heavy rain
21	Thunder
22	Light sleet
23	Moderate sleet
24	Heavy sleet
25	Light snowfall
26	Moderate snowfall
27	Heavy snowfall
*/

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
