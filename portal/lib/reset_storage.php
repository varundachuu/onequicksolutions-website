<?php

function reset_requests_file_name(): string
{
    return 'password_reset_requests';
}

function reset_request_key(string $role, string $email): string
{
    return strtolower(trim($role)) . '::' . strtolower(trim($email));
}

function load_reset_requests(): array
{
    return load_json(reset_requests_file_name());
}

function save_reset_requests(array $requests): void
{
    save_json(reset_requests_file_name(), $requests);
}

function get_reset_request(string $role, string $email): ?array
{
    $requests = load_reset_requests();
    $key = reset_request_key($role, $email);

    if (!isset($requests[$key]) || !is_array($requests[$key])) {
        return null;
    }

    return $requests[$key];
}

function put_reset_request(string $role, string $email, array $data): void
{
    $requests = load_reset_requests();
    $requests[reset_request_key($role, $email)] = $data;
    save_reset_requests($requests);
}

function delete_reset_request(string $role, string $email): void
{
    $requests = load_reset_requests();
    $key = reset_request_key($role, $email);

    if (!array_key_exists($key, $requests)) {
        return;
    }

    unset($requests[$key]);
    save_reset_requests($requests);
}
