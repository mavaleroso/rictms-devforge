<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Certificate */
class CertificateResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'verification_code' => $this->verification_code,
            'issued_at' => $this->issued_at?->toIso8601String(),
            'metadata' => $this->metadata,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'avatar_url' => $this->user->avatar_url,
            ]),
            'learning_path' => $this->whenLoaded('learningPath', fn () => [
                'id' => $this->learningPath->id,
                'name' => $this->learningPath->name,
                'slug' => $this->learningPath->slug,
            ]),
            'enrollment' => $this->whenLoaded('enrollment', fn () => [
                'id' => $this->enrollment->id,
                'mentor' => $this->enrollment->mentor ? [
                    'id' => $this->enrollment->mentor->id,
                    'name' => $this->enrollment->mentor->name,
                ] : null,
            ]),
            'verify_url' => route('certificates.verify', $this->verification_code),
            'download_url' => route('learn.certificates.download', $this->id),
        ];
    }
}
