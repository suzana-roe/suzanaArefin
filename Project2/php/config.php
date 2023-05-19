<?php

$mysqli = new mysqli("213.171.200.21","suzanaarefin","hello1234@","CompanyDirectory");

// Check connection
if ($mysqli -> connect_errno) {
  echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
  exit();
}


?>