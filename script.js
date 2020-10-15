$(document).ready(function() {
    const dateEl = moment().format("l");
    const cityEl = $(".city");
    const tempEl = $(".temp");
    const humidityEl = $(".humidity");
    const windEl = $(".wind");
    const uvIndexEl = $(".uv-index");

    let searchedCitiesArr = JSON.parse(localStorage.getItem("cities-searched")) || [];

    // Function to search for the current weather of the city and display results in main section
    function citySearch(input) {
        let apiKey = "cda0734d46f3ec29600ebac5178a0156";
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + input;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);

            // Function to find UV index based off the lat/long of the returned user input
            findUVIndex(response);

            let weatherIcon = response.weather[0].icon;
            let iconLink = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");
            
            // Formula to convert Kelvin into Fahrenheit
            let kelvinTemp = response.main.temp;
            let fahrenheitTemp = (kelvinTemp - 273.15) * 1.80 + 32;

            // Formula to convert m/s to mph
            let meterSpeed = response.wind.speed;
            let mphSpeed = meterSpeed * 2.237;

            $("#current-weather").attr("class", "card");
            
            cityEl.text(response.name + " " + "(" + dateEl + ")");
            cityEl.append(iconLink);
            
            tempEl.html("Temperature: " + fahrenheitTemp.toFixed(1) + " &deg;F");
            humidityEl.text("Humidity: " + response.main.humidity + "%");
            windEl.text("Wind Speed: " + mphSpeed.toFixed(1) + " MPH");
        })
    };

    // Function to search for the forecast of the city and display results
    function forecast(input) {
        let apiKey = "cda0734d46f3ec29600ebac5178a0156";
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey + "&q=" + input;

        $.ajax({
            url: forecastURL,
            method: "GET"
            
        }).then(function(response) {
            console.log(response);

            console.log(response.list[0].main.temp);
            console.log(response.list[0].main.humidity);

            $("#forecast-group").text("");

            for (let i = 0; i < 5; i++) {
                let weatherIcon = response.list[i].weather[0].icon;
                let iconLink = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");

                // Formula to convert Kelvin into Fahrenheit
                let kelvinTemp = response.list[i].main.temp;
                let fahrenheitTemp = (kelvinTemp - 273.15) * 1.80 + 32;

                let forecastDivEl = $("<div>");

                let forecastDateEl = $("<div>").text(moment().add(i + 1, "days").format("l"));
                let forecastTempEl = $("<div>").html("Temp: " + fahrenheitTemp.toFixed(2) + " &deg;F");
                let forecastHumidityEl = $("<div>").text("Humidity: " + response.list[i].main.humidity + " %");
                
                forecastDivEl.attr("class", "card forecast");
                iconLink.attr("class", "forecast-icon");

                $("#future-forecast").text("5 Day Forecast:");

                $("#forecast-group").append(forecastDivEl);
                forecastDivEl.append(forecastDateEl);
                forecastDivEl.append(iconLink);
                forecastDivEl.append(forecastTempEl);
                forecastDivEl.append(forecastHumidityEl);
            }
        })
    };

    // Function to find UV index based off the lat/long of the returned user input
    function findUVIndex(response) {
        let apiKey = "cda0734d46f3ec29600ebac5178a0156";
        let cityLong = response.coord.lon;
        let cityLat = response.coord.lat;
        let uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLong + "&appid=" + apiKey;
    
        $.ajax({
            url: uvIndexURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);

            let uvIndex = response.value;
            console.log(uvIndex);

            $("#uv-rating").text(uvIndex);

            // If else statement to determine level of uv index and add associated styling
            if (uvIndex >= 0 && uvIndex <= 2) {
                $("#uv-rating").removeClass().addClass("uv-index uv-low");
            } else if (uvIndex > 2 && uvIndex <= 5) {
                $("#uv-rating").removeClass().addClass("uv-index uv-medium");
            } else if (uvIndex > 5 && uvIndex <= 7) {
                $("#uv-rating").removeClass().addClass("uv-index uv-high");
            } else if (uvIndex > 7 && uvIndex <= 10) {
                $("#uv-rating").removeClass().addClass("uv-index uv-very-high");
            } else {
                $("#uv-rating").removeClass().addClass("uv-index uv-extreme");
            }
        })
    }
  
    // searchedCitiesArr is retrieved from localStorage and parsed into retrCities variable
    let retrCities = JSON.parse(localStorage.getItem("cities-searched"));
    console.log(retrCities);

    // If cities-searched are available
    if (retrCities === null) {
        console.log("null");
    } else {
        // Takes each object and creates buttons in the city tile column
        for (let i = 0; i < retrCities.length; i++) {
            let cityTileBtnEl = $("<button>").attr("class", "city-results-tile");
            
            cityTileBtnEl.text(retrCities[i].cityName).attr("id", retrCities[i].cityName);
            $("#city-tile").append(cityTileBtnEl);
        }
        
        // Takes the most recent city located in recent-search in localStorage and sets new variable
        let recentCity = localStorage.getItem("recent-search");
        // Then takes that most recent city and runs the citySearch function
        citySearch(recentCity);
        // And the 5 day forecast function
        forecast(recentCity);
    }

    // When a city is entered and the search button is clicked
    $("#search-button").on("click", function(event) {
        event.preventDefault();

        let cityInputEl = $("#search-field").val();
        let cityTileEl = $("#city-tile");

        console.log(cityInputEl);
        
        // Function for current weather
        citySearch(cityInputEl);
        // Function for 5 day forecast
        forecast(cityInputEl);

        let cityResultsDivEl = $("<button>").attr("class", "city-results-tile");

        cityResultsDivEl.text(cityInputEl).attr("id", cityInputEl);
        cityTileEl.append(cityResultsDivEl);

        // Sets each searched city to localStorage array
        searchedCitiesArr.push({cityName: cityInputEl});
        localStorage.setItem("cities-searched", JSON.stringify(searchedCitiesArr));

        // Sets the last searched city into separate localStorage object
        localStorage.setItem("recent-search", cityInputEl);

        // Clears search bar
        $("#search-field").val("");
    })

    // When a city tile is clicked, then we get info from local storage, then the search function will trigger again
    $(document).on("click", ".city-results-tile", function(event) {

        // Function for current weather
        citySearch(this.id);
        // Function for 5 day forecast
        forecast(this.id);

        // Sets the last searched city into localStorage
        localStorage.setItem("recent-search", this.id);
    })
})





// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast