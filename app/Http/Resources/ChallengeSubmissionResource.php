<?php

namespace App\Http\Resources;

use App\Models\ChallengeSubmission;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChallengeSubmission */
class ChallengeSubmissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isOwner = $request->user()?->id === $this->user_id;
        $canViewCode = $isOwner || $request->user()?->isAdmin() || $request->user()?->isMentor();

        return [
            'id' => $this->id,
            'status' => $this->status?->value,
            'language' => $this->language?->value,
            'code' => $this->when($canViewCode, $this->code),
            'attempt_number' => $this->attempt_number,
            'tests_passed' => $this->tests_passed,
            'tests_total' => $this->tests_total,
            'runtime_ms' => $this->runtime_ms,
            'submission_source' => $this->submission_source?->value,
            'evaluation_driver' => $this->evaluation_driver?->value,
            'github_owner' => $this->github_owner,
            'github_repo' => $this->github_repo,
            'github_ref' => $this->github_ref,
            'github_path' => $this->github_path,
            'github_commit_sha' => $this->github_commit_sha,
            'github_url' => $this->github_owner && $this->github_repo
                ? "https://github.com/{$this->github_owner}/{$this->github_repo}"
                .($this->github_commit_sha ? "/commit/{$this->github_commit_sha}" : '')
                : null,
            'mentor_feedback' => $this->mentor_feedback,
            'mentor_score' => $this->mentor_score,
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'challenge' => new CodingChallengeResource($this->whenLoaded('challenge')),
            'results' => ChallengeSubmissionResultResource::collection($this->whenLoaded('results')),
        ];
    }
}
