<?php
require '../vendor/autoload.php';
require 'api.inc.php';

// Newer more organized version below
require 'models/model.inc.php';
require 'models/event.inc.php';
require 'models/rso.inc.php';

$app = new \Slim\Slim();
$app->contentType('application/json');

$app->get('/getAllUsers', function() use ($app) {
	$api = new Api();
	echo json_encode($api->getAllUsers(), JSON_PRETTY_PRINT);
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

$app->post('/rsorequest', function() use ($app) {
	$api = new Api();
	$rso = json_decode($app->request->getBody(), true);
	$session_key = $app->getCookie('session');
	echo json_encode($api->createRsoRequest($rso, $session_key), JSON_PRETTY_PRINT);
});

$app->get('/rsorequest', function() use ($app) {
	$api = new Api();
	$session_key = $app->getCookie('session');
	echo json_encode($api->getRsoRequests($session_key), JSON_PRETTY_PRINT);
});

// Admin approve RSO and make it legit
$app->post('/rso', function() use ($app) {
	$api = new Api();
	$session_key = $app->getCookie('session');
	$rso = json_decode($app->request->getBody(), true);
	echo json_encode($api->createRso($session_key, $rso), JSON_PRETTY_PRINT);
});

//****************************************
// NEW VERSION OF ORGANIZATION OF MODELS 
//****************************************

// Create Event
$app->post('/event', function() use ($app) {
	$event = new Event();
	$event_details = json_decode($app->request->getBody(), true);
	$session_key = $app->getCookie('session');
	echo json_encode($event->createEvent($event_details, $session_key), JSON_PRETTY_PRINT);
});

// Get all public events
$app->get('/event', function() use ($app) {
	$event = new Event();
	echo json_encode($event->getEvents(), JSON_PRETTY_PRINT);
});

// Get all events by university id 
$app->get('/university/:university_id/event/:private', function($university_id = null, $private = false) use ($app) {
	$event = new Event();
	$session_key = $app->getCookie('session'); // Cookie may or may not exist, that is ok
	echo json_encode($event->getUniversityEvents($university_id, $session_key), JSON_PRETTY_PRINT);
});

// Get all events by university / rso / 
$app->get('/university/:university_id/rso/:rso_id/event/:private', function($university_id = null, $rso_id = null, $private = false) use ($app) {
	$event = new Event();
	$session_key = $app->getCookie('session'); // Cookie may or may not exist, that is ok
	echo json_encode($event->getUniversityRsoEvents($university_id, $session_key), JSON_PRETTY_PRINT);
});

// Rso
$app->get('/university/:universityid/rso(/:member)', function($universityid = null, $member = false) use ($app) {
	$rso = new Rso();
	$session_key = $app->getCookie('session');
	echo json_encode($rso->getUniversityRso($universityid, $session_key, $member), JSON_PRETTY_PRINT);
});

$app->post('/user/rso', function() use ($app) {
	$rso = new Rso();
	$rso_data = json_decode($app->request->getBody(), true);
	$session_key = $app->getCookie('session');
	echo json_encode($rso->createUserRso($rso_data, $session_key), JSON_PRETTY_PRINT);
});

$app->get('/rso/:rsoid/event', function($rsoid = null) use ($app) {
	$rso = new Rso();
	$session_key = $app->getCookie('session');
	echo json_encode($rso->getRsoEvents($rsoid, $session_key), JSON_PRETTY_PRINT);
});

$app->run();


