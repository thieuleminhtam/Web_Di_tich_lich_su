<?php
require_once 'connect_database.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? null;
if (!$id) {
    echo json_encode(["success" => false, "message" => "ID không hợp lệ"]);
    exit;
}

$result = pg_query_params($dbcon, "DELETE FROM users WHERE id = $1", [$id]);
if ($result) {
    echo json_encode(["success" => true, "message" => "Xóa tài khoản thành công"]);
} else {
    echo json_encode(["success" => false, "message" => pg_last_error($dbcon)]);
}
?>
