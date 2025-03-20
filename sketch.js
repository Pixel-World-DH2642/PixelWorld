//https://opendata.smhi.se/metobs/examples#javascript

const url = "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/4.json";

let data;

fetch(url).then(handleResponse).then(handleData).then(handleResult).catch(handleError);



function handleResponse(response){
  console.log("response");
  console.log(response);
  return response;
}

function handleData(data){
  console.log("data");
  //console.log(data.json());
  
  return data.json();
}

function handleResult(data){
  console.log(data);
}

function handleError(e){
  if(e) console.log(e);
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  circle(width/2, height/2, 100);
}