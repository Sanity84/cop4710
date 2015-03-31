<?php

class Api {

	private $DB_HOST = '127.0.0.1';
	private $DB_USER = 'cnt4710';
	private $DB_PASS = 'password123';
	private $DB_NAME = 'collegeevent';
	private $db;

	// return types. Use these as a template for returning all data, if an error occured use NOAUTH or ERROR, all successfull
	// queries shoudl return OK, inject message/data into the data array - Andrew
	protected $OK = array('status' => '200', 'message' => 'OK', 'data' => array());
	protected $ERROR = array('status' => '400', 'message' => 'ERROR', 'data' => array());
	protected $NOAUTH = array('status' => '401', 'message' => 'NOT AUTHORIZED', 'data' => array());

	public function __construct() {
		date_default_timezone_set('America/New_York');
		$this->db = new mysqli($this->DB_HOST, $this->DB_USER, $this->DB_PASS, $this->DB_NAME);
		$this->db->set_charset("utf8");
	}

	public function __destruct() {
		$this->db->close();
	}

	public function createUser($credentials) {
		// Sanitize
		if(!$credentials['username']) {$this->ERROR['data']['message'] = 'Username required'; return $this->ERROR;}
		$credentials['username'] = strtolower($this->db->real_escape_string($credentials['username']));
		if(!$credentials['password']) { $this->ERROR['data']['message'] = 'Password required'; return $this->ERROR; }
		$credentials['password'] = $this->db->real_escape_string($credentials['password']);
		if(!$credentials['firstname']) { $this->ERROR['data']['message'] = 'Firstname required'; return $this->ERROR; }
		$credentials['firstname'] = $this->db->real_escape_string($credentials['firstname']);
		if(!$credentials['lastname']) { $this->ERROR['data']['message'] = 'Lastname required'; return $this->ERROR; }
		$credentials['lastname'] = $this->db->real_escape_string($credentials['lastname']);
		if(!$credentials['role']) { $this->ERROR['data']['message'] = 'Role required'; return $this->ERROR; }
		$credentials['role'] = $this->db->real_escape_string($credentials['role']);
		if(!$credentials['email']) { $this->ERROR['data']['message'] = 'Email required'; return $this->ERROR; }
		$credentials['email'] = strtolower($this->db->real_escape_string($credentials['email']));

		// Check if username is already taken
		$query = sprintf("SELECT U.id FROM users U WHERE U.username='%s' LIMIT 1", $credentials['username']);
		$result = $this->db->query($query);
		if($result->num_rows > 0) {
			$this->ERROR['data']['message'] = 'Usernamem already exists';
			return $this->ERROR;
		}
		// Check if email is already in use
		$query = sprintf("SELECT U.id FROM users U WHERE U.email='%s' LIMIT 1", $credentials['email']);
		$result = $this->db->query($query);
		if($result->num_rows > 0) {
			$this->ERROR['data']['message'] = 'Email already in use';
			return $this->ERROR;
		}

		// Generate session key
		do {
			$bytes = openssl_random_pseudo_bytes(32, $cstrong);
		} while(!$cstrong);
		$credentials['session'] = bin2hex($bytes);

		// Insert new user and session for the user
		$query = sprintf("START TRANSACTION;"
		."INSERT INTO users (username, password, firstname, lastname, role, email) VALUES ('%s', '%s', '%s', '%s', '%s', '%s');"
		."INSERT INTO sessions (session, expire, userid) VALUES ('%s', DATE_ADD(NOW(), INTERVAL 30 DAY), LAST_INSERT_ID());"
		."COMMIT;", 
			$credentials['username'],
			password_hash($credentials['password'], PASSWORD_BCRYPT),
			$credentials['firstname'],
			$credentials['lastname'],
			$credentials['role'],
			$credentials['email'],
			$credentials['session']
		);
		if(!$this->db->multi_query($query)) {
			$this->ERROR['data']['message'] = 'Could not save user, check data';
			return $this->ERROR;
		}

		$this->OK['data']['session'] = $credentials['session'];
		$this->OK['data']['firstname'] = $credentials['firstname'];
		$this->OK['data']['role'] = $credentials['role'];
		$this->OK['data']['message'] = 'User created successfully';
		return $this->OK;
	}

