<?php
class Model {
	protected $OK = array('status' => '200', 'message' => 'OK', 'data' => array());
	protected $ERROR = array('status' => '400', 'message' => 'ERROR', 'data' => array());
	protected $NOAUTH = array('status' => '401', 'message' => 'NOT AUTHORIZED', 'data' => array());

	protected $db = null;

	public function __construct() {
		try {
			$this->db = new PDO('mysql:host=127.0.0.1;dbname=collegeevent', 'cnt4710', 'password123');
			date_default_timezone_set('America/New_York');
		}catch(PDOExecption $e) {
			echo $e->getMessage();
		}
	}

	public function __destruct() {
		$this->db = null;
	}
}
?>