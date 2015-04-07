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
			$stmt = $this->db->prepare("INSERT INTO events (name, location, type, visibility, date, description, contactphone, contactemail, rsoid, universityid) 
				VALUES (:name, :location, :type, :visibility, :date, :description, :contactphone, :contactemail, :rsoid, :universityid)");
			
			// Fix date to insert into mysql
			$date = new DateTime($event['date']);
			$event['date'] = $date->format('Y-m-d H:i:s');

			$insert = array(
				':name' => $event['name'],
				':location' => $event['location'],
				':type' => $event['type'],
				':visibility' => $event['visibility'],
				':date' => $event['date'],
				':description' => $event['description'],
				':contactphone' => $event['contactphone'],
				':contactemail' => $event['contactemail'],
				':rsoid' => $result['rsoid'],
				':universityid' => $result['universityid']
			);
			if(!$stmt->execute($insert)) {
				$this->ERROR['data']['message'] = 'Something went wrong :(';
				return $this->ERROR;
			}

			$this->OK['input'] = $event;
			// $this->OK['data'] = $result;
			return $this->OK;
		}catch(PDOExecption $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
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
?>