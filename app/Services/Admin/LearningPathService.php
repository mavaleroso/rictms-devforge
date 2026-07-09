<?php

namespace App\Services\Admin;

use App\Enums\XpSourceType;
use App\Models\Certificate;
use App\Models\CodingChallenge;
use App\Models\ContentCompletion;
use App\Models\LearningMaterial;
use App\Models\LearningPath;
use App\Models\Quiz;
use App\Models\TutorSession;
use App\Models\Video;
use App\Models\XpTransaction;
use App\Repositories\Contracts\LearningPathRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class LearningPathService
{
    public function __construct(
        private readonly LearningPathRepository $paths,
    ) {}

    public function create(array $attributes, ?UploadedFile $cover = null): LearningPath
    {
        $attributes['slug'] = Str::slug($attributes['slug'] ?? $attributes['name']);
        unset($attributes['cover_image'], $attributes['remove_cover']);

        $path = $this->paths->create($attributes);

        if ($cover) {
            $this->storeCover($path, $cover);
        }

        return $path;
    }

    public function update(LearningPath $path, array $attributes, ?UploadedFile $cover = null, bool $removeCover = false): void
    {
        if (isset($attributes['slug'])) {
            $attributes['slug'] = Str::slug($attributes['slug']);
        }

        unset($attributes['cover_image'], $attributes['remove_cover']);

        $this->paths->update($path, $attributes);
        $this->syncCover($path, $cover, $removeCover);
    }

    public function delete(LearningPath $path): void
    {
        DB::transaction(function () use ($path) {
            $path->load([
                'levels.materials',
                'levels.videos',
                'levels.quiz',
                'levels.codingChallenges',
                'enrollments',
            ]);

            $levelIds = $path->levels->pluck('id');
            $materialIds = $path->levels->flatMap->materials->pluck('id');
            $videoIds = $path->levels->flatMap->videos->pluck('id');
            $quizIds = $path->levels->map(fn ($level) => $level->quiz?->id)->filter();
            $challengeIds = $path->levels->flatMap->codingChallenges->pluck('id');
            $enrollmentIds = $path->enrollments->pluck('id');

            $this->deleteCertificatesForPath($path);

            foreach ($path->levels as $level) {
                foreach ($level->videos as $video) {
                    $this->deleteStoredVideoFile($video->file_path);
                }
            }

            $this->deleteContentCompletions($materialIds, LearningMaterial::class);
            $this->deleteContentCompletions($videoIds, Video::class);
            $this->deleteContentCompletions($quizIds, Quiz::class);
            $this->deleteContentCompletions($challengeIds, CodingChallenge::class);

            $this->deleteXpTransactions(XpSourceType::MaterialComplete, $materialIds);
            $this->deleteXpTransactions(XpSourceType::VideoComplete, $videoIds);
            $this->deleteXpTransactions(XpSourceType::QuizPass, $quizIds);
            $this->deleteXpTransactions(XpSourceType::ChallengePass, $challengeIds);
            $this->deleteXpTransactions(XpSourceType::ChallengeApproved, $challengeIds);
            $this->deleteXpTransactions(XpSourceType::LevelComplete, $levelIds);
            $this->deleteXpTransactions(XpSourceType::PathComplete, $enrollmentIds);

            if ($levelIds->isNotEmpty()) {
                TutorSession::query()->whereIn('level_id', $levelIds)->delete();
            }

            $this->removeCoverFile($path);
            $this->paths->delete($path);
        });
    }

    public function syncCover(LearningPath $path, ?UploadedFile $cover = null, bool $remove = false): void
    {
        if ($remove) {
            $this->deleteCover($path);
        }

        if ($cover) {
            $this->deleteCover($path);
            $this->storeCover($path, $cover);
        }
    }

    private function storeCover(LearningPath $path, UploadedFile $cover): void
    {
        $path->update([
            'cover_image' => $cover->store('learning-paths/covers', 'public'),
        ]);
    }

    private function deleteCover(LearningPath $path): void
    {
        $this->removeCoverFile($path);
        $path->update(['cover_image' => null]);
    }

    private function removeCoverFile(LearningPath $path): void
    {
        if (! $path->cover_image) {
            return;
        }

        Storage::disk('public')->delete($path->cover_image);
    }

    private function deleteStoredVideoFile(?string $filePath): void
    {
        if (! $filePath) {
            return;
        }

        Storage::disk('public')->delete($filePath);
    }

    private function deleteCertificatesForPath(LearningPath $path): void
    {
        $disk = config('certificates.storage_disk', 'local');

        Certificate::query()
            ->where('learning_path_id', $path->id)
            ->get()
            ->each(function (Certificate $certificate) use ($disk) {
                if ($certificate->pdf_path) {
                    Storage::disk($disk)->delete($certificate->pdf_path);
                }
            });

        Certificate::query()->where('learning_path_id', $path->id)->delete();
    }

    /** @param  \Illuminate\Support\Collection<int, int>  $ids */
    private function deleteContentCompletions($ids, string $type): void
    {
        if ($ids->isEmpty()) {
            return;
        }

        ContentCompletion::query()
            ->where('completable_type', $type)
            ->whereIn('completable_id', $ids)
            ->delete();
    }

    /** @param  \Illuminate\Support\Collection<int, int>  $sourceIds */
    private function deleteXpTransactions(XpSourceType $sourceType, $sourceIds): void
    {
        if ($sourceIds->isEmpty()) {
            return;
        }

        XpTransaction::query()
            ->where('source_type', $sourceType->value)
            ->whereIn('source_id', $sourceIds)
            ->delete();
    }
}
