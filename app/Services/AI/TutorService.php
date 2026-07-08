<?php

namespace App\Services\AI;

use App\Enums\TutorMessageRole;
use App\Models\CodingChallenge;
use App\Models\Level;
use App\Models\TutorMessage;
use App\Models\TutorSession;
use App\Models\User;
use App\Repositories\Contracts\TutorSessionRepository;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

final class TutorService
{
    public function __construct(
        private readonly TutorSessionRepository $sessions,
    ) {}

    public function findOrCreateSession(
        User $user,
        string $contextType,
        ?int $contextId,
        ?Level $level,
        string $title,
    ): TutorSession {
        $existing = $this->sessions->findForContext($user, $contextType, $contextId);

        if ($existing) {
            return $existing;
        }

        return $this->sessions->create([
            'user_id' => $user->id,
            'context_type' => $contextType,
            'context_id' => $contextId,
            'level_id' => $level?->id,
            'title' => $title,
        ]);
    }

    public function sendMessage(TutorSession $session, User $user, string $content): TutorMessage
    {
        $content = trim($content);

        if ($content === '') {
            throw ValidationException::withMessages([
                'message' => 'Message cannot be empty.',
            ]);
        }

        $messageCount = $session->messages()->count();

        if ($messageCount >= config('ai.max_messages_per_session', 30)) {
            throw ValidationException::withMessages([
                'message' => 'This tutor session has reached its message limit.',
            ]);
        }

        $session->messages()->create([
            'role' => TutorMessageRole::User,
            'content' => $content,
        ]);

        $reply = $this->generateReply($session, $content);

        return $session->messages()->create([
            'role' => TutorMessageRole::Assistant,
            'content' => $reply,
        ]);
    }

    private function generateReply(TutorSession $session, string $userMessage): string
    {
        $driver = config('ai.driver', 'mock');

        if ($driver === 'openai' && config('ai.api_key')) {
            return $this->openAiReply($session);
        }

        return $this->mockReply($session, $userMessage);
    }

    private function mockReply(TutorSession $session, string $userMessage): string
    {
        $context = $session->title;
        $lower = strtolower($userMessage);

        if (str_contains($lower, 'hint') || str_contains($lower, 'stuck')) {
            return "Let's break down **{$context}** step by step. What part of the problem is unclear — understanding the requirements, choosing an approach, or debugging your code? Try restating the goal in your own words first.";
        }

        if (str_contains($lower, 'error') || str_contains($lower, 'fail')) {
            return 'Read the error message from the bottom up. Check variable types, edge cases (empty input, zero, negatives), and whether your function returns the exact format the tests expect. What does your latest failing test expect vs. what you return?';
        }

        if (str_contains($lower, 'solution') || str_contains($lower, 'answer')) {
            return "I can't provide a full solution — that's part of your learning journey. Instead, tell me what you've tried and which test case fails. I'll help you reason toward the next step.";
        }

        return "Good question about **{$context}**. Focus on the problem constraints first, then sketch examples by hand before coding. What specific part would you like to explore — logic, syntax, or test strategy?";
    }

    private function openAiReply(TutorSession $session): string
    {
        $messages = [
            [
                'role' => 'system',
                'content' => 'You are DevForge AI Tutor. Give concise, Socratic hints. Never provide complete solutions or full code answers. Context: '.$session->title,
            ],
        ];

        foreach ($session->messages()->latest()->take(8)->get()->reverse() as $message) {
            $messages[] = [
                'role' => $message->role->value,
                'content' => $message->content,
            ];
        }

        try {
            $response = $this->openAiClient()
                ->post(rtrim(config('ai.base_url'), '/').'/chat/completions', [
                    'model' => config('ai.model'),
                    'messages' => $messages,
                    'max_tokens' => 400,
                    'temperature' => 0.6,
                ]);
        } catch (ConnectionException $exception) {
            Log::warning('AI tutor OpenAI connection failed', [
                'session_id' => $session->id,
                'error' => $exception->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'message' => $this->connectionErrorMessage($exception),
            ]);
        }

        if (! $response->successful()) {
            $apiMessage = $response->json('error.message');

            Log::warning('AI tutor OpenAI request failed', [
                'session_id' => $session->id,
                'status' => $response->status(),
                'error' => $apiMessage ?? $response->body(),
            ]);

            throw ValidationException::withMessages([
                'message' => $apiMessage
                    ? 'OpenAI error: '.$apiMessage
                    : 'OpenAI request failed (HTTP '.$response->status().'). Check your API key and billing.',
            ]);
        }

        $content = trim($response->json('choices.0.message.content') ?? '');

        if ($content === '') {
            throw ValidationException::withMessages([
                'message' => 'OpenAI returned an empty response. Please try again.',
            ]);
        }

        return $content;
    }

    private function openAiClient()
    {
        $client = Http::withToken(config('ai.api_key'))->timeout(30);

        $caBundle = config('ai.ca_bundle');

        if (is_string($caBundle) && $caBundle !== '' && file_exists($caBundle)) {
            return $client->withOptions(['verify' => $caBundle]);
        }

        return $client;
    }

    private function connectionErrorMessage(ConnectionException $exception): string
    {
        $message = $exception->getMessage();

        if (str_contains($message, 'error setting certificate file') || str_contains($message, 'cURL error 77')) {
            return 'SSL certificate bundle is misconfigured for outbound HTTPS. Set AI_CA_BUNDLE in .env to your Laragon cacert.pem path (e.g. C:\\laragon2\\etc\\ssl\\cacert.pem), or fix curl.cainfo in php.ini.';
        }

        return 'Could not reach OpenAI. Check your internet connection and AI_CA_BUNDLE / php.ini SSL settings.';
    }

    public function sessionPayload(TutorSession $session): array
    {
        $session->load('messages');

        return [
            'id' => $session->id,
            'title' => $session->title,
            'context_type' => $session->context_type,
            'context_id' => $session->context_id,
            'messages' => $session->messages->map(fn ($m) => [
                'id' => $m->id,
                'role' => $m->role->value,
                'content' => $m->content,
                'created_at' => $m->created_at?->toIso8601String(),
            ])->values()->all(),
        ];
    }
}
