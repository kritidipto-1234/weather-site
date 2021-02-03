const city=document.querySelector('.city');
const country=document.querySelector('.country');
const date=document.querySelector('.date');
const temperature=document.querySelector('.temp');
const humidity=document.querySelector('.humidity');
const weather=document.querySelector('.weather');
const goBTN=document.querySelector('.go');
const input=document.querySelector('input');
const icon=document.querySelector('icon1');

//----------------------------------------------------------------------

function getLocationCoords()//returns a promise of latitudes and longitudes
{
    if (!navigator.geolocation)
        return Promise.reject('GeoLocation not supported in your browser');
    return new Promise(navigator.geolocation.getCurrentPosition.bind(navigator.geolocation));
}

async function setWeather(weatherData)//sets the dom elements with given weather data
{
    const p=await fetch(`https://restcountries.eu/rest/v2/alpha/${weatherData.sys.country}`);//fetching country name using country code
    if (!p.ok)
        throw new Error('Trouble fetching country name from country code');
    const {name:cntry}=await p.json();
    city.textContent=weatherData.name;
    country.textContent=cntry;
    temperature.textContent=weatherData.main.temp;
    humidity.textContent=weatherData.main.humidity;
    weather.textContent=weatherData.weather[0].description.toUpperCase();
}

async function getWeather(query)//fetches weather data based on query(and calls setWeather)
{
    const weatherResponse =await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=0155622f68f1863d18dc4ecb16ae0558`);
    const weatherData= await weatherResponse.json();
    if (!weatherResponse.ok)
        throw new Error(`${weatherData.cod} ${weatherData.message}`);
    await setWeather(weatherData);
    setIcon(weatherData);
}

window.addEventListener('load',async function()
{
    try
    {
        const {coords:{latitude:lat,longitude:lon}}=await getLocationCoords();
        await getWeather(`lat=${lat}&lon=${lon}`);
    }
    catch(e)
    {
        alert(e.message);
    }
    const d=new Date();
    date.textContent=`${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
});

goBTN.addEventListener('click',async function()
{
    try
    {
        await getWeather(`q=${input.value}`);
    }
    catch(e)
    {
        alert(e.message+"\n"+"Please enter a valid city name");
    }
    input.value="";
})

function setIcon(weatherData)
{
    let skycons = new Skycons({"color": "white"});
    skycons.remove("icon1");
    const d=(new Date).getHours();
    if (weatherData.weather[0].main=="Clouds")
        weatherData.weather[0].main="partly cloudy";
    let type="";
    if (5<=d && d<=18)
        type=weatherData.weather[0].main+" day";
    else
        type=weatherData.weather[0].main+" night";
    console.log(weatherData);

    if (weatherData.weather[0].main=="Mist" || weatherData.weather[0].main=="Smoke" || weatherData.weather[0].main=="Fog" || weatherData.weather[0].main=="Haze")
        type="fog";
    if(weatherData.weather[0].main=="Snow")
        type="snow";
    if(weatherData.weather[0].main=="Rain")
        type="rain";
    type=type.replace(/ /g,"_").toUpperCase();
    console.log(type);
    skycons.add("icon1", Skycons[type]);
    skycons.play();
}

