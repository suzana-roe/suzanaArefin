var border;
var currencyCode;
var countryName;
let capitalCityWeather;
let capitalCityLat;
let capitalCityLon;
var iso2CountryCode;
let capitalCity;
let visitedCountries = [];
let popup;
let countryCenter;
let selectedCountry;

var tracker = true;

//fetching info from rest countries

function resetCountryData(country_code) {
  return new Promise((resolve, reject) => {
    if (!country_code) country_code = "bs";

    $.ajax({
      url: "./php/restCountries.php",
      type: "GET",
      dataType: "json",
      data: {
        code: country_code,
      },
      success: function (result) {
        console.log("restCountries", result);
        if (result.status.name == "ok") {
          currencyCode = JSON.stringify(result.data[0].currencies)
            .split('":{')[0]
            .split('{"')[1];

          countryCenter = result.data[0].latlng;
          capitalCityWeather = result.data[0].capital[0];
          iso2CountryCode = result.data[0].cca2;
          var countryName2 = result.data[0].name.common;
          countryName = countryName2.replace(/\s+/g, "_");

          resolve();
        }
      },
    });
  });
}
$(document).ready(function () {
  resetCountryData(false);
});


var mapboxUrl =
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
var mapboxAttribution =
  'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
var token =
  "pk.eyJ1IjoicGV6IiwiYSI6ImNraWFlcDVsYTBpMW0ycnJreWRxdnNneXIifQ._2kq-bt8gs8Wmc5JIY-6NQ";

var dark = L.tileLayer(mapboxUrl, {
    id: "mapbox/dark-v10",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapboxAttribution,
    accessToken: token,
  }),
  streets = L.tileLayer(mapboxUrl, {
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mapboxAttribution,
    accessToken: token,
  });

outdoors = L.tileLayer(mapboxUrl, {
  id: "mapbox/outdoors-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mapboxAttribution,
  accessToken: token,
});
light = L.tileLayer(mapboxUrl, {
  id: "mapbox/light-v10",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mapboxAttribution,
  accessToken: token,
});
satellite = L.tileLayer(mapboxUrl, {
  id: "mapbox/satellite-v9",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mapboxAttribution,
  accessToken: token,
});
satStreets = L.tileLayer(mapboxUrl, {
  id: "mapbox/satellite-streets-v11",
  tileSize: 512,
  zoomOffset: -1,
  attribution: mapboxAttribution,
  accessToken: token,
});

var baseMaps = {
  Streets: streets,
  Dark: dark,
  Outdoors: outdoors,
  Light: light,
  Satellite: satellite,
  "Stellite-Streets": satStreets,
};

//Initializing map
var map = L.map("map", {
  zoom: 10,
  layers: [light],
}).fitWorld();

L.control.layers(baseMaps).addTo(map);

var myCircles = new L.featureGroup().addTo(map);

//building the countries select list
$.ajax({
  url: "./php/getCountrySelect.php",
  type: "POST",
  dataType: "json",

  success: function (result) {
      console.log("populate options", result);

      if (result.status.name == "ok") {
          for (var i = 0; i < result.data.length; i++) {
              $("#selCountry").append(
                  $("<option>", {
                      value: result.data[i].code,
                      text: result.data[i].name,
                      //"data-iso": result.data.border.features[i].properties.iso_a2,
                  })
              );
          }
      }

      $("#selCountry").html(
          $("#selCountry option").sort(function (a, b) {
              return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
          })
      );
      getLocationPermission()
  },
  error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
  },
});


//detecting user's location

