<?php

namespace App\Actions\Admin;

use App\Models\LearningMaterial;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Video;
use App\Services\Admin\LevelContentService;
use Illuminate\Http\UploadedFile;

final class ManageLevelContent
{
    public function __construct(
        private readonly LevelContentService $content,
    ) {}

    public function storeMaterial(Level $level, array $attributes): LearningMaterial
    {
        return $this->content->storeMaterial($level, $attributes);
    }

    public function updateMaterial(LearningMaterial $material, array $attributes): void
    {
        $this->content->updateMaterial($material, $attributes);
    }

    public function deleteMaterial(LearningMaterial $material): void
    {
        $this->content->deleteMaterial($material);
    }

    public function storeVideo(Level $level, array $attributes, ?UploadedFile $file = null): Video
    {
        return $this->content->storeVideo($level, $attributes, $file);
    }

    public function updateVideo(Video $video, array $attributes, ?UploadedFile $file = null): void
    {
        $this->content->updateVideo($video, $attributes, $file);
    }

    public function deleteVideo(Video $video): void
    {
        $this->content->deleteVideo($video);
    }

    public function updateQuiz(Level $level, array $attributes): Quiz
    {
        return $this->content->updateQuiz($level, $attributes);
    }

    /** @param  array<string, mixed>  $options */
    public function storeQuestion(Quiz $quiz, array $data, array $options = []): QuizQuestion
    {
        return $this->content->storeQuestion($quiz, $data, $options);
    }

    /** @param  array<string, mixed>|null  $options */
    public function updateQuestion(QuizQuestion $question, array $data, ?array $options = null): void
    {
        $this->content->updateQuestion($question, $data, $options);
    }

    public function deleteQuestion(QuizQuestion $question): void
    {
        $this->content->deleteQuestion($question);
    }
}
