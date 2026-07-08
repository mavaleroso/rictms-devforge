<?php

use App\Enums\CapstoneMilestoneStatus;
use App\Enums\ProgressStatus;
use App\Models\CapstoneTemplate;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\LevelProgress;
use App\Models\User;
use App\Services\Capstone\CapstoneProjectService;
use Database\Seeders\CapstoneSeeder;

beforeEach(function () {
    $this->seed(CapstoneSeeder::class);
});

function unlockCapstoneForIntern(User $intern, LearningPath $path): Enrollment
{
    $level20 = Level::query()->where('learning_path_id', $path->id)->where('number', 20)->firstOrFail();

    $enrollment = Enrollment::query()->where('user_id', $intern->id)->where('learning_path_id', $path->id)->firstOrFail();

    LevelProgress::query()
        ->where('enrollment_id', $enrollment->id)
        ->where('level_id', $level20->id)
        ->update(['status' => ProgressStatus::Available]);

    return $enrollment->fresh();
}

test('intern can view capstone when level 20 is unlocked', function () {
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Cap Path', 'slug' => 'cap-path', 'is_active' => true]);
    Level::create(['learning_path_id' => $path->id, 'number' => 20, 'title' => 'Capstone', 'estimated_minutes' => 120, 'difficulty' => 'expert']);

    Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    LevelProgress::create([
        'enrollment_id' => Enrollment::first()->id,
        'level_id' => Level::first()->id,
        'status' => ProgressStatus::Available,
    ]);

    $this->actingAs($intern)
        ->get(route('learn.capstone.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('learn/capstone/show'));
});

test('intern can start capstone project from template', function () {
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Start Path', 'slug' => 'start-path', 'is_active' => true]);
    $level20 = Level::create(['learning_path_id' => $path->id, 'number' => 20, 'title' => 'Capstone', 'estimated_minutes' => 120, 'difficulty' => 'expert']);

    $enrollment = Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    LevelProgress::create([
        'enrollment_id' => $enrollment->id,
        'level_id' => $level20->id,
        'status' => ProgressStatus::Available,
    ]);

    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();

    $this->actingAs($intern)
        ->post(route('learn.capstone.start'), ['template_id' => $template->id])
        ->assertRedirect(route('learn.capstone.show'));

    expect($enrollment->fresh()->capstoneProject)->not->toBeNull();
});

test('mentor can approve submitted milestone', function () {
    $mentor = userWithRole('mentor');
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Review Path', 'slug' => 'review-path', 'is_active' => true]);
    $level20 = Level::create(['learning_path_id' => $path->id, 'number' => 20, 'title' => 'Capstone', 'estimated_minutes' => 120, 'difficulty' => 'expert']);

    $enrollment = Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'mentor_id' => $mentor->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    LevelProgress::create([
        'enrollment_id' => $enrollment->id,
        'level_id' => $level20->id,
        'status' => ProgressStatus::Available,
    ]);

    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();
    $project = app(CapstoneProjectService::class)->start($enrollment, $template, $intern);

    $milestone = $project->milestones->first();
    $milestone->update(['status' => CapstoneMilestoneStatus::Submitted, 'submitted_at' => now()]);

    $this->actingAs($mentor)
        ->patch(route('mentor.capstone-reviews.update', $milestone), [
            'status' => 'approved',
            'mentor_feedback' => 'Solid proposal.',
            'mentor_score' => 90,
        ])
        ->assertRedirect(route('mentor.capstone-reviews.index'));

    expect($milestone->fresh()->status)->toBe(CapstoneMilestoneStatus::Approved);
});

test('admin can view capstone templates', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.capstone-templates.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/capstone-templates/index'));
});
