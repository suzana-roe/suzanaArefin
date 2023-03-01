<?php

	$executionStartTime = microtime(true) / 1000;
<<<<<<< HEAD
	$url='https://restcountries.com/v3.1/alpha/'.$_REQUEST['code'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$currencies = json_decode($result,true);
=======
	$url='https://restcountries.com/v3.1/name/'. $_REQUEST['country'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07


<<<<<<< HEAD
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] ['currencies'] = $currencies;
	$output['data']= $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
=======
	curl_close($ch);
>>>>>>> acbb3cebcde973522ec912d3c1979663d3517b07

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	// $output['currency'] = $decode["currencies"][0];
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
