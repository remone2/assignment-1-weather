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

function handleWeatherData(data) {
  let weatherDiv = document.getElementsByClassName("current-conditions")[0];
  data.weather.forEach((detail) => {
    weatherDiv.insertAdjacentHTML(
      "beforeend",
      `
    <h2>Current Conditions</h2>
        <img src="http://openweathermap.org/img/wn/${detail.icon}@2x.png" />
        <div class="current">
          <div class="temp">${convertTemp(data.main.temp).toFixed(0)}℃</div>
          <div class="condition">${detail.main}</div>
        </div>
    `
    );
  });
}

function handleForecastData(data) {
  let forecastDiv = document.getElementsByClassName("forecast")[0];
  for (let i = 0; i < 40; i += 8) {
    console.log(data.list[i]);
    forecastDiv.insertAdjacentHTML(
      "beforeend",
      `
    <div class="day">
          <h3>${week[new Date(data.list[i].dt_txt).getDay()]}</h3>
          <img src="http://openweathermap.org/img/wn/${
            data.list[i].weather[0].icon
          }@2x.png" />
          <div class="description">${data.list[i].weather[0].description}</div>
          <div class="temp">
            <span class="high">${convertTemp(
              data.list[i].main.temp_max
            ).toFixed(0)}℃</span>/<span class="low">${convertTemp(
        data.list[i].main.temp_min
      ).toFixed(0)}℃</span>
          </div>
        </div>
    `
    );
  }
}
