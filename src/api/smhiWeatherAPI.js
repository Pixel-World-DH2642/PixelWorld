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
