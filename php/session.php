<?php
	session_start();

	if (isset($_SESSION['user_qa'])) {
		$user_qa = $_SESSION['user_qa'];
	} else {
		header('Location: https://keypro.com.mx/QA');
	}
?>