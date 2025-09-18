<?php
require_once 'connect_database.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? null;
$newPass = $_POST['newPassword'] ?? '';

if (!$id || empty($newPass)) {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
    exit;
}

// Cập nhật và kiểm tra số dòng bị ảnh hưởng
$result = pg_query_params($dbcon, "UPDATE users SET password=$1 WHERE id=$2", [$newPass, $id]);

$affectedRows = pg_affected_rows($result); // số dòng bị ảnh hưởng

if ($result && $affectedRows > 0) {
    echo json_encode(["success" => true, "message" => "Đổi mật khẩu thành công"]);
} else if ($result && $affectedRows === 0) {
    echo json_encode(["success" => false, "message" => "ID người dùng không tồn tại"]);
} else {
    echo json_encode(["success" => false, "message" => pg_last_error($dbcon)]);
}
?>
