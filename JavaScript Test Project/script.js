const wrapper = document.querySelector(".wrapper");
const inputPart = wrapper.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationButton = inputPart.querySelector("button");
const arrowBack = wrapper.querySelector("header i");
const weatherIcons = document.querySelector(".weather-part img");

let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value !== "") {
    requestApi(inputField.value);
  }
});

locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser does not support geolocation api");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=f0ace40ba31b8bfa3f78620123242039&lang={lang}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f0ace40ba31b8bfa3f78620123242039`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
    infoTxt.classList.replace("pending", "error");
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id === 800) {
      weatherIcons.src = "Assets/weather-app-icons/Weather Icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcons.src = "Assets/weather-app-icons/Weather Icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcons.src = "Assets/weather-app-icons/Weather Icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      weatherIcons.src = "Assets/weather-app-icons/Weather Icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcons.src = "Assets/weather-app-icons/Weather Icons/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcons.src = "Assets/weather-app-icons/Weather Icons/rain.svg";
    }

    wrapper.querySelector(".temp .number").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .number-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
