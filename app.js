document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "5HkzQuJ6pAxHcBLrMtc9CAc8k4ifysiO"; // Replace with your actual API key
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
                    fetchCurrentWeather(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
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

    function displayCurrentWeather(currentWeather) {
        const currentContent = `
            <h2>Current Weather</h2>
            <div class="forecast-item">
                <strong>${currentWeather.LocalObservationDateTime}</strong><br>
                <img src="https://developer.accuweather.com/sites/default/files/${currentWeather.WeatherIcon < 10 ? '0' : ''}${currentWeather.WeatherIcon}-s.png" alt="${currentWeather.WeatherText}" class="forecast-icon"><br>
                Temperature: ${currentWeather.Temperature.Metric.Value}°C<br>
                ${currentWeather.WeatherText}
            </div>`;
        
        // Add the current weather content at the top
        forecastDiv.innerHTML = currentContent + '<hr>' + forecastDiv.innerHTML;
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

    function displayDailyForecast(dailyForecasts) {
        let dailyContent = `<h2>Daily Forecast</h2>`;
        dailyForecasts.forEach(forecast => {
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${forecast.Day.Icon < 10 ? '0' : ''}${forecast.Day.Icon}-s.png`;
            dailyContent += `
                <div class="forecast-item">
                    <strong>${new Date(forecast.Date).toLocaleDateString()}</strong><br>
                    <img src="${iconUrl}" alt="${forecast.Day.IconPhrase}" class="forecast-icon"><br>
                    Max: ${forecast.Temperature.Maximum.Value}°C<br>
                    Min: ${forecast.Temperature.Minimum.Value}°C<br>
                    ${forecast.Day.IconPhrase}
                </div>`;
        });
        forecastDiv.innerHTML += '<hr>' + dailyContent;
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

    function displayHourlyForecast(hourlyForecasts) {
        let hourlyContent = `<h2>Hourly Forecast</h2>`;
        hourlyForecasts.forEach(forecast => {
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${forecast.WeatherIcon < 10 ? '0' : ''}${forecast.WeatherIcon}-s.png`;
            hourlyContent += `
                <div class="forecast-item">
                    <strong>${new Date(forecast.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><br>
                    <img src="${iconUrl}" alt="${forecast.IconPhrase}" class="forecast-icon"><br>
                    Temp: ${forecast.Temperature.Value}°C<br>
                    ${forecast.IconPhrase}
                </div>`;
        });
        forecastDiv.innerHTML += '<hr>' + hourlyContent;
    }
});
