<?php

namespace App\Actions\Learning;

use App\Models\Enrollment;
use App\Models\Level;
use App\Services\Learning\ProgressEngine;

final class EvaluateLevelProgress
{
    public function __construct(
        private readonly ProgressEngine $progressEngine,
    ) {}

    public function execute(Enrollment $enrollment, Level $level): bool
    {
        return $this->progressEngine->evaluate($enrollment, $level);
    }
}
