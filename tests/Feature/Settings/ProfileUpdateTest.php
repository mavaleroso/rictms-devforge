<?php

use App\Models\User;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'first_name' => 'Test',
            'middle_name' => 'Q',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'phone' => '+63 912 345 6789',
            'sex' => 'male',
            'birthdate' => '2000-01-15',
            'address' => '123 Learning St, Manila',
            'occupation' => 'Intern Developer',
            'bio' => 'Building skills through DevForge.',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->first_name)->toBe('Test')
        ->and($user->middle_name)->toBe('Q')
        ->and($user->last_name)->toBe('User')
        ->and($user->name)->toBe('Test Q. User')
        ->and($user->email)->toBe('test@example.com')
        ->and($user->phone)->toBe('+63 912 345 6789')
        ->and($user->sex?->value)->toBe('male')
        ->and($user->birthdate?->toDateString())->toBe('2000-01-15')
        ->and($user->address)->toBe('123 Learning St, Manila')
        ->and($user->occupation)->toBe('Intern Developer')
        ->and($user->bio)->toBe('Building skills through DevForge.')
        ->and($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
    ]);

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'first_name' => 'Jane',
            'middle_name' => '',
            'last_name' => 'Cooper',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('users cannot delete their account from profile settings', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete('/settings/profile')
        ->assertMethodNotAllowed();
});
