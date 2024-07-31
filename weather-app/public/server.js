const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const apiKey = 'YOUR_ACCUWEATHER_API_KEY';

// Fetch current weather with alerts
app.get('/weather/alerts', async (req, res) => {
    const { locationKey } = req.query;

    try {
        const response = await axios.get(`http://dataservice.accuweather.com/alerts/v1/${locationKey}?apikey=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather alerts:', error);
        res.status(500).json({ error: 'Error fetching weather alerts' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
