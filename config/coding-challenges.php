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

];
