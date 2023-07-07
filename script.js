let apiKey = "baf15f814713odta8a4baa99ed0733e5";
let time = document.querySelector("h2");
let city = document.querySelector("h1");
let form = document.querySelector("form");
let description = document.querySelector("h3");
let humidity = document.querySelector("span.current-humidity");
let wind = document.querySelector("span.current-wind");
let animation = document.querySelector("lottie-player");
let temperature = document.querySelector(".temperature");
let feelsLikeTemperature = document.querySelector("#feels");
let myLocation = document.querySelector("button");
let forecastElement = document.querySelector("#forecast");

let weatherAnimations = {
  "thunderstorm-day": "https://assets2.lottiefiles.com/temp/lf20_XkF78Y.json",
  "thunderstorm-night": "https://assets7.lottiefiles.com/temp/lf20_XkF78Y.json",
  "snow-day": "https://assets7.lottiefiles.com/temp/lf20_WtPCZs.json",
  "snow-night": "https://assets7.lottiefiles.com/temp/lf20_WtPCZs.json",
  "mist-day": "https://assets2.lottiefiles.com/temp/lf20_kOfPKE.json",
  "mist-night": "https://assets9.lottiefiles.com/temp/lf20_kOfPKE.json",
  "few-clouds-day":
    "https://assets6.lottiefiles.com/packages/lf20_64okjrr7.json",
  "few-clouds-night": "https://assets2.lottiefiles.com/temp/lf20_Jj2Qzq.json",
  "scattered-clouds-day":
    "https://assets6.lottiefiles.com/packages/lf20_64okjrr7.json",
  "scattered-clouds-night":
    "https://assets6.lottiefiles.com/packages/lf20_64okjrr7.json",
  "broken-clouds-day": "https://assets3.lottiefiles.com/temp/lf20_VAmWRg.json",
  "broken-clouds-night":
    "https://assets3.lottiefiles.com/temp/lf20_VAmWRg.json",
  "shower-rain-day": "https://assets4.lottiefiles.com/temp/lf20_rpC1Rd.json",
  "shower-rain-night": "https://assets7.lottiefiles.com/temp/lf20_I5XMi9.json",
  "rain-day": "https://assets4.lottiefiles.com/temp/lf20_rpC1Rd.json",
  "rain-night": "https://assets4.lottiefiles.com/temp/lf20_rpC1Rd.json",
  "clear-sky-day": "https://assets8.lottiefiles.com/temp/lf20_Stdaec.json",
  "clear-sky-night": "https://assets8.lottiefiles.com/temp/lf20_y6mY2A.json",
};

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function search(city) {
  showCurrentWeather(city);
}
search("Leticia");

function formatDate(latitude, longitude) {
  let date = new Date();
  let offsetHours = -date.getTimezoneOffset() / 60;
  let geoApiKey = "b36ce1349b6d43c3900891cdc4c74d07";
  let url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${geoApiKey}`;
  axios.get(url).then(showTime);

  function showTime(response) {
    let local =
      response.data.results[0].timezone.offset_DST_seconds / 3600 - offsetHours;
    let adjustedTime = new Date(date.getTime() + local * 3600 * 1000);

    let hours = adjustedTime.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = adjustedTime.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    let day = days[adjustedTime.getDay()];
    time.innerHTML = `${day} ${hours}:${minutes}`;
  }
  return adjustedTime;
}
function formatDay(time) {
  let date = new Date(time * 1000);
  let day = date.getDay();

  return days[day];
}

function handleSubmit(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#search-input");
  searchedCity = searchedCity.value;
  search(searchedCity);
}
form.addEventListener("submit", handleSubmit);

function showCurrentWeather(searchedCity) {
  let url = `https://api.shecodes.io/weather/v1/current?query=${searchedCity}&key=${apiKey}&units=metric`;
  axios.get(url).then(showTodayWeather);
}

function showTodayWeather(response) {
  let location = response.data.country;
  showCityAndCountry();
  function showCityAndCountry() {
    if (location === undefined) {
      city.innerHTML = response.data.city;
    }
    if (location === response.data.city) {
      city.innerHTML = response.data.city;
    } else {
      city.innerHTML = `${response.data.city}, ${location}`;
    }
    if (location.length > 10) {
      city.style.fontSize = "22px";
    } else {
      city.style.fontSize = "32px";
    }
  }

  temperature.innerHTML = Math.round(response.data.temperature.current);
  feelsLikeTemperature.innerHTML = Math.round(
    response.data.temperature.feels_like
  );
  humidity.innerHTML = response.data.temperature.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  description.innerHTML = response.data.condition.description;
  changeAnimation();

  function changeAnimation() {
    animation.load(weatherAnimations[response.data.condition.icon]);
  }

  let latitude = response.data.coordinates.latitude;
  let longitude = response.data.coordinates.longitude;
  getForecast(latitude, longitude);
  formatDate(latitude, longitude);
}

function showWeatherInMyLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;
  axios.get(url).then(showTodayWeather);
  getForecast(latitude, longitude);
  formatDate(latitude, longitude);
}

function activateButton() {
  navigator.geolocation.getCurrentPosition(showWeatherInMyLocation);
}

myLocation.addEventListener("click", activateButton);

function getForecast(latitude, longitude) {
  let forecastURL = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;
  axios.get(forecastURL).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = `<div>`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div id="forecast">
      <div>
        <div>${formatDay(forecastDay.time)}</div>
        <img
          src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecastDay.condition.icon
          }.png"
          alt=""
          width="62"
        />
        <div>
        <strong>
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temperature.minimum
          )}°|</span>
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temperature.maximum
          )}°</span></strong>
        </div>
       
        </div>
    
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
