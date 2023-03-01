<?php

 

    // ini_set('display_errors', 'On');

    // error_reporting(E_ALL);

 

    $executionStartTime = microtime(true);

 

    // get country border feature

 

<<<<<<< HEAD
    $countryBorders = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);
=======
    $countryBorders = json_decode(file_get_contents("../json/countries_large.geo.json"), true);
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07

 

    $border = null;

 

    foreach ($countryBorders['features'] as $feature) {

 

<<<<<<< HEAD
        if ($feature["properties"]["iso_a2"] ==  strtoupper($_REQUEST['countryCode'])) {
=======
        if ($feature["properties"]["ISO_A3"] ==  $_REQUEST['countryCode']) {
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07

 

            $border = $feature;

            break;

        

        }

        

    }
<<<<<<< HEAD
    echo json_encode($border);
=======

 
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07

    // get API data

 

    // first API: geonames countryInfo

 

<<<<<<< HEAD
    /*$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'] . '&username=suzana.arefin&style=full';
=======
    $url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'] . '&username=suzana.arefin&style=full';
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07

 

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    curl_setopt($ch, CURLOPT_URL,$url);

 

    $result=curl_exec($ch);

 

    curl_close($ch);

 

    $countryInfo = json_decode($result,true);

 

    // subsequent APIs: 

    //repeat first API code block for each API and store to descriptively named variable as per “$countryInfo”

 

    $output['status']['code'] = "200";

    $output['status']['name'] = "ok";

    $output['status']['description'] = "success";

    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    $output['data']['border'] = $border;

    $output['data']['countryInfo'] = $countryInfo;

    //repeat above line for each API result’s variable

 

    header('Content-Type: application/json; charset=UTF-8');

 

<<<<<<< HEAD
    echo json_encode($output);*/
=======
    echo json_encode($output);
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07

 

?>