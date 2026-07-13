<?php

use App\Enums\CapstoneMilestoneStatus;
use App\Enums\CapstoneProjectStatus;
use App\Enums\ProgressStatus;
use App\Models\CapstoneTemplate;
use App\Models\Enrollment;
use App\Models\LearningPath;
use App\Models\Level;
use App\Models\LevelProgress;
use App\Models\User;
use App\Notifications\CapstoneMilestoneSubmittedNotification;
use App\Services\Capstone\CapstoneProjectService;
use Database\Seeders\CapstoneSeeder;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    $this->seed(CapstoneSeeder::class);
});

function makeCapstoneEnrollment(?User $mentor = null): array
{
    $intern = userWithRole('intern');
    $path = LearningPath::create(['name' => 'Cap Path '.uniqid(), 'slug' => 'cap-path-'.uniqid(), 'is_active' => true]);
    $level20 = Level::create(['learning_path_id' => $path->id, 'number' => 20, 'title' => 'Capstone', 'estimated_minutes' => 120, 'difficulty' => 'expert']);

    $enrollment = Enrollment::create([
        'user_id' => $intern->id,
        'learning_path_id' => $path->id,
        'mentor_id' => $mentor?->id,
        'status' => 'active',
        'started_at' => now(),
    ]);

    LevelProgress::create([
        'enrollment_id' => $enrollment->id,
        'level_id' => $level20->id,
        'status' => ProgressStatus::Available,
    ]);

    return compact('intern', 'path', 'level20', 'enrollment');
}

