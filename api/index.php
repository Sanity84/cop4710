<?php
require '../vendor/autoload.php';
require 'api.inc.php';

$app = new \Slim\Slim();
$app->contentType('application/json');


$app->get('/test', function() use ($app) {
	$foo = $app->getCookie('session');
	echo json_encode(array('session' => $foo), JSON_PRETTY_PRINT);
});


// Create user and get a session going for them
$app->post('/user', function() use ($app) {
	$api = new Api();
	$credentials = json_decode($app->request->getBody(), true);
	echo json_encode($api->createUser($credentials), JSON_PRETTY_PRINT);
});

// Auth user
$app->get('/user', function() use ($app) {
	$api = new Api();
	$username = $_SERVER['PHP_AUTH_USER'];
	$password = $_SERVER['PHP_AUTH_PW'];
	echo json_encode($api->getUser($username, $password), JSON_PRETTY_PRINT);
});

// Get user's university! (User must be logged in)
$app->get('/user/university', function() use ($app) {
	$api = new Api();
	$session_key = $app->getCookie('session');
	echo json_encode($api->getUserUniversity($session_key), JSON_PRETTY_PRINT);
});

// Save userUniversity
$app->post('/user/university', function() use ($app) {
	$api = new Api();
	$session_key = $app->getCookie('session');
	$university = json_decode($app->request->getBody(), true);
	echo json_encode($api->createUserUniversity($session_key, $university), JSON_PRETTY_PRINT);
});


$app->get('/session', function() use ($app) {
	$api = new Api();
	$session_key = $app->getCookie('session');
	echo json_encode($api->getSession($session_key), JSON_PRETTY_PRINT);
});


$app->delete('/session', function() use ($app) {
	$api = new Api();
	$session_key = $app->getCookie('session');
	echo json_encode($api->deleteSession($session_key), JSON_PRETTY_PRINT);
});

// Admin create a new university
$app->post('/university', function() use ($app) {
	$api = new Api();
	$university = json_decode($app->request->getBody(), true);
	$session_key = $app->getCookie('session');
	echo json_encode($api->createUniversity($session_key, $university), JSON_PRETTY_PRINT);
});

// Public functions, anyone can access
$app->get('/university(/:id)', function($id = null) use ($app) {
	$api = new Api();
	if($id == null)
		echo json_encode($api->getUniversities(), JSON_PRETTY_PRINT);
	else
		echo json_encode($api->getUniversity($id), JSON_PRETTY_PRINT);
});

$app->run();


?>




