<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('github_id')->nullable()->after('email');
            $table->string('github_username')->nullable()->after('github_id');
            $table->text('github_token')->nullable()->after('github_username');
        });

        Schema::table('challenge_submissions', function (Blueprint $table) {
            $table->string('submission_source')->default('editor')->after('language');
            $table->string('evaluation_driver')->nullable()->after('submission_source');
            $table->string('github_owner')->nullable()->after('evaluation_driver');
            $table->string('github_repo')->nullable()->after('github_owner');
            $table->string('github_ref')->nullable()->after('github_repo');
            $table->string('github_path')->nullable()->after('github_ref');
            $table->string('github_commit_sha', 64)->nullable()->after('github_path');
        });

        Schema::create('tutor_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('context_type');
            $table->unsignedBigInteger('context_id')->nullable();
            $table->foreignId('level_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->timestamps();

            $table->index(['user_id', 'updated_at']);
        });

        Schema::create('tutor_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_session_id')->constrained()->cascadeOnDelete();
            $table->string('role');
            $table->longText('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tutor_messages');
        Schema::dropIfExists('tutor_sessions');

        Schema::table('challenge_submissions', function (Blueprint $table) {
            $table->dropColumn([
                'submission_source',
                'evaluation_driver',
                'github_owner',
                'github_repo',
                'github_ref',
                'github_path',
                'github_commit_sha',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['github_id', 'github_username', 'github_token']);
        });
    }
};
