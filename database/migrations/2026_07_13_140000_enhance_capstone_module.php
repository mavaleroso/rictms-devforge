<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('capstone_templates', function (Blueprint $table) {
            $table->boolean('requires_kickoff')->default(true)->after('is_active');
            $table->boolean('allow_parallel_milestones')->default(false)->after('requires_kickoff');
        });

        Schema::table('capstone_template_milestones', function (Blueprint $table) {
            $table->boolean('allows_parallel')->default(false)->after('requires_mentor_signoff');
            $table->boolean('is_final_showcase')->default(false)->after('allows_parallel');
        });

        Schema::table('capstone_projects', function (Blueprint $table) {
            $table->boolean('allow_parallel_milestones')->default(false)->after('status');
            $table->timestamp('kickoff_approved_at')->nullable()->after('started_at');
            $table->foreignId('kickoff_reviewer_id')->nullable()->after('kickoff_approved_at')->constrained('users')->nullOnDelete();
            $table->timestamp('archived_at')->nullable()->after('completed_at');
        });

        Schema::table('capstone_project_milestones', function (Blueprint $table) {
            $table->boolean('requires_mentor_signoff')->default(true)->after('sort_order');
            $table->boolean('allows_parallel')->default(false)->after('requires_mentor_signoff');
            $table->boolean('is_final_showcase')->default(false)->after('allows_parallel');
            $table->text('submission_notes')->nullable()->after('submitted_at');
            $table->string('deliverable_url')->nullable()->after('submission_notes');
            $table->string('repo_url')->nullable()->after('deliverable_url');
            $table->string('demo_url')->nullable()->after('repo_url');
            $table->text('resubmission_notes')->nullable()->after('demo_url');
        });

        Schema::create('capstone_milestone_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('capstone_project_milestone_id');
            $table->foreign('capstone_project_milestone_id', 'cap_ms_attach_milestone_fk')
                ->references('id')
                ->on('capstone_project_milestones')
                ->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name');
            $table->unsignedInteger('size_bytes')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::table('journal_entries', function (Blueprint $table) {
            $table->unsignedBigInteger('capstone_project_milestone_id')->nullable()->after('user_id');
            $table->foreign('capstone_project_milestone_id', 'journal_entries_milestone_fk')
                ->references('id')
                ->on('capstone_project_milestones')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('journal_entries', function (Blueprint $table) {
            $table->dropForeign('journal_entries_milestone_fk');
            $table->dropColumn('capstone_project_milestone_id');
        });

        Schema::dropIfExists('capstone_milestone_attachments');

        Schema::table('capstone_project_milestones', function (Blueprint $table) {
            $table->dropColumn([
                'requires_mentor_signoff',
                'allows_parallel',
                'is_final_showcase',
                'submission_notes',
                'deliverable_url',
                'repo_url',
                'demo_url',
                'resubmission_notes',
            ]);
        });

        Schema::table('capstone_projects', function (Blueprint $table) {
            $table->dropConstrainedForeignId('kickoff_reviewer_id');
            $table->dropColumn(['allow_parallel_milestones', 'kickoff_approved_at', 'archived_at']);
        });

        Schema::table('capstone_template_milestones', function (Blueprint $table) {
            $table->dropColumn(['allows_parallel', 'is_final_showcase']);
        });

        Schema::table('capstone_templates', function (Blueprint $table) {
            $table->dropColumn(['requires_kickoff', 'allow_parallel_milestones']);
        });
    }
};
