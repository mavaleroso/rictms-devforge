<?php

namespace App\Services\Admin;

use App\Enums\VideoProvider;
use App\Models\LearningMaterial;
use App\Models\Level;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Video;
use App\Repositories\Contracts\LearningMaterialRepository;
use App\Repositories\Contracts\QuizQuestionRepository;
use App\Repositories\Contracts\QuizRepository;
use App\Repositories\Contracts\VideoRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

final class LevelContentService
{
    public function __construct(
        private readonly LearningMaterialRepository $materials,
        private readonly VideoRepository $videos,
        private readonly QuizRepository $quizzes,
        private readonly QuizQuestionRepository $questions,
    ) {}

    public function storeMaterial(Level $level, array $attributes, array $files = []): LearningMaterial
    {
        unset($attributes['file_path'], $attributes['remove_file'], $attributes['remove_file_ids'], $attributes['files']);

        $material = $this->materials->createForLevel($level, $attributes);
        $this->attachMaterialFiles($material, $files);

        return $material;
    }

    public function updateMaterial(
        LearningMaterial $material,
        array $attributes,
        array $files = [],
        array $removeFileIds = [],
    ): void {
        unset($attributes['file_path'], $attributes['remove_file'], $attributes['remove_file_ids'], $attributes['files']);

        $this->removeMaterialFiles($material, $removeFileIds);
        $this->attachMaterialFiles($material, $files);

        $this->materials->update($material, $attributes);
    }

    public function deleteMaterial(LearningMaterial $material): void
    {
        $material->load('files');

        foreach ($material->files as $file) {
            $this->deleteMaterialFile($file->file_path);
        }

        $this->materials->delete($material);
    }

    public function storeVideo(Level $level, array $attributes, ?UploadedFile $file = null): Video
    {
        $provider = VideoProvider::from($attributes['provider']);

        if ($provider === VideoProvider::Upload) {
            $attributes['file_path'] = $this->storeVideoFile($level, $file);
            $attributes['url'] = null;
        } else {
            $attributes['file_path'] = null;
        }

        return $this->videos->createForLevel($level, $attributes);
    }

    public function updateVideo(Video $video, array $attributes, ?UploadedFile $file = null): void
    {
        if (isset($attributes['provider'])) {
            $provider = VideoProvider::from($attributes['provider']);

            if ($provider === VideoProvider::Youtube) {
                $this->deleteVideoFile($video->file_path);
                $attributes['file_path'] = null;
            }
        }

        if ($file) {
            $this->deleteVideoFile($video->file_path);
            $attributes['file_path'] = $this->storeVideoFile($video->level, $file);
            $attributes['provider'] = VideoProvider::Upload->value;
            $attributes['url'] = null;
        }

        $this->videos->update($video, $attributes);
    }

    public function deleteVideo(Video $video): void
    {
        $this->deleteVideoFile($video->file_path);
        $this->videos->delete($video);
    }

    public function updateQuiz(Level $level, array $attributes): Quiz
    {
        return $this->quizzes->updateOrCreateForLevel($level, $attributes);
    }

    /** @param  array<string, mixed>  $options */
    public function storeQuestion(Quiz $quiz, array $data, array $options = []): QuizQuestion
    {
        return $this->questions->createWithOptions($quiz, $data, $options);
    }

    /** @param  array<string, mixed>|null  $options */
    public function updateQuestion(QuizQuestion $question, array $data, ?array $options = null): void
    {
        $this->questions->updateWithOptions($question, $data, $options);
    }

    public function deleteQuestion(QuizQuestion $question): void
    {
        $this->questions->delete($question);
    }

    private function storeVideoFile(Level $level, UploadedFile $file): string
    {
        return $file->store("learning-paths/{$level->learning_path_id}/levels/{$level->id}/videos", 'public');
    }

    private function deleteVideoFile(?string $path): void
    {
        if (! $path) {
            return;
        }

        Storage::disk('public')->delete($path);
    }

    private function storeMaterialFile(Level $level, UploadedFile $file): string
    {
        return $file->store("learning-paths/{$level->learning_path_id}/levels/{$level->id}/materials", 'public');
    }

    /** @param  array<int, UploadedFile>  $files */
    private function attachMaterialFiles(LearningMaterial $material, array $files): void
    {
        if ($files === []) {
            return;
        }

        $material->loadMissing('level');
        $nextSortOrder = (int) $material->files()->max('sort_order');

        foreach ($files as $uploadedFile) {
            if (! $uploadedFile instanceof UploadedFile) {
                continue;
            }

            $nextSortOrder++;

            $material->files()->create([
                'file_path' => $this->storeMaterialFile($material->level, $uploadedFile),
                'original_name' => $uploadedFile->getClientOriginalName(),
                'sort_order' => $nextSortOrder,
            ]);
        }
    }

    /** @param  array<int, int>  $removeFileIds */
    private function removeMaterialFiles(LearningMaterial $material, array $removeFileIds): void
    {
        if ($removeFileIds === []) {
            return;
        }

        $files = $material->files()->whereIn('id', $removeFileIds)->get();

        foreach ($files as $file) {
            $this->deleteMaterialFile($file->file_path);
            $file->delete();
        }
    }

    private function deleteMaterialFile(?string $path): void
    {
        if (! $path) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
