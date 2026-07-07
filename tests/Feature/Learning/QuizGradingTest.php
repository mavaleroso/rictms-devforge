<?php

use App\Actions\Quiz\GradeQuizAttempt;
use App\Enums\QuestionType;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;

test('multiple choice questions are auto-graded', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create(['name' => 'Quiz Path', 'slug' => 'quiz-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $quiz = Quiz::create([
        'level_id' => $level->id,
        'title' => 'MC Quiz',
        'passing_score' => 50,
        'max_attempts' => 3,
    ]);

    $question = QuizQuestion::create([
        'quiz_id' => $quiz->id,
        'type' => QuestionType::MultipleChoice,
        'question' => 'Pick one',
        'points' => 2,
    ]);

    $correct = QuizOption::create(['quiz_question_id' => $question->id, 'label' => 'Correct', 'is_correct' => true]);
    QuizOption::create(['quiz_question_id' => $question->id, 'label' => 'Wrong', 'is_correct' => false]);

    $attempt = app(GradeQuizAttempt::class)->execute($intern, $quiz, [
        $question->id => (string) $correct->id,
    ]);

    expect($attempt->score)->toBe(100)
        ->and($attempt->passed)->toBeTrue();
});

test('identification answers are case insensitive', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create(['name' => 'ID Path', 'slug' => 'id-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $quiz = Quiz::create([
        'level_id' => $level->id,
        'title' => 'ID Quiz',
        'passing_score' => 50,
        'max_attempts' => 3,
    ]);

    $question = QuizQuestion::create([
        'quiz_id' => $quiz->id,
        'type' => QuestionType::Identification,
        'question' => 'Name the framework',
        'points' => 1,
        'correct_answer' => 'Laravel',
    ]);

    $attempt = app(GradeQuizAttempt::class)->execute($intern, $quiz, [
        $question->id => 'laravel',
    ]);

    expect($attempt->passed)->toBeTrue();
});

test('essay questions are not auto-graded as correct', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create(['name' => 'Essay Path', 'slug' => 'essay-path', 'is_active' => true]);
    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'L1',
        'estimated_minutes' => 30,
        'difficulty' => 'beginner',
    ]);

    $quiz = Quiz::create([
        'level_id' => $level->id,
        'title' => 'Essay Quiz',
        'passing_score' => 80,
        'max_attempts' => 3,
    ]);

    $question = QuizQuestion::create([
        'quiz_id' => $quiz->id,
        'type' => QuestionType::Essay,
        'question' => 'Explain MVC',
        'points' => 5,
    ]);

    $attempt = app(GradeQuizAttempt::class)->execute($intern, $quiz, [
        $question->id => 'A long essay answer',
    ]);

    expect($attempt->score)->toBe(0)
        ->and($attempt->passed)->toBeFalse();
});
