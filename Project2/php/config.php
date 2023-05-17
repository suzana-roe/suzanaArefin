<?php

	// connection details for MySQL database

	//$cd_host = "127.0.0.1";
	//$cd_port = 3306;
	//$cd_socket = "";

	// database name, username and password

	//$cd_dbname = "companydirectory";
	//$cd_user = "root";
	//$cd_password = "";


	$mysqli = new mysqli("213.171.200.21","suzanaarefin","hello1234@","CompanyDirectory");

	// Check connection
	if ($mysqli -> connect_errno) {
	  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
	  exit();
	}


?>