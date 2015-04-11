<?php
class Event extends Model {
	public function createEvent($event, $session_key) {
		// Get users credentials, see if they are an admin or leader and get their respective university id's and rso ids
		// This is more complicated than it has to be b/c of app
		// UV.id, R.id, U.id, U.role
		try {
			$stmt = $this->db->prepare("SELECT UV.id universityid, R.id rsoid, U.id userid, U.role userrole FROM sessions S 
				LEFT OUTER JOIN university_users UVU ON UVU.userid=S.userid 
				LEFT OUTER JOIN universities UV ON UV.id=UVU.universityid 
				LEFT OUTER JOIN users U ON U.id=S.userid
				LEFT OUTER JOIN rsos R ON R.leaderid=S.userid
				WHERE S.session=:session AND S.expire>NOW() AND (U.role='admin' OR U.role='leader') LIMIT 1");
			$stmt->execute(array('session' => $session_key));
			$result = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$result) {
				$this->NOAUTH['data']['message'] = 'Not authorized to create an event';
				return $this->NOAUTH;
			}

			// Create the new event
			$stmt = $this->db->prepare("INSERT INTO events (name, location_name, type, visibility, date, description, contactphone, contactemail, rsoid, universityid, location_lat, location_lng) 
				VALUES (:name, :location_name, :type, :visibility, :date, :description, :contactphone, :contactemail, :rsoid, :universityid, :location_lat, :location_lng)");
			
			// Fix date to insert into mysql
			$date = new DateTime($event['date']);
			$event['date'] = $date->format('Y-m-d H:i:s');

			$insert = array(
				':name' => $event['name'],
				':location_name' => $event['location'],
				':type' => $event['type'],
				':visibility' => $event['visibility'],
				':date' => $event['date'],
				':description' => $event['description'],
				':contactphone' => (!$event['contactphone']) ? null : $event['contactphone'],
				':contactemail' => (!$event['contactemail']) ? null : $event['contactemail'],
				':rsoid' => (!$result['rsoid']) ? null : $result['rsoid'],
				':universityid' => $result['universityid'],
				':location_lat' => $event['location_lat'],
				':location_lng' => $event['location_lng']
			);
			
			if(!$stmt->execute($insert)) {
				$this->ERROR['data']['message'] = 'Something went wrong :(';
				return $this->ERROR;
			}

			// $this->OK['input'] = $event;
			// $this->OK['data'] = $result;
			$this->OK['data']['message'] = 'Event created successfully';
			return $this->OK;
		}catch(PDOExecption $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	public function getUserEvents($session_key) {
		try {
			// retrieve ALL events that this user is eldigble to view
			$stmt = $this->db->prepare("SELECT S.userid FROM sessions S WHERE S.session=:session AND S.expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->NOAUTH['data']['message'] = 'Not authorized';
				return $this->NOAUTH;
			}

			// compile all events
			$stmt = $this->db->prepare("SELECT DISTINCT E.*, R.name rso, DATE_FORMAT(E.date, '%Y-%m-%dT%TZ') date FROM users U
				INNER JOIN university_users UU ON UU.userid=U.id
				LEFT OUTER JOIN rso_users RU ON RU.userid=U.id
				INNER JOIN events E ON E.universityid=UU.universityid AND (E.rsoid IS NULL OR E.rsoid=RU.rsoid OR E.visibility='public')
				LEFT OUTER JOIN rsos R ON R.id=E.rsoid
				WHERE U.id=:userid ORDER BY E.date ASC");

			$stmt->execute(array(':userid' => $user['userid']));
			$events = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if(!$events) {
				$this->ERROR['data']['message'] = 'No events found';
				return $this->ERROR;
			}

			$events_and_comments = array();
			// loop and get ids to do queries for comments
			$stmt = $this->db->prepare("SELECT CONCAT(U.firstname, ' ', U.lastname) name, C.*, DATE_FORMAT(C.created, '%Y-%m-%dT%TZ') created FROM comments C
				INNER JOIN users U ON U.id=C.userid 
				WHERE C.eventid=:eventid");
			foreach($events as $event) {
				$stmt->execute(array(':eventid' => $event['id']));
				$comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
				$events_and_comments[$event['id']] = $event;
				$events_and_comments[$event['id']]['comments'] = $comments;
			}


			$this->OK['data'] = array_values($events_and_comments);
			return $this->OK;
		}catch(PDOExecption $e) {
			$this->ERROR['data']['message'] = $e;
			return $this->ERROR;
		}// P, M, U
	}

	public function getEvents() {
		try {
			$stmt = $this->db->prepare("SELECT E.*, UV.name university, R.name rso FROM events E 
				LEFT OUTER JOIN universities UV ON UV.id=E.universityid
				LEFT OUTER JOIN rsos R ON R.id=E.rsoid
				WHERE E.visibility='public' AND E.date>NOW()");
			$stmt->execute();
			$events = $stmt->fetchAll(PDO::FETCH_ASSOC);

			return $events;
		}catch(PDOExecption $e) {

			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}
}
