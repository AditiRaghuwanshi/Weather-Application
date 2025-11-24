let fetchCity = document.getElementById("cityname");

let city = fetchCity.addEventListener("keyup", async function () {
  let cityName = fetchCity.value;
  console.log("cityName:", cityName);
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=acde36f80969c6701fd26f00e4c6614b&units=metric`
  );
  let weatherData = await response.json();
  console.log("weatherData:", weatherData);

  document.getElementById(
    "citycalled"
  ).innerText = `${weatherData.name}, ${weatherData.sys.country}`;
  console.log("typedcity: ", weatherData.name);
  document.getElementById(
    "datetime"
  ).innerText = `Date: ${new Date().toLocaleDateString()}`;
  document.getElementById(
    "temp-text"
  ).innerText = `${weatherData.main.temp} °C`;
  document.getElementById(
    "humidity"
  ).innerText = `Humidity: ${weatherData.main.humidity} %`;
  document.getElementById(
    "wind-speed"
  ).innerHTML = `Wind Speed: ${weatherData.wind.speed} km/h`;
  document.getElementById(
    "condition-txt"
  ).innerText = `${weatherData.weather[0].main}`;

  // Change video based on current weather condition
  let currentCondition = weatherData.weather[0].main.toLowerCase();
  let videoFileName;

  switch(currentCondition) {
    case 'rain':
    case 'drizzle':
      videoFileName = 'lightRain.mp4';
      break;
    case 'thunderstorm':
      videoFileName = 'heavyRain.mp4';
      break;
    case 'clouds':
      videoFileName = 'movingClouds.mp4'; // or 'niceclouds.mp4'
      break;
    case 'clear':
      videoFileName = 'cloudy.mp4';
      break;
    case 'snow':
      videoFileName = 'snowflakes.mp4';
      break;
    case 'mist':
    case 'fog':
    case 'haze':
      videoFileName = 'foggy.mp4';
      break;
    default:
      videoFileName = 'niceclouds.mp4';
  }

  // Update the video source
  let weatherVideo = document.querySelector('#cloudy-weather video');
  if (weatherVideo) {
    weatherVideo.src = `../allVideos/${videoFileName}`;
    weatherVideo.load();
    weatherVideo.play();
  }

  getForecast(cityName);
});
console.log(fetchCity);
console.log("this is value", fetchCity.value);

async function getForecast(cityName) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=acde36f80969c6701fd26f00e4c6614b&units=metric`
  );
  let forecastData = await response.json();
  console.log("forecastData:", forecastData);

  let dailyForecast = forecastData.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);
  console.log("dailyForecast:", dailyForecast);

  document.getElementById("cards-container").innerHTML = "";

  for (let i = 0; i < dailyForecast.length; i++) {
    let date = new Date(dailyForecast[i].dt_txt);
    let dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    let temp = dailyForecast[i].main.temp;
    let humidity = dailyForecast[i].main.humidity;
    let condition = dailyForecast[i].weather[0].main;
    let descritption = dailyForecast[i].weather[0].description;
    let windSpeed = dailyForecast[i].wind.speed;

 

 // Text color
let textColor = "text-white";

let cardHTML = `
    <div class="relative bg-blue-300/20 lg:bg-orange-300/40 border border-white/40 shadow-lg rounded-xl h-40 
                flex-shrink-0 snap-center overflow-hidden
                w-[100px] md:w-[400px] flex items-center justify-center ${textColor}">
        
        <!-- Content layer -->
        <div class="relative z-10">
           
  <div class="text-center">
        <div class="flex flex-col lg:flex-row lg:justify-between items-center">
        <h3 class="px-30">${dayName}</h3>
        <p class="px-30">${temp}°C</p>
        </div>
         <p class="hidden lg:block">${descritption}</p>
        <p>${condition}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind: ${windSpeed} km/h</p>
      </div>
        </div>
        
    </div>
`;
cardHTML += "";
document.getElementById("cards-container").innerHTML += cardHTML;
    cardHTML += "";
    document.getElementById("cards-container").innerHTML += cardHTML;
  }
}