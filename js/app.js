

const cityNameField = document.querySelector('.city p');
const temperatureField = document.querySelector(".temperature p");
const form = document.querySelector('form');
const cityInput = document.getElementById("city_input");


form.addEventListener('submit', (event) => {
  event.preventDefault();
  let target = cityInput.value;
  fetchResults(target)
})

const fetchResults = async (location) => {

  let url = `https://api.weatherapi.com/v1/current.json?key=21e2af1c506d4fc8bdd211218251508&q=${location}&aqi=no`

  const response = await fetch(url)
  const data = await response.json()
  console.log(data)

  // get JSON values of temp and city, update website to reflect
  const temperature = data.current.temp_f
  const cityName = data.location.name
  updateValues(temperature, cityName)

  // get JSON value of condition code and its icon
  const condition = data.current.condition
  const conditionCode = data.current.condition.code
  const iconURL = data.current.condition.icon
  console.log("Code: "+ conditionCode)
  console.log("Condition: "+condition)

  // get condition img
  const img = document.createElement('img');
  img.src = iconURL;
  weatherEffectSelector(conditionCode)

}

function updateValues(temperature, cityName){
  temperatureField.innerText = temperature + '°'
  cityNameField.innerText = cityName
}

// Begin weather effects

// Rain Effect (1-15 scale)

let rainInterval = null;

function rainEffect(strength = 2) {
  // limit strength 1–3
  strength = Math.max(1, Math.min(3, strength));

  const raindrop = document.createElement('div');
  raindrop.classList.add('raindrop');

  // random X
  raindrop.style.left = Math.random() * window.innerWidth + 'px';

  // random fall duration, faster with higher strength
  const duration = (Math.random() * 0.5 + 0.7) / strength;
  raindrop.style.animationDuration = duration + 's';

  document.body.appendChild(raindrop);

  // cleanup after it finishes falling
  setTimeout(() => {
    raindrop.remove();
  }, duration * 1000);
}

function startRain(strength) {
  if (rainInterval) {return;}
  rainInterval = setInterval(() => rainEffect(strength), 50 / strength);
}

// Snow Effect (1-100)

let snowInterval = null;

function snowEffect(strength = 2){
  strength = Math.max(1, Math.min(3, strength));

  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');

  //random x
  snowflake.style.left = Math.random() * window.innerWidth + 'px';

  // random fall duration
  const duration = (Math.random() * 10.5 + 2) / strength;
  snowflake.style.animationDuration = duration + 's';

  document.body.appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, duration * 1000);
}

function startSnow(strength){
  if (snowInterval) {return;}
  rainInterval = setInterval(() => snowEffect(strength), 50 / strength);
}

// Mist Effect (0-100)

let mistInterval = null;

function mistEffect(strength = 2){


  const mistCloud = document.createElement('div');
  mistCloud.classList.add('mist');

  //random size
  const size = Math.random() * 150 + 50;
  mistCloud.style.width = size + 'px';
  mistCloud.style.height = size/2 + 'px';

  //random x
  mistCloud.style.left = Math.random() * document.body.offsetWidth + 'px';

  //random rise
  const duration = Math.random() * 5 + 10;
  mistCloud.style.animationDuration = duration + 's';

  const base = Math.min(strength / 10/ 0.5);
  mistCloud.style.opacity = base + Math.random() * 0.3 + '%'

  document.body.appendChild(mistCloud);

  setTimeout(() => {
    mistCloud.remove();
  }, duration * 1000);
}

function startMist(strength = 2){
  if (mistInterval) {return;}
  mistInterval = setInterval(() => mistEffect(strength), 500 / strength);
}

// Cloud formation effect (0-100)

let cloudInterval = null;

function cloudEffect(strength = 2){

  const cloud = document.createElement('div');
  cloud.classList.add('cloud');

  //random y
  cloud.style.top = Math.random() * window.innerHeight + 'px';

  //randomize duration
  const duration = Math.random() * 40 + 20; // 20–60s
  cloud.style.animationDuration = duration + 's';

  //randomize direction
  const direction = Math.random() < 0.5 ? 'normal' : 'reverse';
  cloud.style.animation = `cloudDrift ${duration}s linear ${direction} forwards`;
  document.body.appendChild(cloud);
  setTimeout(() => {
    cloud.remove()
  }, duration * 1000);
}

function startCloudEffect(strength = 2){
  if (cloudInterval) {return;}
  const spawnRate = Math.max(500, 5000 / strength); //
  cloudInterval = setInterval(() => cloudEffect(strength),spawnRate);
}





function startSunnyEffect(){
  document.body.style.backgroundColor = 'lightblue';
}

function stopSunnyEffect() {
  document.body.style.backgroundColor = ''; // reset back to default
}

function stopCurrentEffect(){
  clearInterval(snowInterval);
  clearInterval(rainInterval);
  clearInterval(mistInterval);
  clearInterval(cloudInterval);

  stopSunnyEffect();
}


