<?php

return [
    'driver' => env('AI_DRIVER', 'mock'),
    'api_key' => env('AI_API_KEY'),
    'model' => env('AI_MODEL', 'gpt-4o-mini'),
    'base_url' => env('AI_BASE_URL', 'https://api.openai.com/v1'),
    'ca_bundle' => env('AI_CA_BUNDLE'),
    'max_messages_per_session' => (int) env('AI_MAX_MESSAGES', 30),
];
