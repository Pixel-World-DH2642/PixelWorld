//split into MVP

let latitude = null;
let longitude = null;

function setup() {
  createCanvas(400, 400);

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(latitude, longitude);
    });
  } else {
    console.log("No geolocation");
  }
}

function draw() {
  background(220);
  if (latitude !== null && longitude !== null) {
    fill(0);
    console.log(longitude);
    textSize(16);
    text(latitude, 50, 50);
    text(longitude, 50, 70);
  } else {
    text("Waiting for location permission...", 50, 50);
  }
}
