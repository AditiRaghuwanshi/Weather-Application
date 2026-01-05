
let fetchCity = document.getElementById("cityname");
const DEFAULT_CITY = "Indore";


document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cityFromUrl = urlParams.get("city");
  if (cityFromUrl && cityFromUrl.trim().length > 0) {
    fetchCity.value = cityFromUrl;
    getWeather(cityFromUrl);
  } else {
    
    fetchCity.value = DEFAULT_CITY;
    getWeather(DEFAULT_CITY);
  }

  renderHistoryChips();
});

fetchCity.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    let cityName = fetchCity.value.trim();
    if (cityName.length > 0) {
      getWeather(cityName);
    }
  }
});

async function getWeather(cityName) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=acde36f80969c6701fd26f00e4c6614b&units=metric`
    );

    if (!response.ok) {
      alert("City not found!");
      return;
    }

    let weatherData = await response.json();

    // Save search history (using in-memory storage instead of localStorage)
    saveSearchHistory(cityName);

    // Update UI
    document.getElementById(
      "citycalled"
    ).innerText = `${weatherData.name}, ${weatherData.sys.country}`;

    document.getElementById(
      "datetime"
    ).innerText = `Date: ${new Date().toLocaleDateString()}`;

    document.getElementById(
      "temp-text"
    ).innerText = `${weatherData.main.temp} °C`;

    document.getElementById(
      "humidity"
    ).innerText = `Humidity: ${weatherData.main.humidity}%`;

    document.getElementById(
      "wind-speed"
    ).innerText = `Wind Speed: ${weatherData.wind.speed} km/h`;

    document.getElementById(
      "condition-txt"
    ).innerText = `${weatherData.weather[0].main}`;

    // Update background video
    updateVideo(weatherData.weather[0].main.toLowerCase());

    // Load Forecast Cards
    getForecast(cityName);
    window.history.pushState({}, "", `?city=${encodeURIComponent(cityName)}`);
  } catch (err) {
    console.log("Error fetching weather:", err);
  }
}

function updateVideo(condition) {
  let weatherVideoContainer = document.querySelector("#cloudy-weather");
  let videoUrl;

  switch (condition) {
    case "rain":
    case "drizzle":
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606014/lightRain_tozd8g.mp4";
      break;
    case "thunderstorm":
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606014/heavyRain_zyqbwa.mp4";
      break;
    case "clouds":
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606015/movingClouds_vbfkwz.mp4";
      break;
    case "clear":
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606013/cloudy_jl5vm4.mp4";
      break;
    case "snow":
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606044/snowflakes_oj37yc.mp4";
      break;
    case "mist":
    case "fog":
    case "haze":
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606014/foggy_sbpt8u.mp4";
      break;
    default:
      videoUrl = "https://res.cloudinary.com/dlaenlkon/video/upload/v1767606015/niceclouds_wpm7sj.mp4";
  }

  if (weatherVideoContainer) {
    // Replace the entire video element with proper attributes
    weatherVideoContainer.innerHTML = `
      <video src="${videoUrl}" 
             autoplay 
             muted 
             loop 
             class="w-[300px] lg:w-[550px] h-auto rounded-md lg:rounded-lg lg:shadow-xl">
      </video>
    ` + weatherVideoContainer.innerHTML.substring(weatherVideoContainer.innerHTML.indexOf('</video>') + 8);
    
    // Get the new video element and play it
    let newVideo = weatherVideoContainer.querySelector('video');
    if (newVideo) {
      newVideo.load();
      newVideo.play();
    }
  }
}

// In-memory storage for search history
let searchHistory = [];

function saveSearchHistory(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
  }
  renderHistoryChips();
}

function renderHistoryChips() {
  let container = document.getElementById("history-chips");
  container.innerHTML = "";

  searchHistory.forEach((city) => {
    let chip = document.createElement("button");
    chip.className =
      "px-4 lg:py-1 bg-blue-300/20 lg:bg-orange-300/40 text-white rounded-full whitespace-nowrap flex-shrink-0 hover:bg-blue-300/30 lg:hover:bg-orange-400/30";
    chip.innerText = city;

    chip.addEventListener("click", () => {
      fetchCity.value = city;
      getWeather(city);
    });

    container.appendChild(chip);
  });
}

document.getElementById("detect-location-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation not supported!");
  }
});

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  )
    .then((res) => res.json())
    .then((data) => {
      const city = data.city || data.locality || data.principalSubdivision;

      if (!city) {
        alert("Could not detect city");
        return;
      }

      fetchCity.value = city;
      getWeather(city);
    });
}

function error() {
  alert("Unable to access your location.");
}

async function getForecast(cityName) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=acde36f80969c6701fd26f00e4c6614b&units=metric`
  );

  let forecastData = await response.json();

  let dailyForecast = forecastData.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);

  let container = document.getElementById("cards-container");
  container.innerHTML = "";

  dailyForecast.forEach((item) => {
    let date = new Date(item.dt_txt);
    let dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    let cardHTML = `
      <div class="relative bg-blue-300/20 lg:bg-orange-300/40 border border-white/40 shadow-lg rounded-xl h-40 
                  flex-shrink-0 snap-center overflow-hidden
                  w-[200px] lg:w-[400px] md:w-[400px] flex items-center justify-center text-white">

        <div class="text-center">
          <div class="flex flex-row lg:justify-between items-center">
            <h3 class="lg:px-30 px-6">${dayName}</h3>
            <p class="lg:px-30 px-6">${item.main.temp}°C</p>
          </div>
          <p>${item.weather[0].main}</p>
          <p>Humidity: ${item.main.humidity}%</p>
          <p>Wind: ${item.wind.speed} km/h</p>
        </div>
      </div>
    `;

    container.innerHTML += cardHTML;
  });
}