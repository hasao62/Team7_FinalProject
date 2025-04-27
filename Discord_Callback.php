<?php
require 'db.php'; // connect to DB

$client_id = '1358014957224067223';
$client_secret = '7HJsoyIJvJHpj89INzteVqRW1PXXqJEK';
$redirect_uri = 'https://yourwebsite.com/callback.php';

if (!isset($_GET['code'])) {
    die('No code provided');
}

$code = $_GET['code'];

// Exchange the code for an access token
$token_response = file_get_contents('https://discord.com/api/oauth2/token', false, stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/x-www-form-urlencoded",
        'content' => http_build_query([
            'client_id'     => $client_id,
            'client_secret' => $client_secret,
            'grant_type'    => 'authorization_code',
            'code'          => $code,
            'redirect_uri'  => $redirect_uri,
            'scope'         => 'identify email',
        ]),
    ]
]));

$token = json_decode($token_response, true);
$access_token = $token['access_token'] ?? null;

if (!$access_token) {
    die('Failed to retrieve access token');
}

// Get the user's Discord info
$user_response = file_get_contents('https://discord.com/api/users/@me', false, stream_context_create([
    'http' => [
        'header' => "Authorization: Bearer $access_token"
    ]
]));

$user = json_decode($user_response, true);

// Save or update the user
$stmt = $pdo->prepare("INSERT INTO Users (UserID, Username, Pass, Email, Bit)
                       VALUES (?, ?, NULL, ?, TRUE)
                       ON DUPLICATE KEY UPDATE Username = VALUES(Username), Email = VALUES(Email)");
$stmt->execute([$user['id'], $user['username'], $user['email'] ?? null]);

echo "Welcome, " . htmlspecialchars($user['username']);
// ...existing code for user auth...

// Get guild (server) ID - assuming you requested bot permissions
$guild_id = $_GET['guild_id'] ?? null; // Discord does NOT send this directly; you'd get it via bot invite tracking

if ($guild_id) {
    $dbName = "guild_$guild_id";

    // Connect to MySQL without specifying a DB to create one
    try {
        $pdoRoot = new PDO("mysql:host=$host", $user, $pass, $options);
        $pdoRoot->exec("CREATE DATABASE IF NOT EXISTS `$dbName`");

        echo "Database '$dbName' created or already exists.";
    } catch (PDOException $e) {
        die("Failed to create guild database: " . $e->getMessage());
    }
}

