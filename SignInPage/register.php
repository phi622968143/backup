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

// 從註冊表單中獲取用戶名、電子郵件和密碼
$username = $_POST["username"];
$email = $_POST["email"];
$password = $_POST["password"];

// 在實際應用中，您需要對用戶名和電子郵件進行唯一性檢查

// 哈希密碼以安全方式儲存
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// 插入用戶資訊到數據庫中
$sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashedPassword')";

if ($conn->query($sql) === TRUE) {
    echo "註冊成功";
} else {
    echo "註冊失敗: " . $conn->error;
}

$conn->close();
?>
