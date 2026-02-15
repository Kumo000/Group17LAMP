<?php
        $inData = getRequestInfo();

        $contactId = $inData["contactId"];
        $firstName = $inData["firstName"];
        $lastName = $inData["lastName"];
        $phone = $inData["phone"];
        $email = $inData["email"];
        $userId = $inData["userId"];

        $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {

                $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=? AND UserID=?");
		            $stmt->bind_param("ssssii", $firstName, $lastName, $email, $phone, $contactId, $userId);
		            

          
                if ($stmt->execute())
                {
                      $stmt->close();
                      $conn->close();
					  $retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phone":"' . $phone . '","contactId":' . $contactId . ',"userId":' . $userId . ',"error":""}';
                      sendResultInfoAsJson($retValue);
                }
                else
                {
                  returnWithError("Error Editing Contact");
                }
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
                $retValue = '{"error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }
?>

