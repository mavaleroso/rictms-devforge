<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Code Runner Binaries
    |--------------------------------------------------------------------------
    |
    | Override language binaries when auto-detection fails (common on Laragon
    | where PHP_BINARY points to httpd.exe under Apache).
    |
    */

    'binaries' => [
        'php' => env('CODING_CHALLENGE_PHP_BINARY'),
        'javascript' => env('CODING_CHALLENGE_NODE_BINARY', 'node'),
        'python' => env('CODING_CHALLENGE_PYTHON_BINARY', 'python'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Default project template
    |--------------------------------------------------------------------------
    */

    'default_project_template' => env(
        'CODING_CHALLENGE_DEFAULT_TEMPLATE',
        'laravel-inertia-react-template',
    ),

    /*
    |--------------------------------------------------------------------------
    | Per-template preview base URLs (override manifest preview_url)
    |--------------------------------------------------------------------------
    |
    | Serve the installed starter kit with:
    |   php artisan challenge:serve-template
    |
    */

    'template_preview_urls' => [
        'laravel-inertia-react-template' => env(
            'CODING_CHALLENGE_LIR_PREVIEW_URL',
            'http://127.0.0.1:8001',
        ),
    ],

];
