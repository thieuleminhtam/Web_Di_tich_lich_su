<?php
session_start();
header('Content-Type: application/json');

// Nếu nhận action=logout thì xóa session
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_unset();
    session_destroy();
    echo json_encode(["loggedIn" => false, "message" => "Đã đăng xuất"]);
    exit;
}

// Mặc định: check trạng thái session
if (isset($_SESSION['username'])) {
    echo json_encode([
        "loggedIn" => true,
        "username" => $_SESSION['username']
    ]);
} else {
    echo json_encode([
        "loggedIn" => false
    ]);
}
?>
