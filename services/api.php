<?php
	require_once("Rest.inc.php");
	
	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "127.0.0.1";
		const DB_USER = "root";
		const DB_PASSWORD = "";
		const DB = "poocar";

		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$user = json_decode(file_get_contents("php://input"),true);
			$email=$user["email"];
			$password=$user["password"];
			if(!empty($email) and !empty($password)){
				if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT * FROM users WHERE email = '$email' AND password = '$password' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$success = array('status' => "success", "msg" => "userlogged in successsfully", "data" => $result);
						$this->response($this->json($success), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
			$this->response($this->json($error), 400);
		}
		
		private function users(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT distinct * FROM users u order by u.userid desc";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function user(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * FROM users u where u.userid=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function insertUser(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$user = json_decode(file_get_contents("php://input"),true);
			$column_names = array('name', 'email', 'mobile', 'password');
			$keys = array_keys($user);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the user received. If blank insert blank into the array.
				 if(!in_array($desired_key, $keys)) {
						$$desired_key = '';
				}else{
					$$desired_key = $user[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO users(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($user)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "user Created Successfully.", "data" => $user);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function ride(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * FROM rides r where r.rideid=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function insertRide(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$ride = json_decode(file_get_contents("php://input"),true);
			$column_names = array('Origin', 'Destination', 'DateofJourney', 'Timeofjourney', 'NumberofSeats','userid');
			$keys = array_keys($ride);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the user received. If blank insert blank into the array.
				 if(!in_array($desired_key, $keys)) {
						$$desired_key = '';
				}else{
					$$desired_key = $ride[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO rides(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($ride)){
				$this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Ride Created Successfully.", "data" => $ride);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
    
    private function updateUserDetails(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$user = json_decode(file_get_contents("php://input"),true);
      $id = (int)$user['userid'];
			$column_names = array('name', 'email', 'mobile');
			$keys = array_keys($user);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the user received. If blank insert blank into the array.
				 if(!in_array($desired_key, $keys)) {
						$$desired_key = '';
				}else{
					$$desired_key = $user[$desired_key];
				}
        $columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "Update users SET ".trim($columns,',')." WHERE userid=$id";
			if(!empty($user)){
				$this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "User Details Updated Successfully.", "data" => $user);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
        		
		private function Rides(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT distinct * FROM rides r order by r.rideid desc";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function updateuser(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$user = json_decode(file_get_contents("php://input"),true);
			$id = (int)$user['id'];
			$column_names = array('userName', 'email', 'city', 'address', 'country');
			$keys = array_keys($user['user']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the user received. If key does not exist, insert blank into the array.
				 if(!in_array($desired_key, $keys)) {
						$$desired_key = '';
				}else{
					$$desired_key = $user['user'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE users SET ".trim($columns,',')." WHERE userid=$id";
			if(!empty($user)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "user ".$id." Updated Successfully.", "data" => $user);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteuser(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM users WHERE userid = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>