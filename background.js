chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    try {
        if (message.action === "sendLocation") {
            const location = message.location;

            if (Object.keys(location).length === 0) {
                console.warn('Received empty location object');
                return;
            }

            console.log("Received location data:", location);

            try {
                // Call fetchData function with the received location
                const weatherData = await fetchData(location);

                // You can do something with the weatherData if needed
                console.log("Fetched weather data:", weatherData);
            } catch (error) {
                console.error('Error fetching data in background script:', error);
            }
        } else if (message.action === "showWeather") {
            console.log("Received showWeather message");
            // Handle the "showWeather" action if needed
        } 
        }
        // ... other actions ...
     catch (error) {
        console.error('Error in background script:', error);
    }
});

// Rest of your code remains unchanged

// Function to fetch data using the received location
const fetchData = async (location) => {
    try {
        const API_key = 'ba1fd564c72ef841ce9f503e58434289';

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_key}`);
        const weatherData = await weatherResponse.json();

        // Send weatherData to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "updateWeather", weatherData });
        });

        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

// Helper function to get the active tab
const getActiveTab = () => {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs && tabs.length > 0 ? tabs[0] : null);
        });
    });
};
