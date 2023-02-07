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


//osm tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// A more programatically way to build the countries <select> list
$.ajax({
	url: "./php/geoJson.php",
	type: 'POST',
	dataType: "json",
	
	success: function(result) {
		console.log('populate options' , result);
        if (result.status.name == "ok") {
            for (var i=0; i<result.data.border.features.length; i++) {
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
        error: function(jqXHR, textStatus, errorThrown) {
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

    success: function(result) {
        console.log('openCage PHP',result);
        currentLat = result.data[0].geometry.lat;
        currentLng = result.data[0].geometry.lng;
        

        $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-3"]);
        
        let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
        $("#selCountry").val(currentCountry).change();
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
}); 
}

const errorCallback = (error) => {
        console.error(error);
}
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


// adding borders to our map
$('#selCountry').on('change', function() {
let countryCode = $('#selCountry').val();
let countryOptionText= $('#selCountry').find('option:selected').text();


$.ajax({
    url: "./php/geoJson.php",
    type: 'POST',
    dataType: 'json',
    success: function(result) {

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
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
    console.log(textStatus, errorThrown);
    }
}); 
});



// fetching info from rest countries API
$('#btnRun').click(function() {
$.ajax({
    url: "./php/restCountries.php",
    type: 'POST',
    dataType: 'json',
    data: {
        name:$('#selCountry').val()   
    },
    success: function(result) {
        
        console.log('restCountries', result);
        if (result.status.name == "ok") {
            currencyCode = result.currency.code;
            capitalCityWeather= result.data.capital.toLowerCase();
            iso2CountryCode = result.data.cca2;
            var countryName2 = result.data.name;
            countryName = countryName2.replace(/\s+/g, '_');
            
            $('#txtName').html(result['data']['name']+ '<br>');
            $('#txtCurrency').html('<strong> ' + result.currency.name + '</strong><br>');
            $('#txtCurrencyCode').html('Code: <strong>' + result.currency.code + '</strong><br>');
    
//Geonames Country Info
    $.ajax({
        url: "./php/getCountryInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            geonamesInfo: iso2CountryCode,
        },
        success: function(result) {
            console.log('Geonames Data', result);
            if (result.status.name == "ok") {
                        $('#txtCapital').html('Capital: <strong>'+result.data[0].capital+ '</strong><br>');
                        //$('#txtCapital2').html('<strong>' + result.data[0].capital+ '\'\s Weather</strong><br>');
                        $('#txtAreaInSqKm').html('Area: <strong>'+result.data[0].areaInSqKm+ '</strong> km²<br>');
                        $('#txtContinent').html('Continent: <strong>'+result.data[0].continent+ '</strong><br>');
                        $('#txtPopulation').html('Population: <strong>'+result.data[0].population+ '</strong><br>');
                        $('#txtLanguages').html('Languages: <strong>'+ result.data[0].languages + '</strong><br>');
                    }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                    }
                });


//openWeather API          
$.ajax({
    url: "./php/modal/openWeatherCurrent.php",
    type: 'POST',
    dataType: 'json',
    data: {
        capital: capitalCityWeather,
    }, 
    success: function(result) {
        console.log('CurrentCapitalWeather', result);
        capitalCityLat = result.weatherData.coord.lat;
        capitalCityLon = result.weatherData.coord.lon;
        
        if (result.status.name == "ok") {

            $('#txtCapitalWeatherCurrent').html('&nbsp;&nbsp;&nbsp;&nbsp;Today: &nbsp;&nbsp;'+ result.weatherData.weather[0].description +'&nbsp;&nbsp; || &nbsp;&nbsp; current temp: &nbsp;' + result.weatherData.main.temp +'&#8451<br>');
            $('#txtCapitalWeatherLo').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Low: ' + result.weatherData.main.temp_min +'&#8451<br>');
            $('#txtCapitalWeatherHi').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;High: ' + result.weatherData.main.temp_max +'&#8451<br>');
            
            
// wiki places of interest
            $.ajax({
                url: "./php/wikiPlaces.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    lat: capitalCityLat,
                    lng: capitalCityLon
                },
                success: function(result) {
                    console.log('wikiPlaces Data',result);
                    $('#wikiPlaces').html("");
                    if (result.status.name == "ok") {
                        for (var i=0; i<result.wikiPlaces.length; i++) {
                            $("#wikiPlaces").append('<li><a href=https://'+result.wikiPlaces[i].wikipediaUrl+'>'+ result.wikiPlaces[i].title +'</a></li>' 
                            )}
                            }
                
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                }
            });
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    }
});              
}
},
error: function(jqXHR, textStatus, errorThrown) {
console.log(textStatus, errorThrown);
}  
}); 
});

// New event for map click
map.on('click', function(e) {        
    var popLocation = e.latlng;
    $.ajax({
    url: "./php/openCage.php",
    type: 'GET',
    dataType: 'json',
    data: {
        lat: popLocation.lat,
        lng: popLocation.lng,
    },
    success: function(result) {

        if (result.data[0].components["ISO_3166-1_alpha-3"]) {
            console.log('openCage PHP',result);
              //console.log(typeof result);
            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;

            $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-3"]);
        
            let currentCountry = result.data[0].components["ISO_3166-1_alpha-3"];
            $("#selCountry").val(currentCountry).change();
        }
        else {
            console.log("clicked on water")
            console.log('openCage PHP',result);
            
            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;

        

            L.popup()
            .setLatLng([currentLat, currentLng])
            .setContent("<div><strong>" + result.data[0].formatted + "</strong></div>")
            .openOn(map);
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        console.log(jqXHR, errorThrown)
        
    }
    });        

});
