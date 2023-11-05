<?php
// 建立與數據庫的連接
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "your_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}

// 從登錄表單中獲取用戶名和密碼
$username = $_POST["username"];
$password = $_POST["password"];

// 根據用戶名從數據庫中獲取用戶記錄
$sql = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row["password"])) {
        // 登錄成功，可以執行相應的操作
        echo "登錄成功";
    } else {
        echo "密碼不正確";
    }
} else {
    echo "用戶名不存在";
}

$conn->close();
?>
