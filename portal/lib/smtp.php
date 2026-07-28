<?php

function smtp_is_configured(array $config): bool
{
    return trim((string)($config['mail_user'] ?? '')) !== ''
        && trim((string)($config['mail_pass'] ?? '')) !== ''
        && trim((string)($config['mail_from'] ?? '')) !== '';
}

function smtp_configuration_message(array $config): string
{
    $sender = trim((string)($config['mail_user'] ?? $config['default_mail_sender'] ?? ''));
    return 'Email sender is not configured. Add SMTP_PASS for ' . $sender . ' in the .env file.';
}

function smtp_send_mail(array $config, string $to, string $subject, string $textBody, string $htmlBody): void
{
    if (!smtp_is_configured($config)) {
        throw new RuntimeException(smtp_configuration_message($config));
    }

    $host = trim((string)$config['mail_host']);
    $port = (int)$config['mail_port'];
    $encryption = strtolower(trim((string)($config['mail_encryption'] ?? '')));
    $user = trim((string)$config['mail_user']);
    $pass = (string)$config['mail_pass'];
    $from = trim((string)$config['mail_from']);
    $fromName = trim((string)($config['mail_from_name'] ?? ''));

    $transport = $encryption === 'ssl' ? 'ssl' : 'tcp';
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
        ],
    ]);

    $socket = @stream_socket_client(
        $transport . '://' . $host . ':' . $port,
        $errorNumber,
        $errorString,
        20,
        STREAM_CLIENT_CONNECT,
        $context
    );

    if (!$socket) {
        throw new RuntimeException('Unable to connect to SMTP server: ' . $errorString);
    }

    try {
        stream_set_timeout($socket, 20);

        smtp_expect($socket, [220], 'connect');
        smtp_command($socket, 'EHLO ' . smtp_client_name(), [250], 'EHLO');

        if ($encryption === 'tls') {
            smtp_command($socket, 'STARTTLS', [220], 'STARTTLS');

            $cryptoEnabled = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            if ($cryptoEnabled !== true) {
                throw new RuntimeException('Unable to enable TLS encryption for SMTP.');
            }

            smtp_command($socket, 'EHLO ' . smtp_client_name(), [250], 'EHLO after STARTTLS');
        }

        smtp_command($socket, 'AUTH LOGIN', [334], 'AUTH LOGIN');
        smtp_command($socket, base64_encode($user), [334], 'SMTP username');
        smtp_command($socket, base64_encode($pass), [235], 'SMTP password');
        smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250], 'MAIL FROM');
        smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251], 'RCPT TO');
        smtp_command($socket, 'DATA', [354], 'DATA');

        $message = smtp_build_message($from, $fromName, $to, $subject, $textBody, $htmlBody);
        fwrite($socket, smtp_dot_stuff($message) . "\r\n.\r\n");
        smtp_expect($socket, [250], 'message body');

        smtp_command($socket, 'QUIT', [221], 'QUIT');
    } finally {
        fclose($socket);
    }
}

function smtp_build_message(
    string $from,
    string $fromName,
    string $to,
    string $subject,
    string $textBody,
    string $htmlBody
): string {
    $boundary = 'bnd_' . bin2hex(random_bytes(12));
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $fromHeader = $fromName !== ''
        ? '=?UTF-8?B?' . base64_encode($fromName) . '?= <' . $from . '>'
        : $from;

    $headers = [
        'Date: ' . gmdate('D, d M Y H:i:s O'),
        'From: ' . $fromHeader,
        'To: <' . $to . '>',
        'Subject: ' . $encodedSubject,
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    return implode("\r\n", $headers) . "\r\n\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . trim($textBody) . "\r\n\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . trim($htmlBody) . "\r\n\r\n"
        . '--' . $boundary . "--\r\n";
}

function smtp_dot_stuff(string $message): string
{
    return preg_replace('/^\./m', '..', $message) ?? $message;
}

function smtp_client_name(): string
{
    $hostname = gethostname();
    return $hostname && $hostname !== '' ? $hostname : 'localhost';
}

function smtp_command($socket, string $command, array $expectedCodes, string $context): string
{
    fwrite($socket, $command . "\r\n");
    return smtp_expect($socket, $expectedCodes, $context);
}

function smtp_expect($socket, array $expectedCodes, string $context): string
{
    $response = '';

    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;

        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }

    if ($response === '') {
        throw new RuntimeException('Empty SMTP response while handling ' . $context . '.');
    }

    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP error during ' . $context . ': ' . trim($response));
    }

    return $response;
}
