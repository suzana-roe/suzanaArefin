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

var tracker = true;

//fetching info from rest countries

function resetCountryData(country_code) {
  return new Promise((resolve, reject) => {
    if (!country_code) country_code = "pk";

    $.ajax({
      url: "./php/restCountries.php",
      type: "POST",
      dataType: "json",
      data: {
        country: country_code,
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
  url: "./php/geoJson.php",
  type: "POST",
  dataType: "json",

  success: function (result) {
    console.log("populate options", result);

    if (result.status.name == "ok") {
      for (var i = 0; i < result.data.border.features.length; i++) {
        $("#selCountry").append(
          $("<option>", {
            value: result.data.border.features[i].properties.iso_a3,
            text: result.data.border.features[i].properties.name,
            "data-iso": result.data.border.features[i].properties.iso_a2,
          })
        );
      }
    }

    $("#selCountry").html(
      $("#selCountry option").sort(function (a, b) {
        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
      })
    );
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
     
      $("selectOpt select").val(
        result.data[0].components["ISO_3166-1_alpha-3"]
      );

      let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
      $("#selCountry").val(currentCountry).change();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    },
  });
};

const errorCallback = (error) => {
  console.error(error);
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

//adding borders to the map

$("#selCountry").on("change", function () {
  let countryCode = $("#selCountry").val();
  let countryOptionText = $("#selCountry").find("option:selected").text();

  if (!visitedCountries.includes(countryOptionText)) {
    visitedCountries.push(countryOptionText);
    console.log("Array visited countries", visitedCountries);
  }

  const showFirstTab = function () {
    $("#nav-home-tab").tab("show");
  };
  showFirstTab();

  $.ajax({
    url: "./php/geoJson.php",
    type: "POST",
    dataType: "json",
    success: function (result) {
      console.log("all borders result", result);

      if (map.hasLayer(border)) {
        map.removeLayer(border);
      }

      let countryArray = [];
      let countryOptionTextArray = [];

      for (let i = 0; i < result.data.border.features.length; i++) {
        if (result.data.border.features[i].properties.iso_a3 === countryCode) {
          countryArray.push(result.data.border.features[i]);
        }
      }
      for (let i = 0; i < result.data.border.features.length; i++) {
        if (
          result.data.border.features[i].properties.name === countryOptionText
        ) {
          countryOptionTextArray.push(result.data.border.features[i]);
        }
      }

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
      if (result.data[0].components["ISO_3166-1_alpha-3"]) {
        console.log("openCage PHP", result);

        currentLat = result.data[0].geometry.lat;
        currentLng = result.data[0].geometry.lng;

        $("selectOpt select").val(
          result.data[0].components["ISO_3166-1_alpha-3"]
        );

        let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
        $("#selCountry").val(currentCountry).change();
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
  '<img src="./img/plane.png" style="height:30px; width:30px;" title="Airports Markers">',
  function (btn, map) {
    var country_code;
    const selectElement = $("#selCountry");
    const selectedIsoCode = selectElement.find(":selected").data("iso");

    var app_id = "ea3d161a";
    var app_key = "70b442363696c70d8657ca14858ea90c";
    var format = "json"; // or xml

    const api_key = "58368c73-fec1-4214-a5c7-ca85169e04e6"; // replace with your API key

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

//weather
L.easyButton(
  '<img src="./img/landmark.png" style="height:30px; width:30px;" title="Landmark Markers">',
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
).addTo(map);

//news

L.easyButton(
  '<img src="./img/newspaper.png" style="height:30px; width:30px;" type="button" id="newsInfo" data-bs-toggle="modal" data-bs-target="#newsModal">',
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
  '<img src="./img/coronavirus.png" style="height:30px; width:30px;" type="button" id="coronaInfo" data-bs-toggle="modal" data-bs-target="#coronaModal">',
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
  '<img src="./img/hot.png" style="height:30px; width:30px;" type="button" id="weatherInfo" data-bs-toggle="modal" data-bs-target="#weatherModal">',
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
  '<img src="./img/planet-earth.png" style="height:30px; width:30px;" type="button" id="runBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">',
  function (btn, map) {
    const selectElement = $("#selCountry");
    const selectedIsoCode = selectElement.find(":selected").data("iso");

    $.ajax({
      url: "./php/restCountries.php",
      type: "POST",
      dataType: "json",
      data: {
        country: selectedIsoCode,
      },
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

          //landmarks

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

          //country information

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

          //news modal

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
          });

          //covid
          $.ajax({
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
