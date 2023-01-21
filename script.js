const API_KEY = `c2e18f24b7fbc0cf9bf60ec03435974e`
const form = document.querySelector("form")
const search = document.querySelector("#search")
const weather = document.querySelector("#weather")
const forecast_weather = document.querySelector("#forecast_weather")
    // const API = `https://api.openweathermap.org/data/2.5/weather?
    // q=${city}&appid=${API_KEY}&units=metric`
    // const IMG_URL = `https: //openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

const getCurrentWeather = async(city) => {
    weather.innerHTML = `<h2> Loading... <h2>`
    forecast_weather.innerHTML = `<h3> wait for response <h3>`
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
    if(z != -1 && z < 4) {
        if(tempMinMax[z].temp_min < forecastMinimumTemperature){
            tempMinMax[z].temp_min = forecastMinimumTemperature;
        }
        if(tempMinMax[z].temp_max > forecastMaximumTemperature){
            tempMinMax[z].temp_max = forecastMaximumTemperature;
        }
    }   
      x++; 
    });
    
    for(var i = 0; i < futuredays.length-1; i++){
        futuredays[i].temp_min = tempMinMax[i].temp_min;
        futuredays[i].temp_max = tempMinMax[i].temp_max;
    }
    
    return showWeather(current_weather_data, futuredays)
}

const showWeather = async(data, futuredays) => {
    if (data.cod == "404") {
        weather.innerHTML = `<h2> City Not Found <h2>`
        return;
    }
    weather.innerHTML = `
        <div>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
        </div>
        <div>
            <h2>${data.main.temp} ℃</h2>
            <h4> ${data.weather[0].main} </h4>
        </div>
    `
    
    var temp = "";
    forecast_weather.innerHTML = "";
//     console.log('futuredays', futuredays)
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
//     futuredays.forEach(function (item) {
//         console.log(item);
//     });
    
}

form.addEventListener(
    "submit",
    function(event) {
   
        
        getCurrentWeather(search.value)
        event.preventDefault();
    }
)

const swap = (a ,b) => {
    let temp = a;
    a = b;
    b = temp;
    return a, b;
}
const printDay = (dayNo) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayNo].slice(0, 3); // .slice(0, 3) fuction returns the first 3 letters of the day
}

// async function getForecast(city) {
//     const apiKey = "1b8a90e268d5683e6ad3135a65afb5f6";
//     const location = "New York";
//     const url = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
//     const response = await fetch(url);
//     const data = await response.json();
//     const forecast = data.list;
//     let x = 0;
//     var futuredays = [{},{},{},{},{}];
//     forecast.forEach(function (item) {
//       const forecastDate = new Date(item.dt * 1000);
//       const forecastMinimumTemperature = item.main.temp_min;
//       const forecastMaximumTemperature = item.main.temp_max;
//       const forecastWeather = item.weather[0].description;
//       const forecastIcon = item.weather[0].icon;
//     // prints the day of the week
//     //   console.log(`Forecast for ${printDay(forecastDate.getDay())}:`); 
//     //   console.log(`Minimum Temperature: ${forecastMinimumTemperature}°C`);
//     //   console.log(`Maximum Temperature: ${forecastMaximumTemperature}°C`);
//     //   console.log(`Weather: ${forecastWeather}`);
//     //   console.log(`Weather: ${forecastIcon}\n`);
//       var y = 0;
//       if((x % 8 == 0 && x != 0) || x > 38){
        
//         // setting the icon to day
//         if(forecastIcon[2] != "d"){
//             forecastIcon = forecastIcon.slice(0, 2) + "d";
//         }

//         // pushing values of 5 days into an array of objects
//         futuredays.push({
//             'day': printDay(forecastDate.getDay()),
//             'temp_min': forecastMinimumTemperature,
//             'temp_max': forecastMaximumTemperature,
//             'weather': forecastWeather,
//             'Icon': forecastIcon
//           });


//         y++;    
//       }
//       x++; 
//     });

    // futuredays.forEach(function (item) {
    //     console.log(item);
    // });
    
//     futuredays.forEach(function (item) {
       
//         temp = `<div>
//                     <h3>${item.day}</h3>
//                      <img src="https://openweathermap.org/img/wn/${item.forecastIcon}@2x.png" alt="img" />
//                     <div class="Temp">
//                         <h5>${item.temp_min}℃</h5>
//                         <h5>${item.temp_max}℃</h5>
//                     </div>
//                 </div>`
//         forecast_weather.innerHTML += temp; 
//     });
//   }

// getForecast(search.value);

//slice in javascript
// console.log("slice in javascript")
// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// console.log(arr.slice(0, 3))
// above code will print first 3 elements of the array
// console.log(date.getDay()) i.e 0 for sunday, 1 for monday and so on
// console.log(date.getDate())
// console.log(date.getMonth())
// accessing values in objects
// const obj = {
//     name: "Rahul",
//     age: 20,
//     city: "Delhi"
// }
// console.log(obj.name)



