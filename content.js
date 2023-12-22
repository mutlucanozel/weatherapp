const createWeatherButton = () => {
  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    top: "680px",
    right: "60px",
    display: "flex",
    alignItems: "center",
    zIndex: "9999",
  });

  const updateDateDiv = document.createElement("div");
  updateDateDiv.id = "updateTime";
  updateDateDiv.style.color = "#4CAF50";
  updateDateDiv.style.fontSize = "14px";
  updateDateDiv.style.marginTop = "5px";
  document.getElementById("weatherApp").appendChild(updateDateDiv);

  const updateUpdateTime = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    updateDateDiv.textContent = `Last Update: ${formattedDate}`;
    updateDateDiv.style.color = 'black'; // Corrected line
    updateDateDiv.style.textAlign = 'right';
    updateDateDiv.style.marginRight = '5px';
    updateDateDiv.style.fontSize = '12px';
  };

  // Make the weather app draggable
  let offsetX, offsetY;
  const weatherInfo = document.querySelector(".weather-info");

  weatherInfo.addEventListener("mousedown", (e) => {
    e.preventDefault();
    offsetX = e.clientX - parseFloat(window.getComputedStyle(document.getElementById("weatherApp")).left);
    offsetY = e.clientY - parseFloat(window.getComputedStyle(document.getElementById("weatherApp")).top);

    const dragMove = (e) => {
      document.getElementById("weatherApp").style.left = (e.clientX - offsetX) + "px";
      document.getElementById("weatherApp").style.top = (e.clientY - offsetY) + "px";
    };

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", dragMove);
    });
  });

  const button = document.createElement("button");
  Object.assign(button.style, {
    id: "weatherButton",
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  });

  const icon = document.createElement("i");
  Object.assign(icon, {
    className: "fas fa-cloud-sun",
    style: "font-size: 30px",
  });

  button.appendChild(icon);
  container.appendChild(button);
  document.body.appendChild(container); 

  const onClickHandler = () => {
    const weatherApp = document.getElementById("weatherApp");

    if (weatherApp.style.display === "none") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          chrome.runtime.sendMessage({ action: "sendLocation", location });
          console.log("Button pressed");
          weatherApp.style.display = "block";
          updateUpdateTime(); // Update the time when weather app is displayed
        },
        (error) => {
          console.error('Coğrafi konum alınamadı:', error.message);
          chrome.runtime.sendMessage({ action: "geolocationError", message: error.message });
        }
      );
    } else {
      weatherApp.style.display = "none";
    }
  };

  button.addEventListener("click", onClickHandler);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === button) {
          button.removeEventListener("click", onClickHandler);
          observer.disconnect();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true });
};

const updateWeatherInHTML = (weatherData) => {
  if (!weatherData || !weatherData.name || !weatherData.sys || !weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
    console.error("Invalid or incomplete weather data:", weatherData);
    return;
  }

  const elements = {
    location: document.getElementById("text_location"),
    country: document.getElementById("text_location_country"),
    temp: document.getElementById("text_temp"),
    feelsLike: document.getElementById("text_feelslike"),
    desc: document.getElementById("text_desc"),
    icon: document.getElementById("icon"),
  };

  elements.location.textContent = weatherData.name;
  elements.country.textContent = `, ${weatherData.sys.country}`;
  elements.temp.textContent = weatherData.main.temp;
  elements.feelsLike.textContent = weatherData.main.feels_like;
  elements.desc.textContent = weatherData.weather[0].description;

  elements.icon.src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

  const weatherInfoContainer = document.getElementById("weatherInfo");
  weatherInfoContainer.style.display = "block";
};

const initialGeolocationRequest = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      chrome.runtime.sendMessage({ action: "sendLocation", location });
      createWeatherButton();
    },
    (error) => {
      console.error('Coğrafi konum alınamadı:', error.message);
      chrome.runtime.sendMessage({ action: "geolocationError", message: error.message });
    }
  );
};

