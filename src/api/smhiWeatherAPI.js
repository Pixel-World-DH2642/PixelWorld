export async function fetchWeatherData(longitude, latitude) {
  //console.log("weather fetch");
  const smhiURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;
  const response = await fetch(smhiURL);
  if (!response.ok)
    throw new Error("SMHI API call failed with status: " + response.status);
  const data = await response.json();
  //console.log(data);
  const weatherCode = data.timeSeries[2].parameters[18].values[0];
  const weatherTemperature =
    data.timeSeries[2].parameters[10].values[0]; /*Celsius*/
  const windSpeed = data.timeSeries[2].parameters[14].values[0]; /*m/s*/
  const airPressure = data.timeSeries[2].parameters[11].values[0]; /*hPa*/
  const meanPrecipitation =
    data.timeSeries[2].parameters[3].values[0]; /*kg/m2/h*/

  /*
  console.log("weather code today is:", weatherCode);
  console.log("weatherTemperature today is:", weatherTemperature);
  console.log("wind Speed  today is:", windSpeed);
  console.log("air pressure today is:", airPressure);
  console.log("mean precipitation today is:", meanPrecipitation);
  */
  return {
    //weatherData
    weatherCode,
    weatherTemperature,
    windSpeed,
    airPressure,
    meanPrecipitation,
    worldWeather: parseWeatherData(data),
    timestamp: Date.now(),
  };
}

function parseWeatherData(data) {
  //------------------------------Forecast------------------------------//
  const timeIndex = 2; //time in UTC check which one matches user

  //Weather Symbols
  let rainAmt = 0; //(0-3)
  let snowAmt = 0; //(0-3)
  let cloudAmt = 0; //(0-6) where 5&6 overcast/ foggy
  let windSpeed = 0;

  const weatherSymbols = data.timeSeries[timeIndex].parameters[18].values;
  weatherSymbols.forEach((symbol) => abstractWeatherSymbol(symbol));

  function abstractWeatherSymbol(weatherSymbol) {
    switch (weatherSymbol) {
      //------------Clouds-------------
      case 1: //Clear sky
        break;
      case 2: //Nearly clear sky
        cloudAmt = 1;
        break;
      case 3: //Variable cloudiness
        cloudAmt = 2;
        break;
      case 4: //Halfclear sky
        cloudAmt = 3;
        break;
      case 5: //Cloudy sky
        cloudAmt = 4;
        break;
      case 6: //Overcast
        cloudAmt = 5;
        break;
      case 7: //Fog
        cloudAmt = 6;
        break;
      case 8: //Light rain showers
        rainAmt = 1;
        break;
      case 9: //Moderate rain showers
        rainAmt = 2;
        break;
      case 10: //Heavy rain showers
        rainAmt = 3;
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
        snowAmt = 1;
        break;
      case 26: //Moderate snowfall
        snowAmt = 2;
        break;
      case 27: //Heavy snowfall
        snowAmt = 3;
        break;
    }
  }

  //------------------------------Observations------------------------------//
  let groundSnowAmt = 0;
  let sunriseAmt = 0;
  let sunsetAmt = 0;
  //...
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
