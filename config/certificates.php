<?php

return [
    'number_prefix' => env('CERTIFICATE_PREFIX', 'DF'),
    'issuer_name' => env('CERTIFICATE_ISSUER', 'DevForge Academy'),
    'storage_disk' => env('CERTIFICATE_DISK', 'local'),
    'storage_path' => 'certificates',
];
