<?php
// dashboard.php
session_start();

if (!isset($_SESSION['user'])) {
    header('Location: index.html');
    exit;
}
//references db.php 
require 'DB.php';
$db = new DB();

$user = $_SESSION['user'];
$transcriptions = $db->getUserTranscriptions($user['id']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Welcome, <?= htmlspecialchars($user['username']) ?>!</h1>
    <p>Email: <?= htmlspecialchars($user['email'] ?? 'N/A') ?></p>

    <h2>Your Transcriptions</h2>
    <?php if (empty($transcriptions)): ?>
      <p>No transcriptions found.</p>
    <?php else: ?>
      <ul>
        <?php foreach ($transcriptions as $t): ?>
          <li>
            <strong><?= $t['created_at'] ?>:</strong>
            <pre><?= htmlspecialchars($t['content']) ?></pre>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>

    <p><a href="logout.php">Logout</a></p>
  </div>
</body>
</html>
