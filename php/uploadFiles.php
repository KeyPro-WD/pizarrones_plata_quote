<?php
 	date_default_timezone_set("America/Mexico_City");
	$files_post = $_FILES['archivo'];
	$files = array();
	$files_count = count($files_post['name']);
	$file_keys = array_keys($files_post);

	for ($i = 0; $i < $files_count; $i++) { 
		foreach ($file_keys as $key) {
			$files[$i][$key] = $files_post[$key][$i];
		}
	}

	foreach ($files as $fileID => $file) {
		$fileContent = file_get_contents($file['tmp_name']);

		file_put_contents("../files/".$file['name'], $fileContent);
	}
?>