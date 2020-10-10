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
            
            // Formula to convert Kelvin into Fahrenheit
            let kelvinTemp = response.main.temp;
            let fahrenheitTemp = (kelvinTemp - 273.15) * 1.80 + 32;

            let meterSpeed = response.wind.speed;
            let mphSpeed = meterSpeed * 2.237;

            $("#current-weather").attr("class", "card");
    
            cityEl.text(response.name + " " + "(" + dateEl + ")");
            // add degree symbol
            tempEl.text("Temperature: " + fahrenheitTemp.toFixed(1) + " F");
            humidityEl.text("Humidity: " + response.main.humidity + "%");
            // If I can switch it to imperial then it will be mph
            windEl.text("Wind Speed: " + mphSpeed.toFixed(1) + " MPH");
            // uvIndexEl.text("UV Index: " + response.)
        })
    };

    // Function to search for the forecast of the city and display results
    function forecast(input) {
        let apiKey = "cda0734d46f3ec29600ebac5178a0156";
        let queryURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + apiKey + "&q=" + input;

        $.ajax({
            url: queryURL,
            method: "GET"
            
        }).then(function(response) {
            console.log(response);

            console.log(response.list[0].main.temp);
            console.log(response.list[0].main.humidity);

            $("#forecast-group").text("");

            for (let i = 0; i < 5; i++) {
                // Formula to convert Kelvin into Fahrenheit
                let kelvinTemp = response.list[i].main.temp;
                let fahrenheitTemp = (kelvinTemp - 273.15) * 1.80 + 32;

                let forecastDivEl = $("<div>");

                let forecastDateEl = $("<div>").text(moment().add(i + 1, "days").format("l"));
                let forecastTempEl = $("<div>").text("Temp: " + fahrenheitTemp.toFixed(2) + " F");
                let forecastHumidityEl = $("<div>").text("Humidity: " + response.list[i].main.humidity + " %");
                
                forecastDivEl.attr("class", "card forecast");

                $("#future-forecast").text("5 Day Forecast:");

                $("#forecast-group").append(forecastDivEl);
                forecastDivEl.append(forecastDateEl);
                forecastDivEl.append(forecastTempEl);
                forecastDivEl.append(forecastHumidityEl);
            }
        })
    };

    // If the high score list is available, then the scoreStoreArr is retrieved from local storage
    // Take scores from local storage, store as retrScores variable
    let retrCities = JSON.parse(localStorage.getItem("cities-searched"));
    console.log(retrCities);

    // If scores are available, they will be sorted by highest to lowest
    if (retrCities === null) {
        console.log("null");
    } else {
        // Takes each object and creates buttons
        for (let i = 0; i < retrCities.length; i++) {
            let cityTileBtnEl = $("<button>").attr("class", "city-results-tile");
            
            cityTileBtnEl.text(retrCities[i].cityName).attr("id", retrCities[i].cityName);
            $("#city-tile").append(cityTileBtnEl);
        }
    }


    // When a city is entered and the search button is clicked
    $("#search-button").on("click", function(event) {
        event.preventDefault();

        let cityInputEl = $("#search-field").val();
        let cityTileEl = $("#city-tile");

        console.log(cityInputEl);
        
        // Function to search for the current weather
        citySearch(cityInputEl);
        // Function to search for the 5 day forecast
        forecast(cityInputEl);

        let cityResultsDivEl = $("<button>").attr("class", "city-results-tile");

        cityResultsDivEl.text(cityInputEl).attr("id", cityInputEl);
        cityTileEl.append(cityResultsDivEl);

        searchedCitiesArr.push({cityName: cityInputEl});
        localStorage.setItem("cities-searched", JSON.stringify(searchedCitiesArr));

        $("#search-field").val("");
    })

    // When a city tile is clicked, then we get info from local storage, then the search function will trigger again
    $(document).on("click", ".city-results-tile", function(event) {

        citySearch(this.id);
        forecast(this.id);
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