<?php

function mongo_driver_is_available(): bool
{
    return class_exists('MongoDB\\Driver\\Manager')
        && class_exists('MongoDB\\Driver\\Query')
        && class_exists('MongoDB\\Driver\\BulkWrite')
        && class_exists('MongoDB\\Driver\\Command');
}

function mongo_driver_configuration_message(array $config): string
{
    if (!mongo_driver_is_available()) {
        return 'MongoDB PHP driver extension is not installed on this server. Enable the mongodb PHP extension to use MONGODB_URI.';
    }

    if (trim((string)($config['mongodb_uri'] ?? '')) === '') {
        return 'MongoDB storage is not configured. Add MONGODB_URI to the .env file.';
    }

    return '';
}

function mongo_driver_is_configured(array $config): bool
{
    return mongo_driver_is_available() && trim((string)($config['mongodb_uri'] ?? '')) !== '';
}

function mongo_manager(array $config): MongoDB\Driver\Manager
{
    static $managers = [];

    if (!mongo_driver_is_configured($config)) {
        throw new RuntimeException(mongo_driver_configuration_message($config));
    }

    $uri = trim((string)$config['mongodb_uri']);

    if (!isset($managers[$uri])) {
        $managers[$uri] = new MongoDB\Driver\Manager($uri);
    }

    return $managers[$uri];
}

function mongo_storage_config(string $role): array
{
    $map = [
        'company' => [
            'databaseName' => 'company_login',
            'collectionName' => 'credentials',
        ],
        'consultancy' => [
            'databaseName' => 'hr_consultancy_login',
            'collectionName' => 'credentials',
        ],
        'candidate' => [
            'databaseName' => 'candidate_login',
            'collectionName' => 'credentials',
        ],
    ];

    return $map[$role] ?? [];
}

function mongo_extract_id($value): string
{
    if ($value instanceof MongoDB\BSON\ObjectId) {
        return (string)$value;
    }

    if (is_scalar($value)) {
        return (string)$value;
    }

    return '';
}

function mongo_normalize_document($document): array
{
    if ($document instanceof stdClass) {
        $document = json_decode(json_encode($document, JSON_UNESCAPED_SLASHES), true);
    }

    return is_array($document) ? $document : [];
}

function mongo_namespace_for_role(string $role): string
{
    $storage = mongo_storage_config($role);

    if ($storage === []) {
        throw new RuntimeException('Unknown role storage requested.');
    }

    return $storage['databaseName'] . '.' . $storage['collectionName'];
}

function ensure_role_indexes(array $config, string $role): void
{
    static $ensured = [];

    $namespace = mongo_namespace_for_role($role);
    if (isset($ensured[$namespace])) {
        return;
    }

    $storage = mongo_storage_config($role);
    $command = new MongoDB\Driver\Command([
        'createIndexes' => $storage['collectionName'],
        'indexes' => [[
            'key' => ['email' => 1],
            'name' => 'uniq_email',
            'unique' => true,
        ]],
    ]);

    mongo_manager($config)->executeCommand($storage['databaseName'], $command);
    $ensured[$namespace] = true;
}

function mongo_find_one_by_email(array $config, string $role, string $email): ?array
{
    ensure_role_indexes($config, $role);

    $query = new MongoDB\Driver\Query(
        ['email' => $email],
        ['limit' => 1]
    );

    $cursor = mongo_manager($config)->executeQuery(mongo_namespace_for_role($role), $query);
    $documents = $cursor->toArray();

    if ($documents === []) {
        return null;
    }

    return mongo_normalize_document($documents[0]);
}

function mongo_insert_credential(array $config, string $role, array $document): array
{
    ensure_role_indexes($config, $role);

    $bulk = new MongoDB\Driver\BulkWrite();
    $insertedId = $bulk->insert($document);
    mongo_manager($config)->executeBulkWrite(mongo_namespace_for_role($role), $bulk);
    $document['_id'] = $insertedId;

    return $document;
}

function mongo_update_credential_by_email(array $config, string $role, string $email, array $set, array $unset = []): void
{
    ensure_role_indexes($config, $role);

    $update = [];
    if ($set !== []) {
        $update['$set'] = $set;
    }
    if ($unset !== []) {
        $update['$unset'] = $unset;
    }

    $bulk = new MongoDB\Driver\BulkWrite();
    $bulk->update(
        ['email' => $email],
        $update,
        ['multi' => false, 'upsert' => false]
    );

    mongo_manager($config)->executeBulkWrite(mongo_namespace_for_role($role), $bulk);
}

function mongo_candidate_count(array $config): int
{
    ensure_role_indexes($config, 'candidate');

    $storage = mongo_storage_config('candidate');
    $command = new MongoDB\Driver\Command([
        'count' => $storage['collectionName'],
        'query' => new stdClass(),
    ]);

    $cursor = mongo_manager($config)->executeCommand($storage['databaseName'], $command);
    $documents = $cursor->toArray();

    if ($documents === []) {
        return 0;
    }

    $first = mongo_normalize_document($documents[0]);
    return (int)($first['n'] ?? 0);
}
