const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//error screen
const errorScreen = document.querySelector(".error-container");


//initially
let currentTab = userTab;
const API_KEY = "2c32b604c648fa574a818575de5344ea";
currentTab.classList.add("current-tab");
getformSessionStorage();

//tab generate
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //switch the tab in weather to search
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            errorScreen.classList.remove("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorScreen.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local 
            //storage first for coordinates, if we have saved them there.
            getformSessionStorage();
        }
    }
}


userTab.addEventListener("click",  () =>{
    // pass click tab as a parameter
    switchTab(userTab);
});

searchTab.addEventListener("click" , () =>{
    // pass click tab as a parameter
    switchTab(searchTab);
})

// check if coordinates are already prasent
function getformSessionStorage(){
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // localCoordinates are not 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates  = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates)
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon} = coordinates;
    // make grantcontainer invisible 
    grantAccessContainer.classList.remove("active");
    // make loader visible 
    loadingScreen.classList.add("active");
    //API CALL.....
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // errorScreen.classList.remove("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.error("API Cannot fetched and ", err);
        // errorScreen.classList.add("active");
    }

}

function renderWeatherInfo(weatherInfo){
    //1stly we have to fetch element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]")
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it UI elements

        cityName.innerText = weatherInfo?.name;
        countryIcon.src = `http://flagcdn.com/144x108/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
        // countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country?.toLowerCase()}.png`;
        desc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}



function showPosition(Position){
    const userCoordinates = {
        lat: Position.coords.latitude,
        lon: Position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


 //geolocation call.....
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geoLocation support");
    }
}

const grantAccessButton = document.querySelector("[data-grantAcsses]");
grantAccessButton.addEventListener("click", getLocation);
const SearchInput = document.querySelector("[ data-searchInput]");


searchForm.addEventListener("submit" , (e) => {
        e.preventDefault();
//input city is not availabe to search that city or any city...
        let cityName = SearchInput.value;
        if(cityName == ""){
            return;
        }
        else{
            fetchSearchWeatherInfo(cityName);
        }
        
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    if( errorScreen.classList.contains("active") ){
        errorScreen.classList.remove("active");
    }


    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            if(!response.ok){
                throw(new error)   
            }
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
        catch(err){
                //hW
        loadingScreen.classList.remove("active");
        // userInfoContainer.classList.remove("active");
        errorScreen.classList.add("active");

        console.log("API Cannot fetched " + err);
        // console.err("API Cannot fetched and " + err);
        } 
}


/*     date and time */

const dataTime = document.querySelector("[data-time]");

function dateTimeInput(){
    const date = Date()
    dataTime.innerText = date;
}
// dateTimeInput();


