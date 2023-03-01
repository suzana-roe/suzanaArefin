//global variables
var border;
var currencyCode;
var countryName;
let capitalCityWeather;
let capitalCityLat;
let capitalCityLon;
let iso2CountryCode;
let capitalCity;
let popup;



//map initialization
var map = L.map('map').setView([36.138287, -96.110367], 3.5);


//open street map tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// Building the countries <select> list
$.ajax({
    url: "./php/geoJson.php",
    type: 'GET',
    dataType: "json",

    success: function (result) {
        console.log('populate options', result);
        if (result.status.name == "ok") {
            for (var i = 0; i < result.data.border.features.length; i++) {
                $('#selCountry').append($('<option>', {
                    value: result.data.border.features[i].properties.iso_a3,
                    text: result.data.border.features[i].properties.name,
                }));
            }
        }
        //sort options alphabetically
        $("#selCountry").html($("#selCountry option").sort(function (a, b) {
            return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
        }))
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
});


// Locating user's device and getting info from openCage API
const successCallback = (position) => {
    $.ajax({
        url: "./php/openCage.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        },

        success: function (result) {
            console.log('openCage PHP', result);
            console.log(result.data)
            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;


            $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-3"]);


            let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
            $("#selCountry").val(currentCountry).change();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
}

const errorCallback = (error) => {
    console.error(error);
}
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


// adding borders to the map
$('#selCountry').on('change', function () {
    let countryCode = $('#selCountry').val();
    let countryOptionText = $('#selCountry').find('option:selected').text();


    $.ajax({
        url: "./php/geoJson.php",
        type: 'POST',
        dataType: 'json',
        success: function (result) {

            console.log('all borders result', result);

            if (map.hasLayer(border)) {
                map.removeLayer(border);
            }

            let countryArray = [];
            let countryOptionTextArray = [];

            for (let i = 0; i < result.data.border.features.length; i++) {
                if (result.data.border.features[i].properties.iso_a3 === countryCode) {
                    countryArray.push(result.data.border.features[i]);
                }
            };
            for (let i = 0; i < result.data.border.features.length; i++) {
                if (result.data.border.features[i].properties.name === countryOptionText) {
                    countryOptionTextArray.push(result.data.border.features[i]);
                }
            };

            border = L.geoJSON(countryOptionTextArray[0], {
                color: 'black',
                weight: 3,
                opacity: 0.75
            }).addTo(map);
            let bounds = border.getBounds();
            map.flyToBounds(bounds, {
                padding: [35, 35],
                duration: 2,
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus, errorThrown);
        }
    });
});



// fetching info from rest countries API
$('#btnRun').click(function () {
    $.ajax({
        url: "./php/restCountries.php?code=" + $('#selCountry').val().toLowerCase(),
        type: 'GET',
        dataType: 'json',

        success: function (result) {

            console.log('restCountries', result);
            if (result.status.name == "ok") {
                /*currencyCode = result.data[0].currency.code;
                capitalCityWeather = result.data[0].capital.toLowerCase();
                iso2CountryCode = result.data[0].cca2;
                var countryName2 = result.data[0].name;
                countryName = countryName2.replace(/\s+/g, '_');*/


                $('#txtCapital').html('Capital: <strong>' + result.data[0].capital + '</strong><br>');
                //$('#txtCapital2').html('<strong>' + result.data[0].capital+ '\'\s Weather</strong><br>');
                $('#txtAreaInSqKm').html('Area: <strong>' + result.data[0].area + '</strong> km²<br>');
                $('#txtContinent').html('Continent: <strong>' + result.data[0].continents[0] + '</strong><br>');
                $('#txtPopulation').html('Population: <strong>' + result.data[0].population + '</strong><br>');
                $('#txtLanguages').html(Object.values(result.data[0].languages).map(function (language) {
                    return `<li>${language}</li>`
                }).join(''));

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
});

//Covid info
$.ajax({
    url: "./php/covid.php?summary" + $('#selCountry').val(),
    type: 'GET',
    dataType: 'json',


    success: function (result) {
        console.log('Covid Data', result.summary);

        if (result.status.name == "ok") {
            $('#txtCovidDeaths').html('Deaths: ' + result.summary.deaths + '<br>');
            //$('#txtCovidCases').html('Total Registered Cases: ' + result.covidData.confirmed + '<br>');
            //$('#txtCovidRecovered').html('Recoveries: ' + result.covidData.recovered + '<br>');
            //$('#txtCovidCritical').html('Current Critical Patients: ' + result.covidData.critical + '<br>');
            //$('#txtCovidDeathRate').html('<strong>Death rate: ' + result.covidData.calculated.death_rate.toFixed(1) + ' %</strong><br>');

        }

    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
});

$.ajax({
    url: "./php/wikiPlaces.php",
    type: 'GET',
    dataType: 'json',
    data: {
        lat: capitalCityLat,
        lng: capitalCityLon
    },
    success: function (result) {
        console.log('wikiPlaces Data', result);
        $('#wikiPlaces').html("");
        if (result.status.name == "ok") {
            for (var i = 0; i < result.wikiPlaces.length; i++) {
                $("#wikiPlaces").append('<li><a href=https://' + result.wikiPlaces[i].wikipediaUrl + '>' + result.wikiPlaces[i].title + '</a></li>'
                )
            }
        }

    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
});



//New event for map click
map.on('click', function (e) {
    var popLocation = e.latlng;
    $.ajax({
        url: "./php/openCage.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: popLocation.lat,
            lng: popLocation.lng,
        },
        success: function (result) {

            if (result.data[0].components["ISO_3166-1_alpha-3"]) {
                console.log('openCage PHP', result);
                //console.log(typeof result);
                currentLat = result.data[0].geometry.lat;
                currentLng = result.data[0].geometry.lng;

                $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-3"]);

                let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
                $("#selCountry").val(currentCountry).change();
            }
            else {
                console.log("clicked on water")
                console.log('openCage PHP', result);

                currentLat = result.data[0].geometry.lat;
                currentLng = result.data[0].geometry.lng;



                L.popup()
                    .setLatLng([currentLat, currentLng])
                    .setContent("<div><strong>" + result.data[0].formatted + "</strong></div>")
                    .openOn(map);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR, errorThrown)

        }
    });

});
