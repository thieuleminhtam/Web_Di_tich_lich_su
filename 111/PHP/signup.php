<?php
require_once 'connect_database.php';
header('Content-Type: application/json');

$username = $_POST['newUsername'] ?? '';
$password = $_POST['newPassword'] ?? '';
$confirm  = $_POST['confirmPassword'] ?? '';

if (empty($username) || empty($password) || empty($confirm)) {
    echo json_encode(["success" => false, "message" => "Vui lòng nhập đầy đủ thông tin!"]);
    exit;
}

if ($password !== $confirm) {
    echo json_encode(["success" => false, "message" => "Mật khẩu xác nhận không khớp!"]);
    exit;
}

// Kiểm tra username đã tồn tại
$sqlCheck = "SELECT 1 FROM users WHERE username = $1";
$check = pg_query_params($dbcon, $sqlCheck, [$username]);

if (pg_num_rows($check) > 0) {
    echo json_encode(["success" => false, "message" => "Tên đăng nhập đã tồn tại!"]);
    exit;
}

// Lưu password trực tiếp (plaintext, không hash)
$sqlInsert = "INSERT INTO users (username, password, created_at) VALUES ($1, $2, NOW())";
$result = pg_query_params($dbcon, $sqlInsert, [$username, $password]);

if ($result) {
    echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi CSDL: " . pg_last_error($dbcon)]);
}

pg_close($dbcon);
?>
