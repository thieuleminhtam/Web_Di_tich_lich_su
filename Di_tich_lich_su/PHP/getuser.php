<?php
header('Content-Type: application/json');
require_once 'connect_database.php';

$query = "SELECT id, username, password AS password, created_at FROM users ORDER BY id ASC";
$result = pg_query($dbcon, $query);

$users = [];
while ($row = pg_fetch_assoc($result)) {
    $users[] = $row;
}

echo json_encode($users);
pg_close($dbcon);
?>
