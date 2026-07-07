<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can list users with stats', function () {
    $admin = userWithRole('admin');
    userWithRole('mentor');
    userWithRole('intern');

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->has('users.data', 3)
            ->has('stats', fn ($stats) => $stats
                ->where('total', 3)
                ->where('admins', 1)
                ->where('mentors', 1)
                ->where('interns', 1)
            )
        );
});

test('admin can create a user with avatar', function () {
    Storage::fake('public');

    $admin = userWithRole('admin');

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'first_name' => 'New',
            'middle_name' => 'A',
            'last_name' => 'Mentor',
            'email' => 'mentor.new@devforge.test',
            'phone' => '+639171234567',
            'sex' => 'male',
            'birthdate' => '1995-04-12',
            'address' => '123 Main St, Manila',
            'occupation' => 'Software Engineer',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'mentor',
            'bio' => 'Experienced Laravel mentor.',
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

    $user = User::where('email', 'mentor.new@devforge.test')->first();

    $response->assertRedirect(route('admin.users.edit', $user));

    expect($user)->not->toBeNull()
        ->and($user->name)->toBe('New A Mentor')
        ->and($user->first_name)->toBe('New')
        ->and($user->last_name)->toBe('Mentor')
        ->and($user->occupation)->toBe('Software Engineer')
        ->and($user->bio)->toBe('Experienced Laravel mentor.')
        ->and($user->hasRole('mentor'))->toBeTrue()
        ->and($user->avatar)->not->toBeNull();

    Storage::disk('public')->assertExists($user->avatar);
});

test('admin can update a user and replace avatar', function () {
    Storage::fake('public');

    $admin = userWithRole('admin');
    $intern = userWithRole('intern');
    $oldAvatar = UploadedFile::fake()->image('old.jpg')->store("users/avatars/{$intern->id}", 'public');
    $intern->update(['avatar' => $oldAvatar, 'bio' => 'Old bio', 'first_name' => 'Intern', 'last_name' => 'User']);

    $this->actingAs($admin)
        ->patch(route('admin.users.update', $intern), [
            'first_name' => 'Updated',
            'middle_name' => '',
            'last_name' => 'Intern',
            'email' => $intern->email,
            'role' => 'intern',
            'bio' => 'Updated bio',
            'occupation' => 'QA Tester',
            'avatar' => UploadedFile::fake()->image('new.jpg'),
        ])
        ->assertRedirect(route('admin.users.edit', $intern));

    $intern->refresh();

    expect($intern->name)->toBe('Updated Intern')
        ->and($intern->bio)->toBe('Updated bio')
        ->and($intern->occupation)->toBe('QA Tester')
        ->and($intern->avatar)->not->toBe($oldAvatar);

    Storage::disk('public')->assertMissing($oldAvatar);
    Storage::disk('public')->assertExists($intern->avatar);
});

test('admin can delete another user', function () {
    $admin = userWithRole('admin');
    $intern = userWithRole('intern');

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $intern))
        ->assertRedirect(route('admin.users.index'));

    $this->assertDatabaseMissing('users', ['id' => $intern->id]);
});

test('admin cannot delete their own account', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $admin))
        ->assertForbidden();

    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('admin can delete another admin when multiple admins exist', function () {
    $admin = userWithRole('admin');
    $otherAdmin = userWithRole('admin');

    $this->actingAs($admin)
        ->delete(route('admin.users.destroy', $otherAdmin))
        ->assertRedirect(route('admin.users.index'));

    $this->assertDatabaseMissing('users', ['id' => $otherAdmin->id]);
});
