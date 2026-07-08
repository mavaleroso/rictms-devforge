<?php

namespace App\Providers;

use App\Repositories\Contracts\BadgeRepository;
use App\Repositories\Contracts\CertificateRepository;
use App\Repositories\Contracts\CapstoneProjectRepository;
use App\Repositories\Contracts\CapstoneTaskRepository;
use App\Repositories\Contracts\CapstoneTemplateRepository;
use App\Repositories\Contracts\JournalEntryRepository;
use App\Repositories\Contracts\ChallengeSubmissionRepository;
use App\Repositories\Contracts\ChallengeTestCaseRepository;
use App\Repositories\Contracts\CodingChallengeRepository;
use App\Repositories\Contracts\ContentCompletionRepository;
use App\Repositories\Contracts\EnrollmentRepository;
use App\Repositories\Contracts\GamificationProfileRepository;
use App\Repositories\Contracts\LearningMaterialRepository;
use App\Repositories\Contracts\LearningPathRepository;
use App\Repositories\Contracts\LevelProgressRepository;
use App\Repositories\Contracts\LevelRepository;
use App\Repositories\Contracts\QuizAttemptAnswerRepository;
use App\Repositories\Contracts\QuizAttemptRepository;
use App\Repositories\Contracts\QuizQuestionRepository;
use App\Repositories\Contracts\QuizRepository;
use App\Repositories\Contracts\RoleRepository;
use App\Repositories\Contracts\UserRepository;
use App\Repositories\Contracts\TutorSessionRepository;
use App\Repositories\Contracts\VideoRepository;
use App\Repositories\Contracts\XpTransactionRepository;
use App\Repositories\Eloquent\EloquentBadgeRepository;
use App\Repositories\Eloquent\EloquentCertificateRepository;
use App\Repositories\Eloquent\EloquentCapstoneProjectRepository;
use App\Repositories\Eloquent\EloquentCapstoneTaskRepository;
use App\Repositories\Eloquent\EloquentCapstoneTemplateRepository;
use App\Repositories\Eloquent\EloquentJournalEntryRepository;
use App\Repositories\Eloquent\EloquentChallengeSubmissionRepository;
use App\Repositories\Eloquent\EloquentChallengeTestCaseRepository;
use App\Repositories\Eloquent\EloquentCodingChallengeRepository;
use App\Repositories\Eloquent\EloquentContentCompletionRepository;
use App\Repositories\Eloquent\EloquentEnrollmentRepository;
use App\Repositories\Eloquent\EloquentGamificationProfileRepository;
use App\Repositories\Eloquent\EloquentLearningMaterialRepository;
use App\Repositories\Eloquent\EloquentLearningPathRepository;
use App\Repositories\Eloquent\EloquentLevelProgressRepository;
use App\Repositories\Eloquent\EloquentLevelRepository;
use App\Repositories\Eloquent\EloquentQuizAttemptAnswerRepository;
use App\Repositories\Eloquent\EloquentQuizAttemptRepository;
use App\Repositories\Eloquent\EloquentQuizQuestionRepository;
use App\Repositories\Eloquent\EloquentQuizRepository;
use App\Repositories\Eloquent\EloquentRoleRepository;
use App\Repositories\Eloquent\EloquentUserRepository;
use App\Repositories\Eloquent\EloquentTutorSessionRepository;
use App\Repositories\Eloquent\EloquentVideoRepository;
use App\Repositories\Eloquent\EloquentXpTransactionRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepository::class, EloquentUserRepository::class);
        $this->app->bind(RoleRepository::class, EloquentRoleRepository::class);
        $this->app->bind(EnrollmentRepository::class, EloquentEnrollmentRepository::class);
        $this->app->bind(LevelProgressRepository::class, EloquentLevelProgressRepository::class);
        $this->app->bind(LevelRepository::class, EloquentLevelRepository::class);
        $this->app->bind(LearningPathRepository::class, EloquentLearningPathRepository::class);
        $this->app->bind(CodingChallengeRepository::class, EloquentCodingChallengeRepository::class);
        $this->app->bind(ChallengeTestCaseRepository::class, EloquentChallengeTestCaseRepository::class);
        $this->app->bind(ChallengeSubmissionRepository::class, EloquentChallengeSubmissionRepository::class);
        $this->app->bind(ContentCompletionRepository::class, EloquentContentCompletionRepository::class);
        $this->app->bind(QuizAttemptRepository::class, EloquentQuizAttemptRepository::class);
        $this->app->bind(QuizAttemptAnswerRepository::class, EloquentQuizAttemptAnswerRepository::class);
        $this->app->bind(QuizRepository::class, EloquentQuizRepository::class);
        $this->app->bind(QuizQuestionRepository::class, EloquentQuizQuestionRepository::class);
        $this->app->bind(LearningMaterialRepository::class, EloquentLearningMaterialRepository::class);
        $this->app->bind(VideoRepository::class, EloquentVideoRepository::class);
        $this->app->bind(GamificationProfileRepository::class, EloquentGamificationProfileRepository::class);
        $this->app->bind(XpTransactionRepository::class, EloquentXpTransactionRepository::class);
        $this->app->bind(BadgeRepository::class, EloquentBadgeRepository::class);
        $this->app->bind(CertificateRepository::class, EloquentCertificateRepository::class);
        $this->app->bind(CapstoneTemplateRepository::class, EloquentCapstoneTemplateRepository::class);
        $this->app->bind(CapstoneProjectRepository::class, EloquentCapstoneProjectRepository::class);
        $this->app->bind(CapstoneTaskRepository::class, EloquentCapstoneTaskRepository::class);
        $this->app->bind(JournalEntryRepository::class, EloquentJournalEntryRepository::class);
        $this->app->bind(TutorSessionRepository::class, EloquentTutorSessionRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