	public function getUser($username, $password) {
		if(!$username || !$password) {
			$this->ERROR['data']['message'] = 'Username / Password required';
			return $this->ERROR;
		}
		$username = $this->db->real_escape_string($username);
		$password = $this->db->real_escape_string($password);
		// Validate user
		$query = sprintf("SELECT U.id, U.username, U.password, U.firstname, U.role FROM users U WHERE U.username='%s' LIMIT 1", $username);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'Username does not exist';
			return $this->ERROR;
		}
		$row = $result->fetch_assoc();
		if(!password_verify($password, $row['password'])) {
			$this->NOAUTH['data']['message'] = 'Invalid username / password';
			return $this->NOAUTH;
		}
		// User is valid, create and return session for them
		// Generate session key
		do {
			$bytes = openssl_random_pseudo_bytes(32, $cstrong);
		} while(!$cstrong);
		$session = bin2hex($bytes);

		$query = sprintf("START TRANSACTION;"
		."DELETE FROM sessions WHERE userid=%d;"
		."INSERT INTO sessions (session, expire, userid) VALUES ('%s', DATE_ADD(NOW(), INTERVAL 30 DAY), %d);"
		."COMMIT;", 
			$row['id'], 
			$session, 
			$row['id']
		);
		if(!$this->db->multi_query($query)) {
			$this->ERROR['data']['message'] = 'An error occured, try again';
			return $this->ERROR;
		}
		$this->OK['data']['role'] = $row['role'];
		$this->OK['data']['session'] = $session;
		$this->OK['data']['firstname'] = $row['firstname'];
		return $this->OK;
	}

	// Retrieve university that is associated with this users session key
	public function getUserUniversity($session_key) {
		// Sanatize
		$session_key = $this->db->real_escape_string($session_key);

		// Validate session key
		$query = sprintf("SELECT S.userid FROM sessions S WHERE S.session='%s' AND S.expire>NOW() LIMIT 1", $session_key);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'Invalid or expired session';
			return $this->ERROR;
		}
		$user = $result->fetch_assoc();

		// Check university_users table for the users university!
		$query = sprintf("SELECT UU.universityid FROM university_users UU WHERE UU.userid=%d LIMIT 1", $user['userid']);
		$result = $this->db->query($query);
		$university = $result->fetch_assoc();
		
		// Get university goodness
		$query = sprintf("SELECT * FROM universities UV WHERE UV.id=%d LIMIT 1", $university['universityid']);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'University does not exist';
			return $this->ERROR;
		}
		$university = $result->fetch_assoc();

		// Get Administrator
		$query = sprintf("SELECT * FROM users U WHERE U.id=%d LIMIT 1", $university['userid']);
		$result = $this->db->query($query);
		$administrator = $result->fetch_assoc();
		unset($administrator['password']);

		// Get images
		$query = sprintf("SELECT I.name, I.path FROM images I, image_universities IU WHERE IU.imageid=I.id AND IU.universityid=%d", (int)$id);
		$results = $this->db->query($query);
		$images = array();
		while($row = $results->fetch_assoc())
			$images[] = $row;

		// Put together
		$this->OK['data']['university'] = $university;
		$this->OK['data']['administrator'] = $administrator;
		$this->OK['data']['images'] = $images;
		return $this->OK;
	}

	public function createUserUniversity($session_key, $university) {
		// Sanitize
		$university['id'] = (int)$university['id'];
		$session_key = $this->db->real_escape_string($session_key);

		// Verify session
		$query = sprintf("SELECT S.userid FROM sessions S WHERE S.session='%s' AND S.expire>NOW() LIMIT 1", $session_key);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'Invalid or expired session';
			return $this->ERROR;
		}
		$row = $result->fetch_assoc();

		// Validate that university exists
		$query = sprintf("SELECT * FROM universities UV WHERE UV.id=%d LIMIT 1", $university['id']);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'University does not exist';
			return $this->ERROR;
		}
		$university = $result->fetch_assoc();

		// Insert association with user and university
		$query = sprintf("INSERT INTO university_users (universityid, userid) VALUES (%d, %d)", $university['id'], $row['userid']);
		if(!$this->db->query($query)) {
			$this->ERROR['data']['message'] = 'Could not save university user data';
			return $this->ERROR;
		}
		
		$this->OK['data'] = $university;
		return $this->OK;
	}

	public function getSession($session_key) {
		$session_key = $this->db->real_escape_string($session_key);
		$query = sprintf("SELECT S.userid FROM sessions S WHERE S.session='%s' AND S.expire>NOW() LIMIT 1", $session_key);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'Invalid or expired session';
			return $this->ERROR;
		}
		$row = $result->fetch_assoc();

		$query = sprintf("SELECT U.role, U.firstname FROM users U WHERE U.id=%d", $row['userid']);
		$result = $this->db->query($query);
		$row = $result->fetch_assoc();
		$this->OK['data']['role'] = $row['role'];
		$this->OK['data']['firstname'] = $row['firstname'];
		$this->OK['data']['session'] = $session_key;
		return $this->OK;
	}

	public function deleteSession($session_key) {
		$session_key = $this->db->real_escape_string($session_key);
		$query = sprintf("DELETE FROM sessions WHERE session='%s'", $session_key);
		$this->db->query($query);
		return $this->OK;
	}

	// {"university_name": "UCF", "description": "Go Knights!", "location": "0.00 0.00", "adminid": "1"}
	public function createUniversity($session_key, $university) {
		// Sanatize
		$session_key = $this->db->real_escape_string($session_key);
		if(!$university['name']) { $this->ERROR['data']['message'] = 'University name cannot be blank'; return $this->ERROR; }
		$university['name'] = $this->db->real_escape_string($university['name']);
		if(!$university['location']) { $this->ERROR['data']['message'] = 'University location cannot be blank'; return $this->ERROR; }
		$university['location'] = $this->db->real_escape_string($university['location']);
		if(!$university['description']) { $this->ERROR['data']['message'] = 'University description cannot be blank'; return $this->ERROR; }
		$university['description'] = $this->db->real_escape_string($university['description']);

		// Verify user status !! ERROR IS SOMEWHERE HERE!
		$query = sprintf("SELECT U.id, U.role, S.userid FROM users U LEFT OUTER JOIN sessions S ON S.userid=U.id WHERE S.session='%s' AND S.expire>NOW() LIMIT 1", $session_key);
		$result = $this->db->query($query);
		$user = $result->fetch_assoc();
		if(!$user['role']) {
			$this->NOAUTH['data']['message'] = 'Not authorized';
			return $this->NOAUTH;
		}
		// User is authorized!

		// Enter university data
		$query = sprintf("INSERT INTO universities (name, location, description, userid) VALUES ('%s', '%s', '%s', %d)", 
			$university['name'],
			$university['location'],
			$university['description'],
			$user['id']
		);
		$this->db->query($query);

		// Retrieve back data from newly created university
		$query = sprintf("SELECT * FROM universities UV WHERE UV.userid=%d LIMIT 1", $user['id']);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'Something went wrong! Try again';
			return $this->ERROR;
		}
		$university = $result->fetch_assoc();

		// Create a university_users entry as well!
		$query = sprintf("INSERT INTO university_users (universityid, userid) VALUES ('%s', '%s')", 
			$university['id'],
			$user['id']
		);
		$this->db->query($query);

		$this->OK['data'] = $university;
		return $this->OK;
	}

	public function getUniversities() {
		$query = sprintf("SELECT UV.id, UV.name, UV.location, UV.description FROM universities UV");
		$result = $this->db->query($query);
		$universities = array();
		while($row = $result->fetch_assoc())
			$universities[] = $row;
		return $universities;
	}

	public function getUniversity($id) {
		$query = sprintf("SELECT * FROM universities UV WHERE UV.id=%d LIMIT 1", (int)$id);
		$result = $this->db->query($query);
		if($result->num_rows < 1) {
			$this->ERROR['data']['message'] = 'University does not exist';
			return $this->ERROR;
		}
		$university = $result->fetch_assoc();

		// Get Administrator
		$query = sprintf("SELECT * FROM users U WHERE U.id=%d LIMIT 1", $university['userid']);
		$result = $this->db->query($query);
		$administrator = $result->fetch_assoc();
		unset($administrator['password']);

		// Get images
		$query = sprintf("SELECT I.name, I.path FROM images I, image_universities IU WHERE IU.imageid=I.id AND IU.universityid=%d", (int)$id);
		$results = $this->db->query($query);
		$images = array();
		while($row = $results->fetch_assoc())
			$images[] = $row;

		// Put together
		$this->OK['data']['university'] = $university;
		$this->OK['data']['administrator'] = $administrator;
		$this->OK['data']['images'] = $images;
		return $this->OK;
	}

}
?>