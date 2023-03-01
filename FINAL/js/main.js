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
var map
var countryOptGeo;

function initialiseMap() {
    //map initialisation
    map = L.map('map').setView([25.025885, -78.035889], 6);
    
    //google street
    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });
    googleStreets.addTo(map);

}

$(document).ready(function() {
    initialiseMap();

// Building the countries <select> list
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
                setCurrentLocationInMap();
                
            //sort options alphabetically
            $("#selCountry").html($("#selCountry option").sort(function (a, b) {
                return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
            }))
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });


function setCurrentLocationInMap() {
        
    if (navigator.geolocation) {
      var options = {timeout:60000};
      navigator.geolocation.getCurrentPosition(setCurrentCountry, setDefaultCountry, options);
    } else {
        setDefaultCountry();
    }
}

function setDefaultCountry() {
    $("#selCountry").val($("#selCountry option:first").val()).change();
}

function setCurrentCountry(position) {
    var userLongitude = position.coords.longitude;
    var userLatitude = position.coords.latitude;
    $.ajax({
        url: "./php/openCage.php",
        type: 'POST',
        dataType: 'json',
        data: {
            userLongitude,
            userLatitude
        },
        success: function(result) {
            $('#countryList option[value = ' + result['data'] +' ]').prop("selected", true).change();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error');
            setDefaultCountry();
        }
    });
    
}

countryOptGeo= L.geoJson();


// adding borders to the map
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
});

    $('#selCountry').change(function() {

        var country = $( "#countryList option:selected" ).text();
        var countryCode = this.value;
        
         $.ajax({
             url: "./php/getCountryInfo.php",
             type: 'POST',
             dataType: 'json',
             data: {
                 country: country,
              },
             success: function(result) {
                countryOptGeo.clearLayers();
                clusterMarkers.clearLayers();
                polyJson = result;
                countryOptGeo.addData( polyJson).setStyle( polygonStyle ).addTo( map );
                map.fitBounds(countryOptGeo.getBounds());
                countryCapital (countryCode);
                countryInfo (country, $("#countryList").val());  
                getCapitalWeather(); 
                       
             },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
             }
         }); 
     });
    




