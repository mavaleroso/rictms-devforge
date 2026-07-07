<?php

namespace App\Enums;

enum ProgressStatus: string
{
    case Locked = 'locked';
    case Available = 'available';
    case InProgress = 'in_progress';
    case Completed = 'completed';
}
