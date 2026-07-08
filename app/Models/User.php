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
        'github_id',
        'github_username',
        'github_token',
        'is_active',
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
        'github_token',
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
            'is_active' => 'boolean',
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
        $middleInitial = self::formatMiddleInitial($middle);

        return collect([$first, $middleInitial, $last])
            ->map(fn (?string $part) => trim($part ?? ''))
            ->filter()
            ->implode(' ');
    }

    private static function formatMiddleInitial(?string $middle): ?string
    {
        $middle = trim($middle ?? '');

        if ($middle === '') {
            return null;
        }

        $letter = mb_substr(str_replace('.', '', $middle), 0, 1);

        return $letter !== '' ? mb_strtoupper($letter).'.' : null;
    }
}
