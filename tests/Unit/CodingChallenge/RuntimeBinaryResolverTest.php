<?php

use App\Library\CodingChallenge\RuntimeBinaryResolver;

test('php binary resolver avoids apache httpd on laragon', function () {
    $binary = RuntimeBinaryResolver::resolvePhp();

    expect(strtolower(basename($binary)))->toContain('php')
        ->and(strtolower(basename($binary)))->not->toContain('httpd');
});

test('php binary resolver can execute php code', function () {
    $binary = RuntimeBinaryResolver::resolvePhp();

    $process = new Symfony\Component\Process\Process([$binary, '-r', 'echo json_encode(2 + 3);']);
    $process->run();

    expect($process->isSuccessful())->toBeTrue()
        ->and(trim($process->getOutput()))->toBe('5');
});
