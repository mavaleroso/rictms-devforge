<?php

use App\Actions\Learning\CompleteContent;
use App\Actions\Learning\EnrollIntern;
use App\Actions\Quiz\GradeQuizAttempt;
use App\Enums\EnrollmentStatus;
use App\Enums\MaterialType;
use App\Enums\ProgressStatus;
use App\Enums\QuestionType;
use App\Enums\VideoProvider;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Video;

function createPathWithTwoLevels(): array
{
    $path = LearningPath::create([
        'name' => 'Progression Path',
        'slug' => 'progression-path',
        'is_active' => true,
    ]);

    $level1 = Level::create([
        'learning_path_id' => $path->id,
        'number' => 1,
        'title' => 'Level 1',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    $level2 = Level::create([
        'learning_path_id' => $path->id,
        'number' => 2,
        'title' => 'Level 2',
        'estimated_minutes' => 60,
        'difficulty' => 'beginner',
    ]);

    $material = LearningMaterial::create([
        'level_id' => $level1->id,
        'type' => MaterialType::Markdown,
        'title' => 'Lesson',
        'content' => 'Content',
    ]);

    $video = Video::create([
        'level_id' => $level1->id,
        'title' => 'Video',
        'provider' => VideoProvider::Youtube,
        'url' => 'https://youtube.com/watch?v=test',
    ]);

    $quiz = Quiz::create([
        'level_id' => $level1->id,
        'title' => 'Quiz',
        'passing_score' => 80,
        'max_attempts' => 3,
    ]);

    $question = QuizQuestion::create([
        'quiz_id' => $quiz->id,
        'type' => QuestionType::TrueFalse,
        'question' => 'True?',
        'points' => 1,
        'correct_answer' => 'true',
    ]);

    return compact('path', 'level1', 'level2', 'material', 'video', 'quiz', 'question');
}

test('completing level 1 unlocks level 2', function () {
    $intern = userWithRole('intern');
    ['path' => $path, 'level1' => $level1, 'level2' => $level2, 'material' => $material, 'video' => $video, 'quiz' => $quiz, 'question' => $question] = createPathWithTwoLevels();

    $enrollment = app(EnrollIntern::class)->execute($intern, $path);

    app(CompleteContent::class)->execute($intern, $material);
    app(CompleteContent::class)->execute($intern, $video);

    app(GradeQuizAttempt::class)->execute($intern, $quiz, [
        $question->id => 'true',
    ]);

    $level1Progress = $enrollment->fresh()->levelProgress()->where('level_id', $level1->id)->first();
    $level2Progress = $enrollment->fresh()->levelProgress()->where('level_id', $level2->id)->first();

    expect($level1Progress->status)->toBe(ProgressStatus::Completed)
        ->and($level2Progress->status)->toBe(ProgressStatus::Available);
});

test('completing level 20 marks enrollment completed', function () {
    $intern = userWithRole('intern');

    $path = LearningPath::create([
        'name' => 'Final Path',
        'slug' => 'final-path',
        'is_active' => true,
    ]);

    $level = Level::create([
        'learning_path_id' => $path->id,
        'number' => 20,
        'title' => 'Final Level',
        'estimated_minutes' => 60,
        'difficulty' => 'advanced',
    ]);

    $enrollment = app(EnrollIntern::class)->execute($intern, $path);

    $enrollment->levelProgress()->where('level_id', $level->id)->update([
        'status' => ProgressStatus::InProgress,
    ]);

    $quiz = Quiz::create([
        'level_id' => $level->id,
        'title' => 'Final Quiz',
        'passing_score' => 50,
        'max_attempts' => 3,
    ]);

    $question = QuizQuestion::create([
        'quiz_id' => $quiz->id,
        'type' => QuestionType::Identification,
        'question' => 'Answer',
        'points' => 1,
        'correct_answer' => 'done',
    ]);

    app(GradeQuizAttempt::class)->execute($intern, $quiz, [
        $question->id => 'done',
    ]);

    expect($enrollment->fresh()->status)->toBe(EnrollmentStatus::Completed);
});
