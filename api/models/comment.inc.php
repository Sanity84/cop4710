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
			$stmt = $this->db->prepare("INSERT INTO comments (body, userid, eventid, rating)
				VALUES (:body, :userid, :eventid, :rating)");
			$stmt->execute(array(
				':body' => (!$comment['body']) ? null : $comment['body'],
				':userid' => $user['userid'],
				':eventid' => (!$eventid) ? null : $eventid,
				':rating' => (!$comment['rating']) ? null : $comment['rating']
			));

			$new_comment = $stmt->fetch(PDO::FETCH_ASSOC);

			if(!$new_comment) {
				$this->ERROR['data']['message'] = 'Error creating comment';
				return $this->ERROR;
			}

			$this->OK['data'] = $new_comment;
			return $this->OK;
		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	// Update
	public function updateComment($comment, $eventid, $commentid, $session_key) {
		try {
			$stmt = $this->db->prepare("SELECT S.userid FROM sessions S WHERE S.session=:session AND S.expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->NOAUTH['data']['message'] = 'Not authorized';
				return $this->ERROR;
			}
			$stmt = $this->db->prepare("UPDATE comments SET body=:body, rating=:rating
				WHERE id=:commentid AND userid=:userid");
			$stmt->execute(array(
				':body' => (!$comment['body']) ? null : $comment['body'],
				':rating' => (!$comment['rating']) ? null : $comment['rating'],
				':commentid' => (!$commentid) ? null : $commentid,
				':userid' => $user['userid']
			));

			$update_comment = $stmt->fetch(PDO::FETCH_ASSOC);

			if(!$update_comment) {
				$this->ERROR['data']['message'] = 'Error creating comment';
				return $this->ERROR;
			}

			$this->OK['data'] = $update_comment;
			return $this->OK;
		}catch(PDOException $e) {
			$this->ERROR['data']['message'] = $e->getMessage();
			return $this->ERROR;
		}
	}

	// Delete
	public function deleteComment($commentid, $session_key) {
		try {
			$stmt = $this->db->prepare("SELECT S.userid FROM sessions S WHERE S.session=:session AND S.expire>NOW() LIMIT 1");
			$stmt->execute(array(':session' => $session_key));
			$user = $stmt->fetch(PDO::FETCH_ASSOC);
			if(!$user) {
				$this->NOAUTH['data']['message'] = 'Not authorized';
				return $this->ERROR;
			}

			$stmt = $this->db->prepare("DELETE FROM sessions WHERE id=:commentid AND userid=:userid");
			$stmt->execute(array(
				':commentid' => (!$commentid) ? null : $commentid,
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