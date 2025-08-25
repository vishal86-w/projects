
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) return alert("Please enter a city name.");
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    displayWeather(currentData);
    displayForecast(forecastData);
  } catch (error) {
    alert("Error fetching weather data. Please try again.");
    //console.error(error);
  }
}

function displayWeather(data) {
  document.getElementById('DisplayWeather').style.display = 'block';
  document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  document.getElementById('weatherMain').textContent = data.weather[0].main;
  document.getElementById('weatherDesc').textContent = data.weather[0].description;
  document.getElementById('temp').textContent = ` 🌡️Temperature: ${data.main.temp}°C`;
  document.getElementById('humidity').textContent = `💧Humidity: ${data.main.humidity}%`;
  document.getElementById('wind').textContent = ` 🍃Wind Speed: ${data.wind.speed} m/s`;
}

function displayForecast(forecastData) {
 
  const forecastContainer = document.getElementById('forecast-weather');
  forecastContainer.innerHTML = '';

  

  const dailyMap = {};

  forecastData.list.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0];
    if (!dailyMap[date]) dailyMap[date] = [];
    dailyMap[date].push(entry);
  });

  const days = Object.keys(dailyMap).slice(0, 5);


  days.forEach(date => {
    const entries = dailyMap[date];
    const temps = entries.map(e => e.main.temp);
    const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    const icon = entries[0].weather[0].icon;
    const desc = entries[0].weather[0].description;

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = 
    `
      <h5>${date}</h5>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
      <p>${desc}</p>
      <p><strong>${avgTemp}°C</strong></p>
    `;
    forecastContainer.appendChild(card);
  });
}
