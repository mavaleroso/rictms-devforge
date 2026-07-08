<?php

namespace App\Notifications;

use App\Models\Certificate;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CertificateIssuedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Certificate $certificate,
    ) {}

    /** @return list<string> */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $pathName = $this->certificate->metadata['path_name']
            ?? $this->certificate->learningPath?->name
            ?? 'your learning path';

        return (new MailMessage)
            ->subject('Your DevForge certificate is ready')
            ->greeting('Congratulations, '.$notifiable->name.'!')
            ->line('You have completed **'.$pathName.'** and earned your certificate.')
            ->line('Certificate number: **'.$this->certificate->certificate_number.'**')
            ->action('View certificate', route('learn.certificates.show', $this->certificate))
            ->line('Share your verification link with employers to confirm authenticity.');
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'certificate_issued',
            'certificate_id' => $this->certificate->id,
            'certificate_number' => $this->certificate->certificate_number,
            'path_name' => $this->certificate->metadata['path_name'] ?? $this->certificate->learningPath?->name,
            'issued_at' => $this->certificate->issued_at?->toIso8601String(),
        ];
    }
}
