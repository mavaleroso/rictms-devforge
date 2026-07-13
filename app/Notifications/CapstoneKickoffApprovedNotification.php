<?php

namespace App\Notifications;

use App\Models\CapstoneProject;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CapstoneKickoffApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly CapstoneProject $project,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Capstone kickoff approved')
            ->greeting('Hello '.$notifiable->name.',')
            ->line('Your mentor approved kickoff for **'.$this->project->title.'**.')
            ->line('You can now work milestones, log journals, and submit deliverables.')
            ->action('Open capstone', route('learn.capstone.show'));
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'capstone_kickoff_approved',
            'project_id' => $this->project->id,
            'project_title' => $this->project->title,
        ];
    }
}
