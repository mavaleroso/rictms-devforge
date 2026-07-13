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
        $portfolio = CapstoneTemplate::updateOrCreate(
            ['slug' => 'full-stack-portfolio'],
            [
                'name' => 'Full-Stack Portfolio App',
                'description' => 'Design, build, and deploy a production-ready web application that demonstrates your Laravel and React skills.',
                'objectives' => "• Authenticated user flows\n• RESTful API or Inertia-driven UI\n• Database design with migrations\n• Deployed demo with documentation",
                'estimated_weeks' => 4,
                'is_active' => true,
                'requires_kickoff' => true,
                'allow_parallel_milestones' => false,
                'sort_order' => 1,
            ],
        );

        if (! $portfolio->milestones()->exists()) {
            $this->seedMilestones($portfolio, [
                [
                    'title' => 'Project proposal & architecture',
                    'description' => 'Submit scope, wireframes, ERD, and tech stack decisions for mentor approval.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => false,
                    'is_final_showcase' => false,
                    'tasks' => [
                        ['title' => 'Draft problem statement', 'status' => CapstoneTaskStatus::Todo, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Create wireframes', 'status' => CapstoneTaskStatus::Todo, 'priority' => CapstoneTaskPriority::Medium],
                        ['title' => 'Design database schema', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ],
                ],
                [
                    'title' => 'MVP implementation',
                    'description' => 'Core features working locally with tests and seed data.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => false,
                    'is_final_showcase' => false,
                    'tasks' => [
                        ['title' => 'Scaffold auth & roles', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Implement primary user flow', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Write feature tests', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ],
                ],
                [
                    'title' => 'Polish & deployment',
                    'description' => 'UI polish, README, deployment, and demo video.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => false,
                    'is_final_showcase' => false,
                    'tasks' => [
                        ['title' => 'Responsive UI pass', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                        ['title' => 'Deploy to staging', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Record demo walkthrough', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Low],
                    ],
                ],
                [
                    'title' => 'Final presentation',
                    'description' => 'Present outcomes to mentor with retrospective, live demo, and next steps.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => false,
                    'is_final_showcase' => true,
                    'tasks' => [
                        ['title' => 'Prepare slide deck', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                        ['title' => 'Write retrospective journal', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Low],
                    ],
                ],
            ]);
        }

        $automation = CapstoneTemplate::updateOrCreate(
            ['slug' => 'internal-tool-automation'],
            [
                'name' => 'Internal Tool Automation',
                'description' => 'Build an internal dashboard that automates a manual workflow for a fictional team.',
                'objectives' => "• Integrate with a third-party API\n• Background jobs & notifications\n• Role-based admin views",
                'estimated_weeks' => 3,
                'is_active' => true,
                'requires_kickoff' => true,
                'allow_parallel_milestones' => true,
                'sort_order' => 2,
            ],
        );

        if (! $automation->milestones()->exists()) {
            $this->seedMilestones($automation, [
                [
                    'title' => 'Workflow discovery & API plan',
                    'description' => 'Map the manual process, pick an integration target, and define success metrics.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => false,
                    'is_final_showcase' => false,
                    'tasks' => [
                        ['title' => 'Interview fictional stakeholders', 'status' => CapstoneTaskStatus::Todo, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Document current vs target workflow', 'status' => CapstoneTaskStatus::Todo, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Choose API and auth strategy', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ],
                ],
                [
                    'title' => 'Automation core',
                    'description' => 'Implement jobs, queues, and the primary automation path with logging.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => true,
                    'is_final_showcase' => false,
                    'tasks' => [
                        ['title' => 'Build job pipeline', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Persist run history', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                        ['title' => 'Add failure retries & alerts', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ],
                ],
                [
                    'title' => 'Admin dashboard & roles',
                    'description' => 'Ship role-based views for operators and admins to monitor automation.',
                    'requires_mentor_signoff' => false,
                    'allows_parallel' => true,
                    'is_final_showcase' => false,
                    'tasks' => [
                        ['title' => 'Build operator dashboard', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                        ['title' => 'Wire role permissions', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                    ],
                ],
                [
                    'title' => 'Demo & handoff',
                    'description' => 'Record a demo, write runbook, and present ROI of the automation.',
                    'requires_mentor_signoff' => true,
                    'allows_parallel' => false,
                    'is_final_showcase' => true,
                    'tasks' => [
                        ['title' => 'Write operator runbook', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::Medium],
                        ['title' => 'Record automation demo', 'status' => CapstoneTaskStatus::Backlog, 'priority' => CapstoneTaskPriority::High],
                    ],
                ],
            ]);
        }
    }

    /**
     * @param  list<array{title: string, description: string, requires_mentor_signoff: bool, allows_parallel: bool, is_final_showcase: bool, tasks: list<array{title: string, status: CapstoneTaskStatus, priority: CapstoneTaskPriority}>}>  $milestones
     */
    private function seedMilestones(CapstoneTemplate $template, array $milestones): void
    {
        foreach ($milestones as $index => $data) {
            $milestone = CapstoneTemplateMilestone::create([
                'capstone_template_id' => $template->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'sort_order' => $index + 1,
                'requires_mentor_signoff' => $data['requires_mentor_signoff'],
                'allows_parallel' => $data['allows_parallel'],
                'is_final_showcase' => $data['is_final_showcase'],
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
    }
}
