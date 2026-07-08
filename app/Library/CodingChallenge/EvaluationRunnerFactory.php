<?php

namespace App\Library\CodingChallenge;

use App\Enums\EvaluationDriver;

final class EvaluationRunnerFactory
{
    public function __construct(
        private readonly CodeRunner $localRunner,
        private readonly DockerCodeRunner $dockerRunner,
    ) {}

    public function forDriver(?EvaluationDriver $driver = null): CodeRunner|DockerCodeRunner
    {
        $driver ??= EvaluationDriver::tryFrom(config('evaluation.driver', 'local')) ?? EvaluationDriver::Local;

        return $driver === EvaluationDriver::Docker ? $this->dockerRunner : $this->localRunner;
    }

    public function shouldQueue(): bool
    {
        if (config('evaluation.async')) {
            return true;
        }

        $driver = EvaluationDriver::tryFrom(config('evaluation.driver', 'local'));

        return $driver === EvaluationDriver::Docker;
    }
}
