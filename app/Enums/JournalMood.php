<?php

namespace App\Enums;

enum JournalMood: string
{
    case Great = 'great';
    case Good = 'good';
    case Ok = 'ok';
    case Struggling = 'struggling';
}
