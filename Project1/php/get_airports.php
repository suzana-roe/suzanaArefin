<?php
$country_code = $_GET["country_code"];
$app_id = "ea3d161a";
$app_key = "70b442363696c70d8657ca14858ea90c";
$format = "json"; // or xml

$url = "https://airlabs.co/api/v6/airports?filter_country_code=us&api_key=58368c73-fec1-4214-a5c7-ca85169e04e6";

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// Execute the API call
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
  $error = curl_error($ch);
  echo "Error: $error";
  exit;
}

// Close cURL session
curl_close($ch);

// Parse the API response
$data = json_decode($response, true);
$airports = array();
foreach ($data["airports"] as $airport) {
  $lat = $airport["latitude"];
  $lng = $airport["longitude"];
  $name = $airport["name"];
  $airports[] = array("lat" => $lat, "lng" => $lng, "name" => $name);
}

// Send the airports array as a JSON response
header("Content-Type: application/json");
echo json_encode($airports);
