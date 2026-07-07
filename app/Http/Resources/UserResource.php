<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'sex' => $this->sex?->value,
            'birthdate' => $this->birthdate?->format('Y-m-d'),
            'address' => $this->address,
            'occupation' => $this->occupation,
            'bio' => $this->bio,
            'avatar_url' => $this->avatar_url,
            'roles' => $this->getRoleNames(),
            'role' => $this->getRoleNames()->first(),
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'enrollments_count' => $this->whenCounted('enrollments'),
            'mentored_enrollments_count' => $this->whenCounted('mentoredEnrollments'),
        ];
    }
}
