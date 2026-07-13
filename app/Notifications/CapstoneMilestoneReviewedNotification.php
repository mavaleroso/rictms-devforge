<?php

namespace App\Notifications;

use App\Models\CapstoneProjectMilestone;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CapstoneMilestoneReviewedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly CapstoneProjectMilestone $milestone,
        public readonly bool $approved,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->approved
            ? 'Capstone milestone approved'
            : 'Capstone milestone needs revision';

        $mail = (new MailMessage)
            ->subject($subject)
            ->greeting('Hello '.$notifiable->name.',')
            ->line(
                $this->approved
                    ? 'Your mentor approved **'.$this->milestone->title.'**.'
                    : 'Your mentor requested revisions on **'.$this->milestone->title.'**.',
            );

        if ($this->milestone->mentor_feedback) {
            $mail->line('Feedback: '.$this->milestone->mentor_feedback);
        }

        return $mail
            ->action('Open capstone', route('learn.capstone.show'))
            ->line($this->approved ? 'Keep going — the next milestone may already be unlocked.' : 'Update your deliverables and resubmit when ready.');
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'capstone_milestone_reviewed',
            'milestone_id' => $this->milestone->id,
            'milestone_title' => $this->milestone->title,
            'approved' => $this->approved,
            'mentor_feedback' => $this->milestone->mentor_feedback,
            'mentor_score' => $this->milestone->mentor_score,
        ];
    }
}
