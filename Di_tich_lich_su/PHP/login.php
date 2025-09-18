<?php
session_start();
require_once 'connect_database.php';

$username = $_POST['username'] ?? '';
$password = (string) ($_POST['password'] ?? '');

// Truy vấn theo username trước
$sql = "SELECT * FROM users WHERE username = $1";
$result = pg_query_params($dbcon, $sql, [$username]);

if (!$result) {
    echo json_encode(["success" => false, "message" => "Lỗi truy vấn CSDL"]);
    exit;
}

// Không tìm thấy username
if (pg_num_rows($result) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Tên đăng nhập không tồn tại!"
    ]);
    exit;
}

// Lấy dữ liệu user
$user = pg_fetch_assoc($result);

// So sánh mật khẩu (ở đây bạn đang lưu plain-text, nếu dùng hash thì phải `password_verify`)
if ($user['password'] !== $password) {
    echo json_encode([
        "success" => false,
        "message" => "Mật khẩu không đúng!"
    ]);
    exit;
}

// Nếu đúng username + password
$_SESSION['username'] = $username;
echo json_encode([
    "success" => true,
    "message" => "Đăng nhập thành công!",
    "username" => $username
]);
