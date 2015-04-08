<?php
class Rso extends Model {
	public function getUniversityRso($university, $session_key, $member) {
		try {
			// Get associated RSOs with the logged in session user
			if($member) {
				// retrieve list of rsos by getting session user id
				$stmt = $this->db->prepare("SELECT R.* FROM sessions S
					INNER JOIN rso_users RU ON RU.userid=S.userid
					INNER JOIN rsos R ON R.id=RU.rsoid
					WHERE S.session=:session AND S.expire>NOW()");
				$stmt->execute(array(':session' => $session_key));
				$rsos = $stmt->fetchAll(PDO::FETCH_ASSOC);
				if(!$rsos) {
					$this->ERROR['data']['message'] = 'Not a member of any rsos';
					return $this->ERROR;
				}
				// Check for no associates and return ERROR not exist

				$this->OK['data'] = $rsos;
				return $this->OK;

			}else{ // This is a public get request, just list all rsos for the indicated university id
				$stmt = $this->db->prepare("SELECT R.* FROM universities UV
					LEFT OUTER JOIN rsos R ON R.universityid=UV.id
					WHERE UV.id=:universityid");
				$stmt->execute(array(':universityid' => $university));
				$rsos = $stmt->fetchAll(PDO::FETCH_ASSOC);
				if(!$rsos) {
					$this->ERROR['data']['message'] = 'University does not exist or has no RSOs';
					return $this->ERROR;
				}
				$this->OK['data'] = $rsos;
				return $this->OK;
			}
		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	public function createUserRso($rso, $session_key) {
		// see if this user is already part of this rso! rso_members check!
		// returns session if the rsoid is NOT assocated with the user, returns nothing if user is already a part of this
		try {
			$stmt = $this->db->prepare("SELECT S.* FROM sessions S
				LEFT OUTER JOIN rso_users RU ON RU.userid=S.userid AND RU.rsoid=:rsoid
				WHERE S.session=:session AND S.expire>NOW() AND RU.rsoid IS NULL LIMIT 1");
			$stmt->execute(array(':session' => $session_key, ':rsoid' => $rso['rsoid']));
			if($stmt->rowCount() < 1) {
				$this->ERROR['data']['message'] = 'You already already a member!';
				return $this->ERROR;
			}
			$user = $stmt->fetch(PDO::FETCH_ASSOC);

			$stmt = $this->db->prepare("INSERT INTO rso_users (rsoid, userid) VALUES (:rsoid, :userid)");
			$exec = $stmt->execute(array(':rsoid' => $rso['rsoid'], ':userid' => $user['userid']));
			if(!$exec) {
				$this->ERROR['data']['message'] = 'Something went wrong!';
				return $this->ERROR;
			}
			$this->OK['data']['message'] = 'Joined RSO';
			return $this->OK;
		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	public function getRsoEvents($rsoid, $session_key) {
	// check that the user is authorized to access these super secret rso events
		$stmt = $this->db->prepare("SELECT E.* FROM sessions S
			INNER JOIN rso_users RU ON RU.userid=S.userid AND RU.rsoid=:rsoid
			INNER JOIN events E ON E.rsoid=RU.rsoid
			WHERE S.session=:session AND S.expire>NOW()");
		$stmt->execute(array(':session' => $session_key, ':rsoid' => $rsoid));
		$events = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if(!$events) {
			$this->ERROR['data']['message'] = 'You are not a member';
			return $this->ERROR;
		}
		$this->OK['data'] = $events;
		return $this->OK;

	}
}




