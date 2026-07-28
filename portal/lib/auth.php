<?php

function role_labels(): array
{
    return [
        'company' => 'Company',
        'consultancy' => 'HR Consultancy',
        'candidate' => 'Candidate',
    ];
}

function normalize_email(string $email): string
{
    return strtolower(trim($email));
}

function is_valid_email(string $email): bool
{
    return (bool)filter_var($email, FILTER_VALIDATE_EMAIL);
}

function get_role_label(string $role): string
{
    $labels = role_labels();
    return $labels[$role] ?? $role;
}

function is_valid_role(string $role): bool
{
    return mongo_storage_config($role) !== [];
}

function role_storage_name(string $role): string
{
    $storage = mongo_storage_config($role);
    if ($storage === []) {
        return '';
    }

    return $storage['databaseName'] . '.' . $storage['collectionName'];
}

function sanitize_credential(array $credential): array
{
    $isCandidate = (string)($credential['role'] ?? '') === 'candidate';
    $candidateConsentValue = ($credential['consent'] ?? null) === true
        || ($isCandidate && !empty($credential['consentAcceptedAt']));

    return [
        'id' => mongo_extract_id($credential['_id'] ?? $credential['id'] ?? ''),
        'role' => (string)($credential['role'] ?? ''),
        'name' => (string)($credential['name'] ?? ''),
        'email' => (string)($credential['email'] ?? ''),
        'createdAt' => $credential['createdAt'] ?? null,
        'lastLoginAt' => $credential['lastLoginAt'] ?? null,
        'consent' => $isCandidate ? $candidateConsentValue : null,
        'consentAcceptedAt' => $isCandidate ? ($credential['consentAcceptedAt'] ?? null) : null,
        'consentVersion' => $isCandidate ? ($credential['consentVersion'] ?? null) : null,
        'consentSource' => $isCandidate ? ($credential['consentSource'] ?? null) : null,
        'updatedAt' => $credential['updatedAt'] ?? null,
    ];
}

function candidate_consent_version(): string
{
    return 'candidate-data-storage-v1';
}

function candidate_consent_source(): string
{
    return 'candidate-portal';
}

function now_iso(): string
{
    return gmdate('c');
}

function validate_credential_payload(
    array $payload,
    bool $requirePasswordConfirmation = false,
    bool $requireCandidateName = false
): array {
    $role = strtolower(trim((string)($payload['role'] ?? '')));
    $name = trim((string)($payload['name'] ?? ''));
    $email = normalize_email((string)($payload['email'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    $confirmPassword = (string)($payload['confirmPassword'] ?? '');

    if (mongo_storage_config($role) === []) {
        return ['error' => 'Choose a valid login type.'];
    }

    if (!is_valid_email($email)) {
        return ['error' => 'Enter a valid email address.'];
    }

    if ($requireCandidateName && $role === 'candidate' && $name === '') {
        return ['error' => 'Enter your full name.'];
    }

    if (strlen($password) < 8) {
        return ['error' => 'Password must be at least 8 characters long.'];
    }

    if ($requirePasswordConfirmation && $password !== $confirmPassword) {
        return ['error' => 'Password confirmation does not match.'];
    }

    return [
        'role' => $role,
        'name' => $name,
        'email' => $email,
        'password' => $password,
    ];
}

function validate_forgot_password_payload(array $payload): array
{
    $role = strtolower(trim((string)($payload['role'] ?? '')));
    $email = normalize_email((string)($payload['email'] ?? ''));

    if (mongo_storage_config($role) === []) {
        return ['error' => 'Choose a valid login type.'];
    }

    if (!is_valid_email($email)) {
        return ['error' => 'Enter a valid email address.'];
    }

    return [
        'role' => $role,
        'email' => $email,
    ];
}

function validate_reset_password_payload(array $payload): array
{
    $otp = trim((string)($payload['otp'] ?? ''));
    $validation = validate_credential_payload($payload, true, false);

    if (isset($validation['error'])) {
        return $validation;
    }

    if (!preg_match('/^\d{6}$/', $otp)) {
        return ['error' => 'Enter the 6-digit OTP sent to your email.'];
    }

    return [
        'role' => $validation['role'],
        'email' => $validation['email'],
        'password' => $validation['password'],
        'otp' => $otp,
    ];
}

function validate_candidate_consent_payload(array $payload): array
{
    $role = strtolower(trim((string)($payload['role'] ?? 'candidate')));
    $email = normalize_email((string)($payload['email'] ?? ''));

    if ($role !== 'candidate') {
        return ['error' => 'Candidate consent is available only for candidate logins.'];
    }

    if (!is_valid_email($email)) {
        return ['error' => 'Enter a valid candidate email address.'];
    }

    return [
        'role' => $role,
        'email' => $email,
    ];
}

function forgot_password_success_message(): string
{
    return 'If an account exists for the selected login type and email, a 6-digit OTP has been sent.';
}

function candidate_count(array $config): int
{
    return mongo_candidate_count($config);
}
