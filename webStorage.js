// Ключ для доступу до API сервісу погоди
const myApiKey = '82ebe216a170ac5071932602e444aa57';

// URL, за допомогою якого ми будемо запитувати погодні дані
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
// Ключ, за яким ми зберігаємо погодні дані у localStorage
const STORAGE_KEY = "weather_data";

// Отримуємо елементи форми
const cityInput = document.getElementById("city");
const submitButton = document.getElementById("submit");

// При натисканні на кнопку "Отримати погоду" викликаємо функцію getWeatherData()
submitButton.addEventListener("click", () => {
  const city = cityInput.value;
  getWeatherData(city);
});

// Функція, яка отримує погодні дані з API сервісу та відображає їх на сторінці
function getWeatherData(city = "") {
  // Видаляємо збережені дані, якщо час зберігання погодних даних перевищив дві години
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("last_request_time");

  // Отримуємо час останнього запиту до API
  const lastRequestTime = localStorage.getItem("last_request_time");
  // Отримуємо поточний час
  const currentTime = Date.now();
  // Обчислюємо різницю між поточним часом та часом останнього запиту до API
  const timeSinceLastRequest = currentTime - lastRequestTime;
  // Час, через який ми повинні знову запитувати погодні дані з API
  const TWO_HOURS_IN_MILLISECONDS = 2 * 60 * 60 * 1000;


  // Якщо ми ще не минули дві години з часу останнього запиту до API та маємо збережені погодні дані, то використовуємо їх
  if (lastRequestTime && timeSinceLastRequest <
    TWO_HOURS_IN_MILLISECONDS
  ) {
    // Отримуємо збережені погодні дані
    const weatherData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Виводимо погодні дані
    displayWeatherData(weatherData);
  }
  // Інакше отримуємо нові погодні дані з API
  else {
    const url =
      `${WEATHER_URL}?q=${city}&appid=${myApiKey}&units=metric`; // Формуємо URL для запиту погодніх даних з API
    fetch(url) // Відправляємо запит до API та отримуємо відповідь у форматі JSON
      .then((response) => response.json())
      .then((data) => {
        // Обробляємо отримані погодні дані
        const weatherData = {
          city: data.name,
          temperature: Math.round(data.main.temp),
          weatherStatus: data.weather[0].main,
          weatherIcon: data.weather[0].icon,
          description: data.weather[0].description,
        };
        // Зберігаємо погодні дані у localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(weatherData));
        // Зберігаємо час запиту до API у localStorage
        localStorage.setItem("last_request_time", currentTime);
        // Виводимо погодні дані
        displayWeatherData(weatherData);
      })
      .catch((error) => console.log(error));
  }
}

function displayWeatherData(weatherData) {
  // Деструктуризуємо об'єкт з погодними даними
  const {
    city,
    temperature,
    description,
    weatherIcon,
    weatherStatus
  } = weatherData;
  //Рядок HTML містить рядок з іменем міста, температурою та описом погоди, які беруться з об'єкта weatherData.
  const weatherDiv = `<div class="weather-details">
            <p class="city-name"> ${city}</p>
            <p class="city-temp"> ${temperature} &deg;C </p>
            <div class = "weather-icon">
            <img class="img" src = "http://openweathermap.org/img/w/${weatherIcon}.png"
            alt = "${weatherStatus}" >
            <p class="description"> ${description} </p>
            </div>
        </div>`;
  weather.innerHTML = weatherDiv;

}