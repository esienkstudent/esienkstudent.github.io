document.getElementById('nameForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const nameInput = document.getElementById('nameInput');
    localStorage.setItem('name', nameInput.value);
    displayWelcomeMessage();
});

async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current_weather=true');
        const data = await response.json();
        const weatherDescription = mapWeatherCodeToDescription(data.current_weather.weathercode);
        return weatherDescription;
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function mapWeatherCodeToDescription(code) {
    const weatherDescriptions = {
        0: 'clear sky',
        1: 'mainly clear',
        2: 'partly cloudy',
        3: 'overcast',
        45: 'fog'
    };
    return weatherDescriptions[code] || 'unknown';
}

function displayWelcomeMessage() {
    const name = localStorage.getItem('name');
    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: true });
    const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });

    fetchWeather().then(weatherDescription => {
        const greeting = name ? `Good morning ${name}!` : 'Good morning!';

        const lastVisit = localStorage.getItem('lastVisit');
        let lastVisitMessage = '';
        if (lastVisit) {
            const lastVisitTime = new Date(lastVisit);
            const lastVisitTimeFormatted = lastVisitTime.toLocaleString('en-US', { timeZone: 'America/New_York' });
            lastVisitMessage = ` Good to see you again! Last I saw you was on ${lastVisitTimeFormatted}.`;
        }

        document.getElementById('welcomeMessage').textContent = `${greeting} It's ${time} EST on ${date}, and it's ${weatherDescription} right now so make sure to dress accordingly.${lastVisitMessage}`;

        localStorage.setItem('lastVisit', new Date().toISOString());
    });
}

window.onload = displayWelcomeMessage;
