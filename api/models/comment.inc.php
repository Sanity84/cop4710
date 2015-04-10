<?php
class Comment extends Model {

	// Create
	public function createComment($comment, $eventid, $session_key) {
		try {

			$stmt = $this->db->prepare("SELECT S.userid FROM sessions S WHERE S.session=:session AND S.expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->NOAUTH['data']['message'] = 'Not authorized';
				return $this->ERROR;
			}
			// Check if the user has already entered a comment for this event!
			$stmt = $this->db->prepare("SELECT * FROM comments WHERE userid=:userid AND eventid=:eventid LIMIT 1");
			$stmt->execute(array(':userid' => $user['userid'], ':eventid' => (!$eventid) ? null : $eventid));

			// Didn't you already comment on this event? only one comment per person!
			if($stmt->rowCount() > 0) {
				$this->ERROR['data']['message'] = 'You have already commented and rated this event';
				return $this->ERROR;
			}
			
			$stmt = $this->db->prepare("INSERT INTO comments (body, userid, eventid, rating) 
				VALUES (:body, :userid, :eventid, :rating)");
			$stmt->execute(array(
				':body' => (!$comment['body']) ? null : $comment['body'],
				':userid' => $user['userid'],
				':eventid' => (!$eventid) ? null : $eventid,
				':rating' => (!$comment['rating']) ? null : $comment['rating']
			));

			$stmt = $this->db->prepare("UPDATE events 
				SET times_rated=times_rated+1, total_ratings=total_ratings+:rating, rating=((total_ratings+:rating) / (times_rated+1)) 
				WHERE id=:eventid");
			$stmt->execute(array(
				':rating' => (!$comment['rating']) ? null : $comment['rating'],
				':eventid' => (!$eventid) ? null : $eventid
			));

			$stmt = $this->db->prepare("SELECT C.*, CONCAT(U.firstname, ' ', U.lastname) name FROM comments C
			INNER JOIN users U ON U.id=C.userid
			WHERE C.userid=:userid AND C.eventid=:eventid LIMIT 1");
			$stmt->execute(array(':userid' => $user['userid'], ':eventid' => (!$eventid) ? null : $eventid));
			$new_comment = $stmt->fetch(PDO::FETCH_ASSOC);

			$this->OK['data'] = $new_comment;
			return $this->OK;
		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	// Update
	public function updateComment($comment, $eventid, $session_key) {
		try {
			$stmt = $this->db->prepare("SELECT S.userid FROM sessions S WHERE S.session=:session AND S.expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->NOAUTH['data']['message'] = 'Not authorized';
				return $this->ERROR;
			}
			$stmt = $this->db->prepare("UPDATE comments SET body=:body, rating=:rating
				WHERE eventid:eventid AND userid=:userid");
			$stmt->execute(array(
				':body' => (!$comment['body']) ? null : $comment['body'],
				':rating' => (!$comment['rating']) ? null : $comment['rating'],
				':eventid' => (!$eventid) ? null : $eventid,
				':userid' => $user['userid']
			));

			$stmt = $this->db->prepare("SELECT * FROM comments WHERE userid=:userid AND eventid=:eventid LIMIT 1");
			$stmt->execute(array(':userid' => $user['userid'], ':eventid' => (!$eventid) ? null : $eventid));
			$update_comment = $stmt->fetch(PDO::FETCH_ASSOC);

			$this->OK['data'] = $update_comment;
			return $this->OK;
		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	// Delete
	public function deleteComment($eventid, $session_key) {
		try {
			$stmt = $this->db->prepare("SELECT S.userid FROM sessions S WHERE S.session=:session AND S.expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->NOAUTH['data']['message'] = 'Not authorized';
				return $this->ERROR;
			}

			$stmt = $this->db->prepare("DELETE FROM sessions WHERE eventid=:eventid AND userid=:userid");
			$stmt->execute(array(
				':eventid' => (!$eventid) ? null : $eventid,
				':userid' => $user['userid']
			));
			if(!$stmt->countRows() < 1) {
				$this->ERROR['data']['message'] = 'Could not delete comment';
				return $this->ERROR;
			}
			$this->OK['data']['message'] = 'Deleted comment';
			return $this->OK;

		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}
}