startMist(10)



//DEV MODE


const DEV_MODE = false;

if (DEV_MODE) {
  document.addEventListener('keydown', handleDevKeys);
}

function handleDevKeys(e) {

  document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
      case 'r': // rain
        stopCurrentEffect();
        startRain(2);
        console.log("Dev: Rain started");
        break;

      case 's': // snow
        stopCurrentEffect();
        startSnow(50);
        console.log("Dev: Snow started");
        break;

      case 'm': // mist
        stopCurrentEffect();
        startMist(2);
        console.log("Dev: Mist started");
        break;

      case 'c': // clouds
        stopCurrentEffect();
        startCloudEffect(3);
        console.log("Dev: Clouds started");
        break;

      case 'u': // sunny
        stopCurrentEffect();
        startSunnyEffect();
        console.log("Dev: Sunny mode");
        break;

      case 'x': // clear everything
        stopCurrentEffect();
        console.log("Dev: All effects stopped");
        break;
    }
  });

}








function weatherEffectSelector(conditionCode){
  stopCurrentEffect();

  switch (conditionCode) {
    case 1000: startSunnyEffect()
      console.log("It's sunny!"); break;
    case 1003: startCloudEffect(20);
      console.log("Partly cloudy skies."); break;
    case 1006: startCloudEffect(50);
      console.log("Cloudy conditions."); break;
    case 1009: startCloudEffect(100);
      console.log("Overcast skies."); break;
    case 1030: startMist(500)
      console.log("Misty weather."); break;
    case 1063: console.log("Patchy rain possible."); break;
    case 1066: console.log("Patchy snow possible."); break;
    case 1069: console.log("Patchy sleet possible."); break;
    case 1072: console.log("Patchy freezing drizzle possible."); break;
    case 1087: console.log("Thundery outbreaks possible."); break;
    case 1114: startSnow(50)
      console.log("Blowing snow."); break;
    case 1117: startSnow(100)
      console.log("Blizzard conditions!"); break;
    case 1135: startMist(500)
      console.log("Foggy conditions."); break;
    case 1147: startMist(500)
      console.log("Freezing fog."); break;
    case 1150: startRain(0.3);
      console.log("Patchy light drizzle."); break;
    case 1153: startRain(0.5);
      console.log("Light drizzle."); break;
    case 1168: startRain(2)
      console.log("Freezing drizzle."); break;
    case 1171: startRain(1)
      console.log("Heavy freezing drizzle."); break;
    case 1180: startRain(2);
      console.log("Patchy light rain."); break;
    case 1183: startRain(2);
      console.log("Light rain."); break;
    case 1186: startRain(1);
      console.log("Moderate rain at times."); break;
    case 1189: startRain(7);
      console.log("Moderate rain."); break;
    case 1192: startRain(4);
      console.log("Heavy rain at times."); break;
    case 1195: startRain(10);
      console.log("Heavy rain."); break;
    case 1198: startRain(1);
      console.log("Light freezing rain."); break;
    case 1201: startRain(10);
      console.log("Moderate or heavy freezing rain."); break;
    case 1204: startSnow(1);
      console.log("Light sleet."); break;
    case 1207: startSnow(50)
      console.log("Moderate or heavy sleet."); break;
    case 1210: startSnow(10)
      console.log("Patchy light snow."); break;
    case 1213: startSnow(15)
      console.log("Light snow."); break;
    case 1216: startSnow(25)
      console.log("Patchy moderate snow."); break;
    case 1219: startSnow(50)
      console.log("Moderate snow."); break;
    case 1222: startSnow(75)
      console.log("Patchy heavy snow."); break;
    case 1225: startSnow(100)
      console.log("Heavy snow."); break;
    case 1237: startRain(15);
      console.log("Ice pellets."); break;
    case 1240: startRain(1);
      console.log("Light rain shower."); break;
    case 1243: startRain(15);
      console.log("Moderate or heavy rain shower."); break;
    case 1246: startRain(20);
      console.log("Torrential rain shower!"); break;
    case 1249: startSnow(15)
      console.log("Light sleet showers."); break;
    case 1252: startSnow(50)
      console.log("Moderate or heavy sleet showers."); break;
    case 1255: startSnow(15)
      console.log("Light snow showers."); break;
    case 1258: startSnow(85)
      console.log("Moderate or heavy snow showers."); break;
    case 1261: startRain(1)
      console.log("Light showers of ice pellets."); break;
    case 1264: startRain(15)
      console.log("Moderate or heavy showers of ice pellets."); break;
    case 1273: startRain(2);
      console.log("Patchy light rain with thunder."); break;
    case 1276: startRain(13);
      console.log("Moderate or heavy rain with thunder."); break;
    case 1279: startSnow(15)
      console.log("Patchy light snow with thunder."); break;
    case 1282: startSnow(75)
      console.log("Moderate or heavy snow with thunder."); break;
    default: console.log("Unknown weather condition."); break;
  }



}
