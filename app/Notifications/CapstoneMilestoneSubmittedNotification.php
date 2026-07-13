<?php

namespace App\Notifications;

use App\Models\CapstoneProjectMilestone;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CapstoneMilestoneSubmittedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly CapstoneProjectMilestone $milestone,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $intern = $this->milestone->project?->enrollment?->user?->name ?? 'An intern';

        return (new MailMessage)
            ->subject('Capstone milestone ready for review')
            ->greeting('Hello '.$notifiable->name.',')
            ->line($intern.' submitted **'.$this->milestone->title.'** for mentor sign-off.')
            ->action('Review milestone', route('mentor.capstone-reviews.show', $this->milestone))
            ->line('Approve to unlock the next milestone, or request revisions with feedback.');
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'capstone_milestone_submitted',
            'milestone_id' => $this->milestone->id,
            'milestone_title' => $this->milestone->title,
            'project_title' => $this->milestone->project?->title,
            'intern_name' => $this->milestone->project?->enrollment?->user?->name,
        ];
    }
}
