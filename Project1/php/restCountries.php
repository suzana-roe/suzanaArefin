<?php

	$ch = curl_init();

	$url='https://restcountries.com/v3.1/all?';



	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$result=curl_exec($ch);

	if ($e = curl_error($ch)) {
		echo $e;
	}
	else {
		$decoded = json_decode($result, true);
		print_r($decoded);
	}

	curl_close($ch);

?>
