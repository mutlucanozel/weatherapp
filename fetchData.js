// fetchData.js
const API_key = 'ba1fd564c72ef841ce9f503e58434289';

const fetchData = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${API_key}`);
        const weatherData = await weatherResponse.json();

        const iconResponse = await fetch(`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`);
        const iconBlob = await iconResponse.blob();

        document.getElementById("text_location").innerHTML = weatherData.name;
        document.getElementById("text_location_country").innerHTML = weatherData.sys.country;
        document.getElementById("text_temp").innerHTML = Math.round(weatherData.main.temp);
        document.getElementById("text_feelslike").innerHTML = Math.round(weatherData.main.feels_like);
        document.getElementById("text_desc").innerHTML = weatherData.weather[0].description;

        const imageObjectURL = URL.createObjectURL(iconBlob);
        document.getElementById("icon").src = imageObjectURL;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Re-throw the error to be caught in the main script
    }
};


document.addEventListener("DOMContentLoaded", async function () {
    try {
        await fetchData();
        document.getElementById("loadingScreen").style.display = "none";
        document.getElementById("weatherInfo").style.display = "flex";

        document.getElementById("updateButton").addEventListener("click", async function () {
            // Check if the device is online before attempting to fetch data
            if (navigator.onLine) {
                document.getElementById("loadingScreen").style.display = "flex";
                document.getElementById("weatherInfo").style.display = "none";
                await fetchData();
                document.getElementById("loadingScreen").style.display = "none";
                document.getElementById("weatherInfo").style.display = "flex";
            } else {
                // The device is offline, display an error message
                displayErrorMessage("Unable to update. Please check your internet connection.");
            }
        });
        // Event listener for online and offline events
        window.addEventListener('online', () => handleConnectionStatus(true));
        window.addEventListener('offline', () => handleConnectionStatus(false));
    } catch (error) {
        console.error('Error in popup script:', error);
    }
});

const handleConnectionStatus = (isOnline) => {
    if (isOnline) {
        // The device is online, you can trigger actions or reset error messages here
    } else {
        // The device is offline, display an error message
        displayErrorMessage("You are currently offline. Please check your internet connection.");
    }
};

const displayErrorMessage = (message) => {
    // You can customize this function to display the error message in your UI
    alert(message);
};
// Export fetchData function to be used in other scripts