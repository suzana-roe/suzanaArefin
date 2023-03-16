<?php

$curl = curl_init();

curl_setopt_array($curl, [

	CURLOPT_URL => 'http://api.mediastack.com/v1/news?access_key=b7dc09cfa52a191eea371e8d890b176a&countries=' . $_REQUEST['newsCountry'],
	// CURLOPT_URL => "https://newscatcher.p.rapidapi.com/v1/search?topic=news&country=" . $_REQUEST['newsCountry'] . "&media=True",
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_SSL_VERIFYPEER => false,
	// CURLOPT_HTTPHEADER => [
	// 	"x-rapidapi-host: newscatcher.p.rapidapi.com",
	// 	"x-rapidapi-key: 219046d855msh2b22bd8ef9a95fap16772ajsn76b8f9e38c88"
	// ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}
