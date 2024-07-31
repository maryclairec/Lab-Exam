import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeatherDisplay({ data }) {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            if (data && data.locationKey) {
                try {
                    const response = await axios.get(`http://localhost:5000/weather/alerts`, {
                        params: { locationKey: data.locationKey }
                    });
                    setAlerts(response.data);
                } catch (error) {
                    console.error('Error fetching weather alerts:', error);
                    setAlerts([]);
                }
            }
        };

        fetchAlerts();
    }, [data]);

    return (
        <div id="forecast">
            {/* Render current weather, daily forecast, and hourly forecast */}
            {alerts && alerts.length > 0 && (
                <div>
                    <h2>Weather Alerts</h2>
                    <ul>
                        {alerts.map((alert, index) => (
                            <li key={index}>
                                <strong>{alert.headline}</strong>
                                <p>{alert.description}</p>
                                <p><em>Expires: {new Date(alert.expires).toLocaleString()}</em></p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default WeatherDisplay;
