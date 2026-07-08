<?php

namespace Database\Seeders;

use App\Enums\CapstoneTaskPriority;
use App\Enums\CapstoneTaskStatus;
use App\Models\CapstoneTemplate;
use App\Models\CapstoneTemplateMilestone;
use App\Models\CapstoneTemplateTask;
use Illuminate\Database\Seeder;

class CapstoneSeeder extends Seeder
{
    public function run(): void
    {
        $template = CapstoneTemplate::updateOrCreate(
            ['slug' => 'full-stack-portfolio'],
            [
                'name' => 'Full-Stack Portfolio App',
                'description' => 'Design, build, and deploy a production-ready web application that demonstrates your Laravel and React skills.',
                'objectives' => "• Authenticated user flows\n• RESTful API or Inertia-driven UI\n• Database design with migrations\n• Deployed demo with documentation",
                'estimated_weeks' => 4,
                'is_active' => true,
                'sort_order' => 1,
            ],
        );

        if ($template->milestones()->exists()) {
            return;
        }

        $milestones = [
            [
                'title' => 'Project proposal & architecture',
                'description' => 'Submit scope, wireframes, ERD, and tech stack decisions for mentor approval.',
                'tasks' => [
                    ['title' => 'Draft problem statement', 'status' => CapstoneTaskStatus::Todo, 'priority' => CapstoneTaskPriority::High],
                    ['title' => 'Create wireframes', 'status' => CapstoneTaskStatus::Todo, 'priority' => CapstoneTaskPriority::Medium],
                    ['title' => 'Design database schema', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                ],
            ],
            [
                'title' => 'MVP implementation',
                'description' => 'Core features working locally with tests and seed data.',
                'tasks' => [
                    ['title' => 'Scaffold auth & roles', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                    ['title' => 'Implement primary user flow', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                    ['title' => 'Write feature tests', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                ],
            ],
            [
                'title' => 'Polish & deployment',
                'description' => 'UI polish, README, deployment, and demo video.',
                'tasks' => [
                    ['title' => 'Responsive UI pass', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ['title' => 'Deploy to staging', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                    ['title' => 'Record demo walkthrough', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Low],
                ],
            ],
            [
                'title' => 'Final presentation',
                'description' => 'Present outcomes to mentor with retrospective and next steps.',
                'tasks' => [
                    ['title' => 'Prepare slide deck', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ['title' => 'Write retrospective journal', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Low],
                ],
            ],
        ];

        foreach ($milestones as $index => $data) {
            $milestone = CapstoneTemplateMilestone::create([
                'capstone_template_id' => $template->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'sort_order' => $index + 1,
                'requires_mentor_signoff' => true,
            ]);

            foreach ($data['tasks'] as $taskIndex => $task) {
                CapstoneTemplateTask::create([
                    'capstone_template_id' => $template->id,
                    'capstone_template_milestone_id' => $milestone->id,
                    'title' => $task['title'],
                    'description' => null,
                    'default_status' => $task['status'],
                    'priority' => $task['priority'],
                    'sort_order' => $taskIndex + 1,
                ]);
            }
        }

        CapstoneTemplate::updateOrCreate(
            ['slug' => 'internal-tool-automation'],
            [
                'name' => 'Internal Tool Automation',
                'description' => 'Build an internal dashboard that automates a manual workflow for a fictional team.',
                'objectives' => "• Integrate with a third-party API\n• Background jobs & notifications\n• Role-based admin views",
                'estimated_weeks' => 3,
                'is_active' => true,
                'sort_order' => 2,
            ],
        );
    }
}
