function getLatAndLon() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Error, cannot find your location.");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  });
}

function getWeather(source) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.addEventListener("readystatechange", () => {
      if (request.readyState === 4 && request.status === 200) {
        resolve(JSON.parse(request.response));
      } else if (request.readyState === 4) {
        reject(`Something went wrong: ${request.status}`);
      }
    });
    request.open("GET", source);
    request.send();
  });
}

getLatAndLon().then((data) => {
  getWeather(
    `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&appid=bf09db183fdc915aa7c996d8654bf86f`
  )
    .then((data2) => handleWeatherData(data2))
    .catch((err) => console.log(err));
});

getLatAndLon().then((data) => {
  getWeather(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=bf09db183fdc915aa7c996d8654bf86f`
  )
    .then((data2) => handleForecastData(data2))
    .catch((err) => console.log(err));
});

let week = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function convertTemp(value) {
  return value - 273.15;
}
