<?php

namespace App\Enums;

enum CapstoneMilestoneStatus: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Submitted = 'submitted';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function isTerminal(): bool
    {
        return in_array($this, [self::Approved, self::Rejected], true);
    }
}
