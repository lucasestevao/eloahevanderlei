<?php
	$email_to = 'eloahevanderlei@gmail.com';
	$email_subject = '[ELOAH&VANDERLEI] Mensagem via site';
	$return = $_POST;

	function fail( $error ) {
		returnData(true, 'A mensagem não pôde ser enviada:<br />'.$error);
	}

	function success() {
		returnData(false, 'Email enviado com sucesso!');
	}

	function returnData($error, $message){
		$return['error'] = $error;
		$return['message'] = $message;

		echo json_encode($return);
		die();
	}

	if (!isset( $_POST['name'] ) || !isset( $_POST['email'] ) || !isset( $_POST['message'] )) {
		fail('Ops! Algo deu errado, mas tente novamente, por favor.');
	}

	$name = $_POST['name'];
	$email = $_POST['email'];
	$message = $_POST['message'];
	$error_message = '';
	$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
	$string_exp = "/^[A-Za-z .'-çÇãáéíóúÁÉÍÓÚâêôÂÊÔàèìòùÀÈÌÒÙ]+$/";

	if ( !preg_match( $email_exp, $email) ) {
		$error_message .= 'Huuum... parece que seu email não é válido.<br />';
	}

	if ( !preg_match( $string_exp, $name) ) {
		$error_message .= 'Que tipo de nome é esse?! Troca isso, vai?<br />';
	}

	if ( $message == "") {
		$error_message .= 'Escreve uma mensagem de verdade, do fundo do s2!<br />';
	}

	if ( strlen( $error_message ) > 0 ) {
		fail( $error_message );
	}

	$email_message = 'Detalhes da mensagem abaixo:\n\n';

	function clean_string( $string ) {
		$bad = array( 'content-type', 'bcc:', 'to:', 'cc:', 'href' );

		return str_replace( $bad, '', $string );
	}

	$email_message = clean_string( $message );

	$from="From: $name<$email>\r\nReturn-path: $email"; 

	mail($email_to, $email_subject, $email_message, $from);

	success();
?>