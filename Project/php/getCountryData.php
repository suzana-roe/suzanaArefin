<?php

 

    // ini_set('display_errors', 'On');

    // error_reporting(E_ALL);

 

    $executionStartTime = microtime(true);

 

    // get country border feature

 

    $countryBorders = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);

 

    $border = null;

 

    foreach ($countryBorders['features'] as $feature) {

 

        if ($feature["properties"]["iso_a2"] ==  strtoupper($_REQUEST['countryCode'])) {

 

            $border = $feature;

            break;

        

        }

        

    }
    echo json_encode($border);

 
 

?>