<?php

namespace App\Models;

use App\Enums\EnrollmentStatus;
use App\Enums\Sex;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'password',
        'avatar',
        'bio',
        'sex',
        'birthdate',
        'phone',
        'address',
        'occupation',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'avatar',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birthdate' => 'date',
            'sex' => Sex::class,
            'password' => 'hashed',
        ];
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function mentoredEnrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class, 'mentor_id');
    }

    public function activeEnrollment(): ?Enrollment
    {
        return $this->enrollments()
            ->where('status', EnrollmentStatus::Active)
            ->with('learningPath')
            ->latest()
            ->first();
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isMentor(): bool
    {
        return $this->hasRole('mentor');
    }

    public function isIntern(): bool
    {
        return $this->hasRole('intern');
    }

    public function getAvatarUrlAttribute(): ?string
    {
        if (! $this->avatar) {
            return null;
        }

        return Storage::disk('public')->url($this->avatar).'?v='.$this->updated_at?->timestamp;
    }

    public static function composeFullName(?string $first, ?string $middle, ?string $last): string
    {
        return collect([$first, $middle, $last])
            ->map(fn (?string $part) => trim($part ?? ''))
            ->filter()
            ->implode(' ');
    }
}
