document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "5HkzQuJ6pAxHcBLrMtc9CAc8k4ifysiO"; // Replace with your actual API key
    const aqiApiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your AQI API key
    const form = document.getElementById("cityForm");
    const forecastDiv = document.getElementById("forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    const latitude = data[0].GeoPosition.Latitude;
                    const longitude = data[0].GeoPosition.Longitude;

                    fetchCurrentWeather(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchAirQuality(latitude, longitude); // Fetch AQI
                } else {
                    forecastDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                forecastDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchCurrentWeather(locationKey) {
        const currentUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    forecastDiv.innerHTML += `<p>No current weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                forecastDiv.innerHTML += `<p>Error fetching current weather data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(dailyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    forecastDiv.innerHTML += `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                forecastDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(hourlyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    forecastDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                forecastDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchAirQuality(lat, lon) {
        const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${aqiApiKey}`;

        fetch(aqiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.list && data.list.length > 0) {
                    displayAirQuality(data.list[0].main.aqi);
                } else {
                    forecastDiv.innerHTML += `<p>No air quality data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching air quality data:", error);
                forecastDiv.innerHTML += `<p>Error fetching air quality data.</p>`;
            });
    }

    function displayCurrentWeather(currentWeather) {
        const currentContent = `
            <div class="forecast-section">
                <h2>Current Weather</h2>
                <div class="forecast-item">
                    <img src="https://developer.accuweather.com/sites/default/files/${currentWeather.WeatherIcon < 10 ? '0' : ''}${currentWeather.WeatherIcon}-s.png" alt="${currentWeather.WeatherText}" class="forecast-icon">
                    <div class="forecast-details">
                        <strong>${currentWeather.LocalObservationDateTime}</strong>
                        <span>Temperature: ${currentWeather.Temperature.Metric.Value}°C</span>
                        <span>${currentWeather.WeatherText}</span>
                    </div>
                </div>
            </div>`;
        
        forecastDiv.innerHTML = currentContent + forecastDiv.innerHTML;
    }

    function displayDailyForecast(dailyForecasts) {
        let dailyContent = `<div class="forecast-section"><h2>Daily Forecast</h2>`;
        dailyForecasts.forEach(forecast => {
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${forecast.Day.Icon < 10 ? '0' : ''}${forecast.Day.Icon}-s.png`;
            dailyContent += `
                <div class="forecast-item">
                    <img src="${iconUrl}" alt="${forecast.Day.IconPhrase}" class="forecast-icon">
                    <div class="forecast-details">
                        <strong>${new Date(forecast.Date).toLocaleDateString()}</strong>
                        <span>Max: ${forecast.Temperature.Maximum.Value}°C</span>
                        <span>Min: ${forecast.Temperature.Minimum.Value}°C</span>
                        <span>${forecast.Day.IconPhrase}</span>
                    </div>
                </div>`;
        });
        dailyContent += '</div>';
        forecastDiv.innerHTML += dailyContent;
    }

    function displayHourlyForecast(hourlyForecasts) {
        let hourlyContent = `<div class="forecast-section"><h2>Hourly Forecast</h2>`;
        hourlyForecasts.forEach(forecast => {
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${forecast.WeatherIcon < 10 ? '0' : ''}${forecast.WeatherIcon}-s.png`;
            hourlyContent += `
                <div class="forecast-item">
                    <img src="${iconUrl}" alt="${forecast.IconPhrase}" class="forecast-icon">
                    <div class="forecast-details">
                        <strong>${new Date(forecast.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                        <span>Temp: ${forecast.Temperature.Value}°C</span>
                        <span>${forecast.IconPhrase}</span>
                    </div>
                </div>`;
        });
        hourlyContent += '</div>';
        forecastDiv.innerHTML += hourlyContent;
    }

    function displayAirQuality(aqi) {
        const aqiContent = `
            <div class="forecast-section">
                <h2>Air Quality Index (AQI)</h2>
                <div class="forecast-item">
                    <strong>AQI: ${aqi}</strong>
                    <span>Category: ${getAqiCategory(aqi)}</span>
                </div>
            </div>`;
        forecastDiv.innerHTML += aqiContent;
    }

    function getAqiCategory(aqi) {
        switch (aqi) {
            case 1:
                return 'Good';
            case 2:
                return 'Fair';
            case 3:
                return 'Moderate';
            case 4:
                return 'Poor';
            case 5:
                return 'Very Poor';
            default:
                return 'Unknown';
        }
    }
});
