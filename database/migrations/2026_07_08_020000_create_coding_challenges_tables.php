<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coding_challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('level_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->nullable();
            $table->longText('description');
            $table->text('constraints')->nullable();
            $table->json('examples')->nullable();
            $table->string('language')->default('php');
            $table->string('entry_point');
            $table->longText('starter_code');
            $table->longText('solution_code')->nullable();
            $table->unsignedSmallInteger('time_limit_ms')->default(2000);
            $table->unsignedSmallInteger('memory_limit_mb')->default(128);
            $table->unsignedTinyInteger('max_attempts')->default(5);
            $table->boolean('requires_mentor_review')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique('level_id');
        });

        Schema::create('challenge_test_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('coding_challenge_id')->constrained()->cascadeOnDelete();
            $table->string('label')->nullable();
            $table->json('input');
            $table->text('expected_output');
            $table->text('explanation')->nullable();
            $table->boolean('is_sample')->default(false);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('challenge_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('coding_challenge_id')->constrained()->cascadeOnDelete();
            $table->longText('code');
            $table->string('language');
            $table->string('status')->default('pending');
            $table->unsignedTinyInteger('attempt_number')->default(1);
            $table->unsignedSmallInteger('tests_passed')->default(0);
            $table->unsignedSmallInteger('tests_total')->default(0);
            $table->unsignedInteger('runtime_ms')->nullable();
            $table->unsignedInteger('memory_kb')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('mentor_feedback')->nullable();
            $table->unsignedTinyInteger('mentor_score')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['coding_challenge_id', 'user_id']);
            $table->index(['status', 'created_at']);
        });

        Schema::create('challenge_submission_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_submission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('challenge_test_case_id')->constrained()->cascadeOnDelete();
            $table->boolean('passed')->default(false);
            $table->text('actual_output')->nullable();
            $table->text('error_message')->nullable();
            $table->unsignedInteger('runtime_ms')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_submission_results');
        Schema::dropIfExists('challenge_submissions');
        Schema::dropIfExists('challenge_test_cases');
        Schema::dropIfExists('coding_challenges');
    }
};
