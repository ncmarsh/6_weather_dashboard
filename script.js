$(document).ready(function() {
    const cityEl = $(".city");
    const tempEl = $(".temp");
    const humidityEl = $(".humidity");
    const windEl = $(".wind");
    const uvIndexEl = $(".uv-index");

    // let cityInputEl = $("#search-field").val();
    let cityInputEl = "Seattle";
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=cda0734d46f3ec29600ebac5178a0156&q=" + cityInputEl;

    // WHEN I search for a city
    $.ajax({
        url: queryURL,
        method: "GET"
        // THEN I am presented with current and future conditions for that city and that city is added to the search history
    }).then(function(response) {
        console.log(response);

        let kelvinTemp = response.main.temp;
        let fahrenheitTemp = (kelvinTemp - 273.15) * 1.80 + 32;

        cityEl.text(response.name);
        // add degree symbol
        tempEl.text("Temperature: " + fahrenheitTemp + " F");
        humidityEl.text("Humidity: " + response.main.humidity + " %");
        // If I can switch it to imperial then it will be mph
        windEl.text("Wind Speed: " + response.wind.speed + " m/s");
        // uvIndexEl.text("UV Index: " + response.)
        
    })



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




})