initialGeolocationRequest();
  
  document.body.insertAdjacentHTML('beforeend', `
  <!DOCTYPE html>
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap">
      <title>Weather App</title>
      <style>
          body {
              font-family: 'Roboto', sans-serif;
              background-color: #f0f5fc; /* Light blue background */
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
  
          .weather-app {
              height:300px;
              width: 250px;
              position: fixed;
              top: 40px;
              right: 20px;
              display: flex;
              flex-direction: column;
              border-radius: 10px;
              border: 1px solid #3498db; /* Border color */
              background: #ecf0f1; /* Background color */
              opacity: 0.9;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              z-index: 10000;
              color: #34495e; /* Text color */
              user-select: none;
          }
  
          #weatherButton {
              position: fixed;
              top: 700px;
              right: 40px;
              background-color: #3498db; /* Button background color */
              color: #fff;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              transition: background-color 0.3s ease;
              z-index: 9999; /* Set a high z-index to ensure the button stays on top */
          }
  
          #weatherButton:hover {
              background-color: #2980b9; /* Darker blue on hover */
          }
  
          .p,
          .p sup {
              font-size: 15px;
              color: #34495e; /* Text color */
              letter-spacing: 0.05rem;
              margin-bottom: 5px;
          }
  
          .p sup {
              font-size: 10px;
          }
  
          .weather-info {
              padding: 15px;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              letter-spacing: 0.05rem;
              cursor: grab;
          }
  
          .location header {
              display: flex;
              justify-content: space-between; /* Align elements to the right */
              align-items: center; /* Center vertically */
              margin-bottom: 10px; /* Add margin for spacing */
          }
  
          .location span {
              font-size: 1.7em;
              font-weight: bold;
          }
  
          .location sup {
              height: 2.4em;
              padding: 0.2rem 0.6rem;
              margin-left: 0.2rem;
              border-radius: 5px;
              color: #fff;
              background: #3498db; /* Highlight background color */
          }
  
          #text_location {
              font-size: 24px;
              letter-spacing: 0.05rem;
              font-weight: bold;
          }
  
          #text_location_country {
              font-size: 12px;
          }
  
          #text_temp,
          #text_feelslike {
              font-size: 12px;
              letter-spacing: 0.05rem;
          }
  
          #text_temp sup,
          #text_feelslike sup {
              font-size: 12px;
              letter-spacing: 0.05rem;
          }
  
          #text_desc {
              margin-top: 10px;
              font-size: 16px;
              letter-spacing: 0.05rem;
              text-transform: capitalize;
              height: 2.4em;
              padding: 0.2rem 0.6rem;
              margin-left: 0.2rem;
              border-radius: 10px;
              color: #3498db;
          }
  
          #icon {
              width: 60px;
              height: 60px;
              margin-top: 15px;
          }
      </style>
  </head>
  
  <body>
  
      <div class="weather-app" id="weatherApp" style="display: none;">
          <div class="weather-info" id="weatherInfo">
  
              <div class="location" id="locationScreen">
                  <h1 id="text_location"></h1>
                  <sup id="text_location_country"></sup>
              </div>
  
              <div class="p" id="temperatureScreen">
                  <span>Temperature: </span>
                  <span id="text_temp"></span>
                  <sup>°C</sup>
              </div>
  
              <div class="p" id="feelsLikeScreen">
                  <span>Feels like: </span>
                  <span id="text_feelslike"></span>
                  <sup>°C</sup>
              </div>
  
              <img id="icon" alt="Weather Icon">
  
              <div class="p3" id="text_desc"></div>
  
          </div>
  
          <script src="background.js"></script>
  </body>
  
  </html>
  

  `);


  document.addEventListener('DOMContentLoaded', () => {
    initialGeolocationRequest();
  });
  

  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateWeather") {
      updateWeatherInHTML(message.weatherData);
    }
  });