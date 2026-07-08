<?php

namespace App\Enums;

enum BadgeCategory: string
{
    case Milestone = 'milestone';
    case Performance = 'performance';
    case Streak = 'streak';
    case Progress = 'progress';
}
