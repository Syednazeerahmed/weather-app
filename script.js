const API_KEY = `c2e18f24b7fbc0cf9bf60ec03435974e`
const form = document.querySelector("form")
const search = document.querySelector("#search")
const weather = document.querySelector("#weather")
const forecast_weather = document.querySelector("#forecast_weather")
    // const API = `https://api.openweathermap.org/data/2.5/weather?
    // q=${city}&appid=${API_KEY}&units=metric`
    // const IMG_URL = `https: //openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

// below function gets the current weather data and next 4 days weather forecast if the input/given city exists 
const getCurrentWeatherAndForecast = async(city) => {
    weather.innerHTML = `<h2> Loading... <h2>`
    // below line clears the forecast_weather div after any successful search
    forecast_weather.style.display = "none"

    const current_weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    const response = await fetch(current_weather_url);
    const current_weather_data = await response.json()
//     console.log('current finished')

    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const forecast_response = await fetch(forecast_url);
    const data = await forecast_response.json();
    const forecast = data.list;
//     console.log('forecast finished')
    let x = 0;
    var futuredays = [];
    var tempMinMax = [{temp_min: -100, temp_max: 100}, {temp_min: -100, temp_max: 100}, {temp_min: -100, temp_max: 100}, {temp_min: -100, temp_max: 100}, {temp_min: -100, temp_max: 100}];
    var dayVar = printDay(new Date(forecast[0].dt * 1000).getDay());
    // var dayVar2
    // console.log('dayVar', printDay(dayVar))
    var z = -1;
    forecast.forEach(function (item) {
      const forecastDate = new Date(item.dt * 1000);
      const forecastMinimumTemperature = item.main.temp_min;
      const forecastMaximumTemperature = item.main.temp_max;
      const forecastWeather = item.weather[0].description;
      var forecastIcon = item.weather[0].icon;
   
      var y = 0;
      if((x % 8 == 0 && x != 0) || x > 38){     
        // setting the icon to day
        if(forecastIcon[2] != "d"){
            forecastIcon = forecastIcon.slice(0, 2) + "d";
        }
        // pushing values of 5 days into an array of objects
        
        futuredays.push({
            'day': printDay(forecastDate.getDay()),
            // round off the temperature to whole number using Math.round()
            // 'temp_min': Math.round(forecastMinimumTemperature),
            // 'temp_max': Math.round(forecastMaximumTemperature),
            'temp_min': forecastMinimumTemperature,
            'temp_max': forecastMaximumTemperature,
            'weather': forecastWeather,
            'Icon': forecastIcon
          });
        y++;    

        if(dayVar != printDay(forecastDate.getDay())){
            z++;
            dayVar = printDay(forecastDate.getDay());
        }

    }   
    // below code stores minimum and maximum temperature forecast of next 4 days 
    if(z != -1 && z < 4) {
        tempMinMax[z].temp_min = Math.min(tempMinMax[z].temp_min, forecastMinimumTemperature); 
        tempMinMax[z].temp_max = Math.max(tempMinMax[z].temp_max, forecastMaximumTemperature);
    }   
      x++; 
    });
    // below code stores minimum and maximum temperature from "tempMinMax" object to "futuredays" object
    for(var i = 0; i < futuredays.length-1; i++){
        futuredays[i].temp_min = tempMinMax[i].temp_min;
        futuredays[i].temp_max = tempMinMax[i].temp_max;
    }
    
    return showWeather(current_weather_data, futuredays)
}

// below function displays weather info 
const showWeather = (data, futuredays) => {
    if (data.cod == "404") {
        weather.innerHTML = `<h2> City Not Found <h2>`
        return;
    }
    // below code displays the current weather
    weather.innerHTML = `
        <div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
        </div>
        <div>
            <h2>${data.main.temp} ℃</h2>
            <h4> ${data.weather[0].main} </h4>
        </div>
    `
    
    // below code displays maximum and minimum temperature and weather of next 4 days
    forecast_weather.style.display = "flex"
    var temp = "";
    var tempVar = 0;
    for(item of futuredays) {
        if(tempVar == 4){
           break;
        }
        temp =  `<div class="forecastDays">
                    <h3>${item.day}</h3>
                     <img src="https://openweathermap.org/img/wn/${item.Icon}@2x.png" alt="img" />
                    <div class="Temp">
                        <h5>${Math.round(item.temp_min)}℃</h5>
                        <h5>${Math.round(item.temp_max)}℃</h5>
                    </div>
                </div>`
        
        forecast_weather.innerHTML += temp; 
        tempVar++;
    }
}

form.addEventListener(
    "submit",
    function(event) {   
        getCurrentWeatherAndForecast(search.value)
        event.preventDefault();
    }
)


const printDay = (dayNo) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNo].slice(0, 3); // .slice(0, 3) fuction returns the first 3 letters of the day
}