const successCallback = (position) => {
  $.ajax({
    url: "./php/openCage.php",
    type: "GET",
    dataType: "json",
    data: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },

    success: function (result) {
      console.log("openCage PHP", result);
      currentLat = result.data[0].geometry.lat;
      currentLng = result.data[0].geometry.lng;
    

      let currentCountry = result.data[0].components.country_code;
      selectedCountry = result.data[0].components.country_code;
      console.log($("#selCountry")[0]);
      $("#selCountry").val(currentCountry.toUpperCase()).change();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
};

const errorCallback = (error) => {
  console.error(error);
  $("#selCountry").val($("#selCountry option:first").val()).change();
};

function getLocationPermission() {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

//adding borders to the map

//adding borders to the map

$("#selCountry").on("change", function () {
  let countryCode = $("#selCountry").val() || selectedCountry;
console.log(countryCode,"@country");

  let countryOptionText = $("#selCountry").find("option:selected").text();

  if (!visitedCountries.includes(countryOptionText)) {
    visitedCountries.push(countryOptionText);
    console.log("Array visited countries", visitedCountries);
  }

  const showFirstTab = function () {
    $("#nav-home-tab").tab("show");
  };
  showFirstTab();
  
  console.log(countryCode, "@countrycode");

  $.ajax({
    url: `./php/getCountryData.php?countryCode=${countryCode}`,
    type: "GET",
    dataType: "json",

    success: function (result) {
      console.log("all borders result", result);

      if (map.hasLayer(border)) {
        map.removeLayer(border);
      };

      let countryArray = [];
      let countryOptionTextArray = [];
      console.log(typeof result);
      //for (let i = 0; i < result.data.border.features.length; i++) {
        //if (result.data.border.features[i].properties.iso_a3 === countryCode) {
          countryArray.push(result);
        //}
      //}
      //for (let i = 0; i < result.data.border.features.length; i++) {
        //if (
          //result.data.border.features[i].properties.name === countryOptionText
        //) {
          countryOptionTextArray.push(result);
        //}
      //}

      border = L.geoJSON(countryOptionTextArray[0], {
        color: "#5F97FB",
        weight: 3,
        opacity: 0.75,
      }).addTo(map);
      let bounds = border.getBounds();
      map.flyToBounds(bounds, {
        padding: [35, 35],
        duration: 2,
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
});

//new event for map click

map.on("click", function (e) {
  var popLocation = e.latlng;

  $.ajax({
    url: "./php/openCage.php",
    type: "GET",
    dataType: "json",
    data: {
      lat: popLocation.lat,
      lng: popLocation.lng,
    },

    success: function (result) {
      if (result.data[0].components.country_code) {
        console.log("openCage PHP", result);

        currentLat = result.data[0].geometry.lat;
        currentLng = result.data[0].geometry.lng;


        let currentCountry = result.data[0].components.country_code;
        $("#selCountry").val(currentCountry.toUpperCase()).change();
      } else {
        console.log("clicked on water");
        console.log("openCage PHP", result);

        currentLat = result.data[0].geometry.lat;
        currentLng = result.data[0].geometry.lng;

        L.popup()
          .setLatLng([currentLat, currentLng])
          .setContent(
            "<div><strong>" + result.data[0].formatted + "</strong></div>"
          )
          .openOn(map);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      console.log(jqXHR, errorThrown);
    },
  });
});

$(window).keypress(function (e) {
  var keyCode = e.which;

  if (keyCode == 116) {
    if (tracker === false) {
      tracker = true;
    } else {
      tracker = false;
    }
  }
});

//EASY BUTTONS AND MODALS

//airport
L.easyButton(
  //'<img src="./img/plane.png" style="height:30px; width:30px;" title="Airports Markers">',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M381 114.9L186.1 41.8c-16.7-6.2-35.2-5.3-51.1 2.7L89.1 67.4C78 73 77.2 88.5 87.6 95.2l146.9 94.5L136 240 77.8 214.1c-8.7-3.9-18.8-3.7-27.3 .6L18.3 230.8c-9.3 4.7-11.8 16.8-5 24.7l73.1 85.3c6.1 7.1 15 11.2 24.3 11.2H248.4c5 0 9.9-1.2 14.3-3.4L535.6 212.2c46.5-23.3 82.5-63.3 100.8-112C645.9 75 627.2 48 600.2 48H542.8c-20.2 0-40.2 4.8-58.2 14L381 114.9zM0 480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32z"/></svg>',
  
  function (btn, map) {
    var country_code;
    const selectElement = $("#selCountry");
    const selectedIsoCode = selectElement.find(":selected").data("iso");

    var app_id = "ea3d161a";
    var app_key = "70b442363696c70d8657ca14858ea90c";
    var format = "json"; // or xml

    const api_key = "58368c73-fec1-4214-a5c7-ca85169e04e6"; 

    const resetCountry = new Promise((resolve, reject) => {
      setTimeout(() => {
        resetCountryData(selectedIsoCode);
        resolve();
      }, 200);
    });

    resetCountry.then((resolved) => {
      fetch(
        `https://airlabs.co/api/v9/airports?country_code=${selectedIsoCode}&api_key=${api_key}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);

          data["response"].forEach((airport) => {
            const marker = L.marker([airport.lat, airport.lng]).addTo(map);
            marker.bindPopup(`${airport.name} (${airport.iata_code})`);
          });
        })
        .catch((error) => console.error(error));
    });
  }
).addTo(map);

//landmark
/*L.easyButton(
  //'<img src="./img/landmark.png" style="height:30px; width:30px;" title="Landmark Markers">',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z"/></svg>',

  function (btn, map) {
    let accessApi =
      "pk.eyJ1IjoibnVrdXgiLCJhIjoiY2xlZmdhMGFhMGJiYTNvdHRnaXBsOXpyZCJ9.PlxmSIezQdLBZnmx_FWnDQ";

    const selectElement = $("#selCountry");
    const selectedIsoCode = selectElement.find(":selected").data("iso");

    const countryCode = selectedIsoCode;

    const accessToken = accessApi;

    resetCountryData(selectedIsoCode).then(
      (resolved) => {
        console.log("capitalCityWeather2: ", capitalCityWeather);
        console.log("countryName2: ", countryName);

        fetch(
          `https://nominatim.openstreetmap.org/search.php?q=${capitalCityWeather}%20${countryName}&format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            data.forEach((place) => {
              const myIcon = L.icon({
                iconUrl: "img/landmark-marker.png",
                iconSize: [50, 50],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
              });
              const marker = L.marker([place.lat, place.lon], {
                icon: myIcon,
              }).addTo(map);
              marker.bindPopup(`${place.display_name}`);
            });
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (rejetced) => {}
    );
  }
).addTo(map);*/

//news

L.easyButton(
  //'<img src="./img/newspaper.png" style="height:30px; width:30px;" type="button" id="newsInfo" data-bs-toggle="modal" data-bs-target="#newsModal">',
  '<svg id="newsInfo" data-bs-toggle="modal" data-bs-target="#newsModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v80c0 13.3 10.7 24 24 24H424c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24zm0 184c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm160 0c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H336c-8.8 0-16 7.2-16 16zM160 400c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm160 0c0 8.8 7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"/></svg>',
  
  function (btn, map) {
    const selectElement = $("#selCountry");
    const selectedIsoCode = selectElement.find(":selected").data("iso");

    resetCountryData(selectedIsoCode).then(
      (resolved) => {
        $.ajax({
          url: "./php/news.php",
          type: "GET",
          dataType: "json",
          data: {
            newsCountry: iso2CountryCode,
          },
          success: function (result) {
            $("#newsList").html("");
            for (var i = 0; i < result.data.length; i++) {
              $("#newsList")
                .append(`<div class="newsList"><a href="${result.data[i].url}"> <div class="news-title"><b>${result.data[i].title}</b></div></a>
          <div class="news-description">${result.data[i].description}
          </div><div class="news-info">
              <div class="news-author news-info-item"><b>Author: </b>${result.data[i].author}</div>
              <div class="news-category news-info-item"><b>Category: </b>${result.data[i].category}</div>
              <div class="news-date news-info-item"><b>Published At: </b>${result.data[i].published_at}</div>
              <div class="news-country news-info-item"><b>Source: </b>${result.data[i].source}</div>
          </div></div>`);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
          },
        });
      },
      (rejected) => {}
    );
  }
).addTo(map);

//covid

L.easyButton(
  //'<img src="./img/coronavirus.png" style="height:30px; width:30px;" type="button" id="coronaInfo" data-bs-toggle="modal" data-bs-target="#coronaModal">',
  '<svg id="coronaInfo" data-bs-toggle="modal" data-bs-target="#coronaModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M192 24c0-13.3 10.7-24 24-24h80c13.3 0 24 10.7 24 24s-10.7 24-24 24H280V81.6c30.7 4.2 58.8 16.3 82.3 34.1L386.1 92 374.8 80.6c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l56.6 56.6c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L420 125.9l-23.8 23.8c17.9 23.5 29.9 51.7 34.1 82.3H464V216c0-13.3 10.7-24 24-24s24 10.7 24 24v80c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H430.4c-4.2 30.7-16.3 58.8-34.1 82.3L420 386.1l11.3-11.3c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-56.6 56.6c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L386.1 420l-23.8-23.8c-23.5 17.9-51.7 29.9-82.3 34.1V464h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h16V430.4c-30.7-4.2-58.8-16.3-82.3-34.1L125.9 420l11.3 11.3c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L46.7 408.7c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L92 386.1l23.8-23.8C97.9 338.8 85.8 310.7 81.6 280H48v16c0 13.3-10.7 24-24 24s-24-10.7-24-24V216c0-13.3 10.7-24 24-24s24 10.7 24 24v16H81.6c4.2-30.7 16.3-58.8 34.1-82.3L92 125.9 80.6 137.2c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l56.6-56.6c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L125.9 92l23.8 23.8c23.5-17.9 51.7-29.9 82.3-34.1V48H216c-13.3 0-24-10.7-24-24zm48 200a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm64 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>',

  function (btn, map) {
    $.ajax({
      url:
        "https://disease.sh/v3/covid-19/countries/" +
        $("#selCountry option:selected").text() +
        "?yesterday=false&twoDaysAgo=false&strict=true&allowNull=true",
      type: "GET",
      dataType: "json",
      data: {},
      success: function (result) {
        console.log("deaths: ", result.deaths);
        $("#txtCovidDeaths").html("Deaths: " + result.deaths + "<br>");
        $("#txtCovidCases").html(
          "Total Registered Cases: " + result.cases + "<br>"
        );
        $("#txtCovidRecovered").html(
          "Recoveries: " + result.recovered + "<br>"
        );
        $("#txtCovidCritical").html(
          "Critical Patients: " + result.critical + "<br>"
        );
        $("#txtCovidDeathRate").html(
          "<strong>Death rate: " + result.oneDeathPerPeople + " %</strong><br>"
        );
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      },
    });
  }
).addTo(map);

//current weather

L.easyButton(
  //'<img src="./img/hot.png" style="height:30px; width:30px;" type="button" id="weatherInfo" data-bs-toggle="modal" data-bs-target="#weatherModal">',
  '<svg id="weatherInfo" data-bs-toggle="modal" data-bs-target="#weatherModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l14.1 84.7 84.7 14.1c5.4 .9 10 4.5 12.1 9.6s1.5 10.9-1.6 15.4l-38.5 55c-2.2-.1-4.4-.2-6.7-.2c-23.3 0-45.1 6.2-64 17.1l0-1.1c0-53-43-96-96-96s-96 43-96 96s43 96 96 96c8.1 0 15.9-1 23.4-2.9c-36.6 18.1-63.3 53.1-69.8 94.9l-24.4 17c-4.5 3.2-10.3 3.8-15.4 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-.9-10-4.5-12.1-9.6s-1.5-10.9 1.6-15.4L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.4s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c.9-5.4 4.5-10 9.6-12.1s10.9-1.5 15.4 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.4-1.6zM144 208a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM639.9 431.9c0 44.2-35.8 80-80 80H288c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"/></svg>',
  function (btn, map) {
    const selectElement = $("#selCountry");
    const selectedIsoCode = selectElement.find(":selected").data("iso");

    resetCountryData(selectedIsoCode).then(
      (resolved) => {
        $.ajax({
          url: "./php/openWeatherCurrent.php",
          type: "POST",
          dataType: "json",
          data: {
            capital: capitalCityWeather,
          },
          success: function (result) {
            console.log("CurrentCapitalWeather", result);
            capitalCityLat = result.weatherData.coord.lat;
            capitalCityLon = result.weatherData.coord.lon;

            $("#txtCapitalWeatherCurrent").html(
              "&nbsp;&nbsp;&nbsp;&nbsp;Today: &nbsp;&nbsp;" +
                result.weatherData.weather[0].description +
                "&nbsp;&nbsp; || &nbsp;&nbsp; current temp: &nbsp;" +
                result.weatherData.main.temp +
                "&#8451<br>"
            );
            $("#txtCapitalWeatherLo").html(
              "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Low: " +
                result.weatherData.main.temp_min +
                "&#8451<br>"
            );
            $("#txtCapitalWeatherHi").html(
              "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;High: " +
                result.weatherData.main.temp_max +
                "&#8451<br>"
            );
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
          },
        });
      },
      (error) => {
        alert("Error reseting country data !!");
      }
    );
  }
).addTo(map);

//country information modal

L.easyButton(
  //'<img src="./img/planet-earth.png" style="height:30px; width:30px;" type="button" id="runBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">',
  '<svg id="runBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>',

  function (btn, map) {

    $.ajax({
      url: "./php/restCountries.php?code=" + $('#selCountry').val().toLowerCase(),
      type: "POST",
      dataType: "json",
     

      success: function (result) {
        console.log("restCountries", result);
        if (result.status.name == "ok") {
          currencyCode = JSON.stringify(result.data[0].currencies)
            .split('":{')[0]
            .split('{"')[1];
          capitalCityWeather = result.data[0].capital[0];
          iso2CountryCode = result.data[0].cca2;
          var countryName2 = result.data[0].name.common;
          countryName = countryName2.replace(/\s+/g, "_");

          $("#txtName").html(result.data[0].name.common + "<br>");
          $("#txtCurrency").html("<strong> " + currencyCode + "</strong><br>");
          $("#txtCurrencyCode").html(
            "Code: <strong>" + currencyCode + "</strong><br>"
          );

          //Home(Wikipedia info)

          $.ajax({
            url: "php/wikiPlaces.php",
            type: "GET",
            dataType: "json",
            data: { country_name: countryName },
            success: function (result) {
              console.log("wiki info: ", result);
              result = result.wikiPlaces;
              $("#txtWikiImg").html(
                "<img src=" + result.thumbnail.source + "><br>"
              );
              $("#txtWiki").html(result.extract_html + "<br>");
            },

            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });

          //General information

          $.ajax({
            url: "./php/getCountryInfo.php",
            type: "GET",
            dataType: "json",
            data: {
              geonamesInfo: iso2CountryCode,
            },
            success: function (result) {
              console.log("Geonames Data", result);
              if (result.status.name == "ok") {
                $("#txtCapital").html(
                  "Capital: <strong>" + result.data[0].capital + "</strong><br>"
                );

                $("#txtAreaInSqKm").html(
                  "Area: <strong>" +
                    result.data[0].areaInSqKm +
                    "</strong> km²<br>"
                );
                $("#txtContinent").html(
                  "Continent: <strong>" +
                    result.data[0].continent +
                    "</strong><br>"
                );
                $("#txtPopulation").html(
                  "Population: <strong>" +
                    result.data[0].population +
                    "</strong><br>"
                );
                $("#txtLanguages").html(
                  "Languages: <strong>" +
                    result.data[0].languages +
                    "</strong><br>"
                );
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });

          //Exchange rates modal
          $.ajax({
            url: "./php/exchangeRates.php",
            type: "GET",
            dataType: "json",
            success: function (result) {
              console.log("exchange rates", result);
              if (result.status.name == "ok") {
                console.log("exchange: ", result.status);
                exchangeRate = result.exchangeRate.rates[currencyCode];
                $("#txtRate").html(
                  "Ex. Rate: <strong>" +
                    exchangeRate.toFixed(3) +
                    "</strong> " +
                    currencyCode +
                    " to <strong>1</strong> USD. <br>"
                );
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        alert("err");
      },
    });
  }
).addTo(map);

          //news modal

          /*$.ajax({
            url: "./php/news.php",
            type: "GET",
            dataType: "json",
            data: {
              newsCountry: iso2CountryCode,
            },
            success: function (result) {
              $("#newsList").html("");
              for (var i = 0; i < result.data.length; i++) {
                $("#newsList").append(
                  "<li><a href=" +
                    result.data[i].url +
                    ">" +
                    result.data[i].title +
                    "</a></li>"
                );
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });*/

          //covid
          /*$.ajax({
            url:
              "https://disease.sh/v3/covid-19/countries/" +
              iso2CountryCode +
              "?yesterday=false&twoDaysAgo=false&strict=true&allowNull=true",
            type: "GET",
            dataType: "json",
            data: {},
            success: function (result) {
              $("#txtCovidDeaths").html("Deaths: " + result.deaths + "<br>");
              $("#txtCovidCases").html(
                "Total Registered Cases: " + result.cases + "<br>"
              );
              $("#txtCovidRecovered").html(
                "Recoveries: " + result.recovered + "<br>"
              );
              $("#txtCovidCritical").html(
                "Critical Patients: " + result.critical + "<br>"
              );
              $("#txtCovidDeathRate").html(
                "<strong>Death rate: " +
                  result.oneDeathPerPeople +
                  " %</strong><br>"
              );
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });*/
          
          
