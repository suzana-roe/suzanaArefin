<?php

	$executionStartTime = microtime(true) / 1000;
    //$url='https://restcountries.eu/rest/v2/alpha/'. $_REQUEST['lat'];
    //$url= 'https://api.opencagedata.com/geocode/v1/json?q=LAT+LNG&key=d15534ffc3514c07817111eacd8ea75b';
    $url = 'https://api.opencagedata.com/geocode/v1/json?q='. $_REQUEST['lat'] .'+' . $_REQUEST['lng'] . '&key=9729df83a494483fb80bc41a2f101f44';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>