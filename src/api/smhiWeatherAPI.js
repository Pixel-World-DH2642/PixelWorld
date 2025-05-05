export async function fetchWeatherData(longitude, latitude) {
  console.log("weather fetch");
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;
  const response = await fetch(smhiURL);
  if (!response.ok)
    throw new Error("SMHI API call failed with status: " + response.status);
  const data = await response.json();
  return {
    weatherData: data,
    timestamp: Date.now(),
  };
}

function parseWeatherData(data) {
  let rainAmt = 0;
  let snowAmt = 0;
  let cloudState = 0;
  let windSpeed = 0;

  const timeIndex = 2; //time in UTC check which one matches user
  const weatherSymbols = data.timeSeries[timeIndex].parameters[18].values;
  weatherSymbols.forEach((symbol) => abstractWeatherSymbol(symbol));

  function abstractWeatherSymbol(weatherSymbol) {
    switch (weatherSymbol) {
      //------------Clouds-------------
      case 1: //Clear sky
        break;
      case 2: //Nearly clear sky
        break;
      case 3: //Variable cloudiness
        break;
      case 4: //Halfclear sky
        break;
      case 5: //Cloudy sky
        break;
      case 6: //Overcast
        break;
      case 7: //Fog
        break;
      case 8: //Light rain showers
        break;
      case 9: //Moderate rain showers
        break;
      case 10: //Heavy rain showers
        break;
      case 11: //Thunderstorm
        break;
      case 12: //Light sleet showers
        break;
      case 13: //Moderate sleet showers
        break;
      case 14: //Heavy sleet showers
        break;
      case 15: //Light snow showers
        break;
      case 16: //Moderate snow showers
        break;
      case 17: //Heavy snow showers
        break;
      case 18: //Light rain
        break;
      case 19: //Moderate rain
        break;
      case 20: //Heavy rain
        break;
      case 21: //Thunder
        break;
      case 22: //Light sleet
        break;
      case 23: //Moderate sleet
        break;
      case 24: //Heavy sleet
        break;
      case 25: //Light snowfall
        break;
      case 26: //Moderate snowfall
        break;
      case 27: //Heavy snowfall
        break;
    }
  }
}

/*Weather Abstraction Layer
 *
 * -Raining: Intensity 0-1
 *
 * -Snowing: Intensity 0-1
 *
 * -Overcast
 *
 * -Cloudy: Amount 0-1
 *
 * -Wind: Intensity 0-1
 *
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
