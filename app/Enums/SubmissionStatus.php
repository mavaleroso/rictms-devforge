<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case Pending = 'pending';
    case Running = 'running';
    case Passed = 'passed';
    case Failed = 'failed';
    case NeedsReview = 'needs_review';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function isTerminal(): bool
    {
        return in_array($this, [self::Passed, self::Approved, self::Rejected], true);
    }

    public function countsAsPassed(): bool
    {
        return in_array($this, [self::Passed, self::Approved], true);
    }
}
