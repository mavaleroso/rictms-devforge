<?php

namespace App\Actions\Admin;

use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\UploadedFile;

final class CreateUser
{
    public function __construct(
        private readonly UserService $users,
    ) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function execute(array $attributes, ?UploadedFile $avatar = null): User
    {
        return $this->users->create($attributes, $avatar);
    }
}
