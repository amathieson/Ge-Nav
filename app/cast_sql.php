<?php
/**
 * Created by PhpStorm.
 * User: Adam
 * Date: 20/07/2017
 * Time: 20:19
 */
function getLinePicto($lineCode) {
    $servername = "localhost";
    $username = "TPG";
    $password = "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";
    $dbname = "TPG";

// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * FROM `lines` WHERE `line` = '$lineCode'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            return $row['url'];
        }
    } else {
        //echo "0 results";
    }
    $conn->close();
}
function getLineData($lineCode) {
    $servername = "localhost";
    $username = "TPG";
    $password = "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";
    $dbname = "TPG";

// Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT * FROM `lines` WHERE `line` = '$lineCode'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            return $row;
        }
    } else {
        //echo "0 results";
    }
    $conn->close();
}