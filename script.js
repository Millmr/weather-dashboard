var cities = [];

//make variables that connect with the HTML selectors
var cityForm = document.querySelector("#city-search-form");
var cityInput = document.querySelector("#city");
var weatherContainer = document.querySelector("#current-weather-container");
var citySearchInput = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-container");
var pastSearchButton = document.querySelector("#past-search-buttons");

var sumitHandler = function(event) {
    event.preventDefault();
    var city = cityInput.value.trim();
    if (city){
        getWeather(city);
        fiveDay(city)
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("please enter a City");
    }

    saveSearch();
    pastSearch(city);

}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};
//Make a city search function

var getWeather = function(city){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='+cityInput.value+'&appid=09d819b6cd8b7d5a398b8c59319dfe0f&units=imperial'
    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
            showWeather(data, city);
        });
    });
};

var showWeather = function(weather, searchCity){
    weatherContainer.textContent= "";
    citySearchInput.textContent=searchCity;

    //console.log(weather)

    var date = moment().format("dddd, MMM Do YYYY");
$("#current-weather-container").text(date);

    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInput.appendChild(weatherIcon);

    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"


    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    weatherContainer.appendChild(temperatureEl);

    weatherContainer.appendChild(humidityEl);

    
    weatherContainer.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    UvIndex(lat,lon);
    
}
//Make a function to get five day forcast.
var fiveDay = function(city) {
    var fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?q='+cityInput.value+'&appid=09d819b6cd8b7d5a398b8c59319dfe0f&units=imperial'
    console.log(fiveDayURL);

    fetch(fiveDayURL)
    .then(function(response){
        response.json().then(function(data){
            showFiveday(data,);
            
        });
    });
};

var showFiveday = function(weather){
    forecastContainer.textContent = "";
    forecastTitle.textContent = "5-Day Forecast;";


    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
        var dailyForecast = forecast[i];

        //console.log(dailyForecast);

    var foreCast=document.createElement("div");
    foreCast.classList = "card bg-primary text-light m-2";

    var forecastDate = document.createElement("h5")
    forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center"
    foreCast.appendChild(forecastDate);

    var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}@2x.png`);
        
        foreCast.appendChild(weatherIcon);

    var Temperature = document.createElement("span");
        Temperature.classList = "card-body text-center";
        Temperature.textContent = dailyForecast.main.temp + " °F";

        foreCast.appendChild(Temperature);

    var humidEl=document.createElement("span");
        humidEl.classList = "card-body text-center";
        humidEl.textContent = dailyForecast.main.humidity + "  %";

        foreCast.appendChild(humidEl);

        forecastContainer.appendChild(foreCast);
        };
};

var UvIndex = function(lat,lon){
    var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?lat='+lat+'&lon='+lon+'&appid=09d819b6cd8b7d5a398b8c59319dfe0f'
    fetch(uvURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
};

var displayUvIndex = function(index) {
    var uvIndexEl = document.createElement("dive");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "list-group-item";

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainer.appendChild(uvIndexEl);
}

var pastSearch = function(pastSearch){

    // console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchButton.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}





pastSearchButton.addEventListener("click", pastSearchHandler);
cityForm.addEventListener("submit", sumitHandler);