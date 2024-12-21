const apiKey = "7eb0da41b19c410c4e385b20a42d4509"; // Masukkan API key dari OpenWeatherMap

// Fungsi untuk mendapatkan kualitas udara berdasarkan kota
async function getAirQuality() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Dapatkan koordinat kota menggunakan Current Weather API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert("City not found");
      return;
    }

    const { lat, lon } = weatherData.coord;

    // Dapatkan data kualitas udara menggunakan Air Pollution API
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const airQualityResponse = await fetch(airQualityUrl);
    const airQualityData = await airQualityResponse.json();

    // Proses data AQI dan tampilkan ke halaman
    displayAirQuality(airQualityData, city);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("An error occurred while fetching data");
  }
}

// Fungsi untuk menampilkan hasil AQI di halaman
function displayAirQuality(data, city) {
  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <h2>Air Quality in ${city}</h2>
    <p><span>AQI Level:</span> ${aqi} (${getAQIDescription(aqi)})</p>
    <p><span>PM2.5:</span> ${components.pm2_5} µg/m³</p>
    <p><span>PM10:</span> ${components.pm10} µg/m³</p>
    <p><span>CO:</span> ${components.co} µg/m³</p>
    <p><span>NO2:</span> ${components.no2} µg/m³</p>
    <p><span>O3:</span> ${components.o3} µg/m³</p>
  `;
}

// Fungsi untuk mendapatkan deskripsi dari AQI
function getAQIDescription(aqi) {
  switch (aqi) {
    case 1:
      return "Good";
    case 2:
      return "Fair";
    case 3:
      return "Moderate";
    case 4:
      return "Poor";
    case 5:
      return "Very Poor";
    default:
      return "Unknown";
  }
}
