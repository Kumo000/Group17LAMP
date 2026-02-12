<?php
        $inData = getRequestInfo();

        $userId = $inData["userId"];
        $messageId = $inData["messageId"];

        $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {

                $stmt1 = $conn->prepare("SELECT ID FROM Contacts WHERE ID=? AND UserID=?");
		            $stmt1->bind_param("ii", $messageId, $userId);
		            $stmt1->execute();
		            $result = $stmt1->get_result();

          
                if( $row = $result->fetch_assoc()  )
                {
                      
                      $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=? AND UserID=?");
                      $stmt->bind_param("ii", $messageId, $userId);
                      $stmt->execute();
                      $stmt->close();
                      $stmt1->close();
                      $conn->close();
                      returnWithError("");
                }
                else
                {
                      $stmt1->close();  
                      $conn->close();
                      returnWithError("Contact Does Not Exist");
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
