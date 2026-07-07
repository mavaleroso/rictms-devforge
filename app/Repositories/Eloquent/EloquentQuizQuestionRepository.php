<?php

namespace App\Repositories\Eloquent;

use App\Enums\QuestionType;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Repositories\Contracts\QuizQuestionRepository;

final class EloquentQuizQuestionRepository implements QuizQuestionRepository
{
    public function createWithOptions(Quiz $quiz, array $data, array $options = []): QuizQuestion
    {
        $question = $quiz->questions()->create($data);

        if ($question->type === QuestionType::MultipleChoice) {
            foreach ($options as $option) {
                $question->options()->create($option);
            }
        }

        return $question;
    }

    public function updateWithOptions(QuizQuestion $question, array $data, ?array $options = null): void
    {
        $question->update($data);

        if ($options !== null && $question->type === QuestionType::MultipleChoice) {
            $question->options()->delete();
            foreach ($options as $option) {
                $question->options()->create($option);
            }
        }
    }

    public function delete(QuizQuestion $question): void
    {
        $question->delete();
    }
}
