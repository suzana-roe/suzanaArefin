//global variables
var border;
var currencyCode;
var countryName;
let capitalCityWeather;
let capitalCityLat;
let capitalCityLon;
var iso2CountryCode;
let capitalCity;
let popup;
let countryCenter;

var tracker = true;

//map initialization
var map = L.map('map').setView([36.138287, -96.110367], 3.5);


//open street map tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    },
});

//adding borders to the map

$("#selCountry").on("change", function () {
    let countryCode = $("#selCountry").val();
    let countryOptionText = $("#selCountry").find("option:selected").text();

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
