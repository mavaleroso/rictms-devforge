<?php

namespace App\Enums;

enum SubmissionSource: string
{
    case Editor = 'editor';
    case GitHub = 'github';
}
