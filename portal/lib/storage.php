<?php

function primary_data_directory(): string
{
    return __DIR__ . '/../data';
}

function runtime_data_directory(): string
{
    return __DIR__ . '/../runtime_data';
}

function should_use_runtime_data_directory(): bool
{
    static $useRuntime = null;

    if ($useRuntime !== null) {
        return $useRuntime;
    }

    $primary = primary_data_directory();
    $useRuntime = !is_dir($primary) || !is_writable($primary);

    return $useRuntime;
}

function ensure_runtime_data_directory(): string
{
    $path = runtime_data_directory();

    if (!is_dir($path) && !@mkdir($path, 0777, true) && !is_dir($path)) {
        throw new RuntimeException('Unable to create runtime_data directory.');
    }

    return $path;
}

function active_data_directory(): string
{
    if (should_use_runtime_data_directory()) {
        return ensure_runtime_data_directory();
    }

    return primary_data_directory();
}

function data_path(string $name): string
{
    $directory = active_data_directory();
    $path = $directory . '/' . $name . '.json';

    if ($directory !== primary_data_directory() && !file_exists($path)) {
        $primaryPath = primary_data_directory() . '/' . $name . '.json';

        if (file_exists($primaryPath)) {
            @copy($primaryPath, $path);
        }
    }

    return $path;
}

function load_json(string $name): array
{
    $path = data_path($name);
    if (!file_exists($path)) {
        return [];
    }

    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function save_json(string $name, array $data): void
{
    $path = data_path($name);
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

    if ($json === false) {
        throw new RuntimeException('Unable to encode JSON for ' . $name . '.');
    }

    $bytes = @file_put_contents($path, $json, LOCK_EX);
    if ($bytes === false) {
        throw new RuntimeException('Unable to write ' . basename($path) . '. Check file permissions.');
    }
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    $decoded = json_decode($raw ?: '[]', true);
    return is_array($decoded) ? $decoded : [];
}

function request_data(): array
{
    if (!empty($_POST)) {
        return $_POST;
    }

    return request_json();
}

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function text_response(string $body, int $status = 200, string $contentType = 'text/plain; charset=utf-8'): void
{
    http_response_code($status);
    header('Content-Type: ' . $contentType);
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo $body;
    exit;
}
