<?php

namespace App\Repositories\Contracts;

use App\Models\Quiz;
use App\Models\QuizQuestion;

interface QuizQuestionRepository
{
    /** @param  array<string, mixed>  $options */
    public function createWithOptions(Quiz $quiz, array $data, array $options = []): QuizQuestion;

    /** @param  array<string, mixed>|null  $options */
    public function updateWithOptions(QuizQuestion $question, array $data, ?array $options = null): void;

    public function delete(QuizQuestion $question): void;
}
