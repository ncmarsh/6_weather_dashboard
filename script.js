$(document).ready(function() {
    const dateEl = moment().format("l");
    const cityEl = $(".city");
    const tempEl = $(".temp");
    const humidityEl = $(".humidity");
    const windEl = $(".wind");
    const uvIndexEl = $(".uv-index");

    
    $("#search-button").on("click", function(event) {
        event.preventDefault();

        console.log("search");

        let cityInputEl = $("#search-field").val();
        let cityTileEl = $("#city-tile");

        console.log(cityInputEl);

        citySearch(cityInputEl);
        forecast(cityInputEl);

        let cityResultsDivEl = $("<div>").attr("class", "city-results-tile");

        cityResultsDivEl.text(cityInputEl);
        cityTileEl.append(cityResultsDivEl);
    })

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

            // Formula to convert Kelvin into Fahrenheit
            // let kelvinTemp = response.main.temp;
            // let fahrenheitTemp = (kelvinTemp - 273.15) * 1.80 + 32;

            // $("#forecast-group").text(response);

            console.log(response.list[0].main.temp);
            console.log(response.list[0].main.humidity);


            for (let i = 0; i < 5; i++) {
                let forecastDivEl = $("<div>");

                let forecastDateEl = $("<div>").text(moment().add(i + 1, "days").format("l"));
                let forecastTempEl = $("<div>").text("Temp: " + response.list[i].main.temp + " F");
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