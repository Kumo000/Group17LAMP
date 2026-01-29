<?php
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
    $login = "";
    $password = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // select users with matching login
		$stmt1 = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=?");
		$stmt1->bind_param("s", $inData["login"]);
		$stmt1->execute();
		$result = $stmt1->get_result();

        // if user already exists, reject them
		if( $row = $result->fetch_assoc()  )
		{
            returnWithError("Username Taken");
        }
        // if user doesn't already exist, add them
		else
		{
            // add user to DB
            $stmt2 = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
            $stmt2->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
            $stmt2->execute();

            // check for inserting error here?

            $id = $conn->insert_id;
            returnWithInfo( $inData["firstname"], $inData["lastname"], $id );

        }

		$stmt1->close();
        $stmt2->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
