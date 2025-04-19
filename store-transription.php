<?php
// store-transcription.php

require 'DB.php';

// Accept only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST allowed']);
    exit;
}

// Get JSON body
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['user_id'], $input['content'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user_id or content']);
    exit;
}

$userId = (int) $input['user_id'];
$content = trim($input['content']);

try {
    $db = new DB();
    $stmt = $db->pdo->prepare("INSERT INTO transcriptions (user_id, content) VALUES (:user_id, :content)");
    $stmt->execute([
        ':user_id' => $userId,
        ':content' => $content
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
}
