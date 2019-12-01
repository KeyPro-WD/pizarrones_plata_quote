<?php
 	date_default_timezone_set("America/Mexico_City");
	$lista = null;
	$lista_orden = [];
	$directorio = opendir('../files/');

	while ($elemento = readdir($directorio)) {
		if ($elemento != "." && $elemento != "..") {
			$fecha_creacion_numero = filectime("../files/" . $elemento);
			$lista_orden[$fecha_creacion_numero] = $elemento;
			krsort($lista_orden);
		}
	}

	foreach ($lista_orden as $key => $val) {
		$fecha_creacion = date("d/m/Y H:i:s", filectime("../files/" . $val));

		$lista .= "<tr>
			<td>$val</td>
			<td class='tdCenter'>$fecha_creacion</td>
			<td class='tdCenter'>
				<a class='btnToolsFile' title='Visualizar archivo.' href='files/$val' target='_blank'>
					<img src='img/See.png'>
				</a>

				<a class='btnToolsFile' title='Descargar archivo.' href='files/$val' download='files/$val'>
					<img src='img/Download.png'>
				</a>

				<button id='eliminar' data-nombre_eliminar='$val' class='btnToolsFile' title='Eliminar archivo de forma permanente.'>
					<img src='img/Eliminar.png'>
				</button>
			</td>
		</tr>";
	}

	if ($lista != "") {
		echo $lista;
	} else {
		echo "<tr>
			<td colspan='3' style='text-align: center;'>No hay archivos para mostrar.</td>
		</tr>";
	}
?>