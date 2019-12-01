<?php
    date_default_timezone_set("America/Mexico_City");
	$directorio = opendir('../files/');

	while ($elemento = readdir($directorio)) {
		if ($elemento == $_POST['nombre_archivo']) {
            if (unlink("../files/" . $elemento)) {
                echo "true";
            } else {
                echo "false";
            }

            break;
        }
	}
?>