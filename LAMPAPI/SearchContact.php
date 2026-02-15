<?php

        $inData = getRequestInfo();

        $searchResults = "";
        $searchCount = 0;

        $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
        if ($conn->connect_error)
        {
                returnWithError( $conn->connect_error );
        }
        else
        {
                $stmt = $conn->prepare("SELECT * FROM Contacts WHERE FirstName LIKE ? AND LastName LIKE ? AND UserID=?");

                $firstName = "%" . $inData["firstname"] . "%";
                $lastName = "%" . $inData["lastname"] . "%";
                $userId = $inData["userId"];

                $stmt->bind_param("sss", $firstName, $lastName, $userId);
                $stmt->execute();

                $result = $stmt->get_result();

                $results = [];
                $searchCount = 0;

                while($row = $result->fetch_assoc())
                {
                        // $arr_val_i = '{"contactId":' . $row["ID"] . ',"firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","email":"' . $row["Email"] . '","phone":"' . $row["Phone"] . '"}';
                        // $results[] = $arr_val_i;

                        $results[] = [
                                "contactId" => $row["ID"],
                                "firstName" => $row["FirstName"],
                                "lastName"  => $row["LastName"],
                                "email"     => $row["Email"],
                                "phone"     => $row["Phone"]
                        ];

                        $searchCount++;
                }

                if( $searchCount == 0 )
                {
                        returnWithError( "No Records Found" );
                }
                else
                {
                        returnWithInfo( $results );
                }

                $stmt->close();
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
                $retValue = '{"results":[],"error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $results )
        {
                $retValue = json_encode(["results" => $results, "error"   => ""]);
                sendResultInfoAsJson( $retValue );
        }

?>
