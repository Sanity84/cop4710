<?php
class Rso extends Model {
	public function getUniversityRso($university, $session_key, $member) {
		try {
			// Get associated RSOs with the logged in session user
			if($member) {
				// retrieve list of rsos by getting session user id
				$stmt = $this->db->prepare("SELECT R.* FROM sessions S
					INNER JOIN rso_users RU ON RU.userid=S.userid
					INNER JOIN rsos R ON R.id=RU.rsoid AND R.pending=false
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
					LEFT OUTER JOIN rsos R ON R.universityid=UV.id AND R.pending=false
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
				$this->ERROR['data']['message'] = 'You already are a member!';
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

	public function createUniversityRso($rso, $universityid, $session_key) {
		try {
			$stmt = $this->db->prepare("SELECT * FROM sessions WHERE session=:session AND expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->ERROR['data']['message'] = 'Not authorized';
				return $this->ERROR;
			}

			$this->db->beginTransaction();
			$stmt = $this->db->prepare("SELECT id, role FROM users where email=:email");
			$stmt->execute(array(
				':email' => $rso['members']['leader'].$rso['email_domain']
			));
			$leader = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$leader) {
				$this->db->rollBack();
				$this->ERROR['data']['message'] = 'Leader email is not valid';
				return $this->ERROR;
			}else if($leader['role'] !== 'student') {
				$this->db->rollBack();
				$this->ERROR['data']['message'] = 'Proposed leader may already be leader of another RSO';
				return $this->ERROR;
			}
			$stmt = $this->db->prepare("INSERT INTO rsos (name, description, universityid, type, leaderid) 
				VALUES (:name, :description, :universityid, :type, :leaderid)");
			$exec = $stmt->execute(array(
				':name' => $rso['name'],
				':description' => $rso['description'],
				':universityid' => $universityid,
				':type' => $rso['type'],
				':leaderid' => $leader['id']
			));
			// $stmt = $this->db->prepare("SELECT LAST_INSERT_ID() as id");
			$rsoid = $this->db->lastInsertId();

			if(!$exec) {
				$this->db->rollBack();
				$this->ERROR['data']['message'] = 'Check all data is filled out';
				return $this->ERROR;
			}
			// Validate every email
			$validate_email = $this->db->prepare("SELECT id from users WHERE email=:email LIMIT 1");
			$insert_user = $this->db->prepare("INSERT INTO rso_users (rsoid, userid) VALUES (:rsoid, :userid)");
			// $this->ERROR['data']['message'] = $rso;
			// return $this->ERROR;
			if(!$rso['members']) {
				$this->db->rollBack();
				$this->ERROR['data']['message'] = 'No emails provided';
				return $this->ERROR;
			}else if(count($rso['members']) < 5) {
				$this->db->rollBack();
				$this->ERROR['data']['message'] = 'Leader and 5 student emails required';
				return $this->ERROR;
			}
			foreach($rso['members'] as $member) {
				
				$validate_email->execute(array(':email' => $member.$rso['email_domain']));
				$id = $validate_email->fetch(PDO::FETCH_ASSOC);
				if(!$id) { 
					$this->db->rollBack();
					$this->ERROR['data']['message'] = $member . $rso['email_domain'] . " is not a valid email";
					return $this->ERROR;
				}
				$insert_user->execute(array(':rsoid' => $rsoid, ':userid' => $id['id']));
			}
			// Everythins is ok!
			// $this->db->rollBack(); // testing
			$this->db->commit();
			$this->OK['data']['message'] = 'Successfull requested RSO';
			return $this->OK;

		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

}




