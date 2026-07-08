<?php

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs(userWithRole('admin'))
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('role', 'admin')
            ->has('stats')
        );
});

test('mentor dashboard includes mentor stats', function () {
    $this->actingAs(userWithRole('mentor'))
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('role', 'mentor')
            ->has('mentor_stats')
            ->has('assigned_interns.data')
        );
});

test('intern dashboard renders for intern role', function () {
    $this->actingAs(userWithRole('intern'))
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('role', 'intern')
        );
});