test('intern can view capstone when level 20 is unlocked', function () {
    ['intern' => $intern] = makeCapstoneEnrollment();

    $this->actingAs($intern)
        ->get(route('learn.capstone.show'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('learn/capstone/show'));
});

test('intern can start capstone project from template as draft when kickoff required', function () {
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment();
    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();

    $this->actingAs($intern)
        ->post(route('learn.capstone.start'), ['template_id' => $template->id])
        ->assertRedirect(route('learn.capstone.show'));

    $project = $enrollment->fresh()->capstoneProject;
    expect($project)->not->toBeNull()
        ->and($project->status)->toBe(CapstoneProjectStatus::Draft);
});

test('mentor can approve kickoff and unlock first milestone', function () {
    $mentor = userWithRole('mentor');
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment($mentor);
    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();
    $project = app(CapstoneProjectService::class)->start($enrollment, $template, $intern);

    $this->actingAs($mentor)
        ->post(route('mentor.capstone-kickoffs.approve', $project))
        ->assertRedirect(route('mentor.capstone-reviews.index'));

    expect($project->fresh()->status)->toBe(CapstoneProjectStatus::Active)
        ->and($project->fresh()->milestones->first()->status)->toBe(CapstoneMilestoneStatus::InProgress);
});

test('intern cannot submit milestone without mentor when signoff required', function () {
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment(null);
    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();
    $template->update(['requires_kickoff' => false]);
    $project = app(CapstoneProjectService::class)->start($enrollment, $template->fresh(), $intern);
    $milestone = $project->milestones->first();

    $this->actingAs($intern)
        ->post(route('learn.capstone.milestones.submit', $milestone), [
            'submission_notes' => 'Here is my proposal draft for review.',
            'deliverable_url' => 'https://example.com/proposal',
        ])
        ->assertSessionHasErrors('milestone');
});

test('intern can submit milestone with deliverables and mentor is notified', function () {
    Notification::fake();
    $mentor = userWithRole('mentor');
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment($mentor);
    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();
    $template->update(['requires_kickoff' => false]);
    $project = app(CapstoneProjectService::class)->start($enrollment, $template->fresh(), $intern);
    $milestone = $project->milestones->first();

    $this->actingAs($intern)
        ->post(route('learn.capstone.milestones.submit', $milestone), [
            'submission_notes' => 'Architecture and ERD attached via link.',
            'deliverable_url' => 'https://example.com/docs',
            'repo_url' => 'https://github.com/example/capstone',
        ])
        ->assertRedirect();

    expect($milestone->fresh()->status)->toBe(CapstoneMilestoneStatus::Submitted)
        ->and($milestone->fresh()->deliverable_url)->toBe('https://example.com/docs');

    Notification::assertSentTo($mentor, CapstoneMilestoneSubmittedNotification::class);
});

test('mentor can approve submitted milestone', function () {
    $mentor = userWithRole('mentor');
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment($mentor);
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

test('mentor reject returns milestone to rejected for resubmit', function () {
    $mentor = userWithRole('mentor');
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment($mentor);
    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();
    $template->update(['requires_kickoff' => false]);
    $project = app(CapstoneProjectService::class)->start($enrollment, $template->fresh(), $intern);
    $milestone = $project->milestones->first();
    $milestone->update(['status' => CapstoneMilestoneStatus::Submitted, 'submitted_at' => now()]);

    $this->actingAs($mentor)
        ->patch(route('mentor.capstone-reviews.update', $milestone), [
            'status' => 'rejected',
            'mentor_feedback' => 'Needs clearer ERD.',
        ])
        ->assertRedirect(route('mentor.capstone-reviews.index'));

    expect($milestone->fresh()->status)->toBe(CapstoneMilestoneStatus::Rejected)
        ->and($milestone->fresh()->mentor_feedback)->toBe('Needs clearer ERD.');
});

test('self-check milestone auto-approves without mentor queue', function () {
    $mentor = userWithRole('mentor');
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment($mentor);
    $template = CapstoneTemplate::query()->where('slug', 'internal-tool-automation')->firstOrFail();
    $template->update(['requires_kickoff' => false]);
    $project = app(CapstoneProjectService::class)->start($enrollment, $template->fresh(), $intern);

    $selfCheck = $project->milestones->firstWhere('requires_mentor_signoff', false)
        ?? $project->milestones->skip(2)->first();

    $selfCheck->update([
        'requires_mentor_signoff' => false,
        'status' => CapstoneMilestoneStatus::InProgress,
    ]);

    $this->actingAs($intern)
        ->post(route('learn.capstone.milestones.submit', $selfCheck), [
            'submission_notes' => 'Dashboard screenshots documented.',
            'deliverable_url' => 'https://example.com/admin',
        ])
        ->assertRedirect();

    expect($selfCheck->fresh()->status)->toBe(CapstoneMilestoneStatus::Approved);
});

test('intern can write journal tagged to milestone', function () {
    $mentor = userWithRole('mentor');
    ['intern' => $intern, 'enrollment' => $enrollment] = makeCapstoneEnrollment($mentor);
    $template = CapstoneTemplate::query()->where('slug', 'full-stack-portfolio')->firstOrFail();
    $template->update(['requires_kickoff' => false]);
    $project = app(CapstoneProjectService::class)->start($enrollment, $template->fresh(), $intern);
    $milestone = $project->milestones->first();

    $this->actingAs($intern)
        ->post(route('learn.capstone.journal.store'), [
            'entry_date' => now()->toDateString(),
            'content' => 'Spent the morning refining wireframes and schema.',
            'mood' => 'good',
            'hours_spent' => 3,
            'milestone_id' => $milestone->id,
        ])
        ->assertRedirect();

    expect($project->journalEntries()->first()->capstone_project_milestone_id)->toBe($milestone->id);
});

test('admin can create capstone template', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->post(route('admin.capstone-templates.store'), [
            'name' => 'API Gateway Lab',
            'description' => 'Build a gateway.',
            'objectives' => 'Rate limiting',
            'estimated_weeks' => 2,
            'is_active' => true,
            'requires_kickoff' => true,
            'allow_parallel_milestones' => false,
        ])
        ->assertRedirect();

    expect(CapstoneTemplate::query()->where('name', 'API Gateway Lab')->exists())->toBeTrue();
});

test('admin can view capstone templates', function () {
    $admin = userWithRole('admin');

    $this->actingAs($admin)
        ->get(route('admin.capstone-templates.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/capstone-templates/index'));
});

test('second template includes milestones', function () {
    $template = CapstoneTemplate::query()->where('slug', 'internal-tool-automation')->firstOrFail();

    expect($template->milestones()->count())->toBeGreaterThan(0)
        ->and($template->tasks()->count())->toBeGreaterThan(0);
});
