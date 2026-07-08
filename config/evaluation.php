<?php

return [
    'driver' => env('EVALUATION_DRIVER', 'local'),
    'async' => env('EVALUATION_ASYNC', false),

    'docker' => [
        'images' => [
            'php' => env('EVALUATION_DOCKER_PHP', 'php:8.3-cli'),
            'javascript' => env('EVALUATION_DOCKER_NODE', 'node:22-alpine'),
            'python' => env('EVALUATION_DOCKER_PYTHON', 'python:3.12-alpine'),
        ],
        'timeout' => (int) env('EVALUATION_DOCKER_TIMEOUT', 30),
    ],
];
