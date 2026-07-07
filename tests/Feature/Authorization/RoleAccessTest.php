<?php

test('admin can access admin routes', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk();
});

test('mentor cannot access admin routes', function () {
    $mentor = userWithRole('mentor');

    $this->actingAs($mentor)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

test('intern can access learn routes', function () {
    $intern = userWithRole('intern');

    $this->actingAs($intern)
        ->get(route('learn.paths.index'))
        ->assertOk();
});

test('admin cannot access intern learn routes', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('learn.paths.index'))
        ->assertForbidden();
});

test('mentor can access mentor routes', function () {
    $mentor = userWithRole('mentor');

    $this->actingAs($mentor)
        ->get(route('mentor.interns.index'))
        ->assertOk();
});
