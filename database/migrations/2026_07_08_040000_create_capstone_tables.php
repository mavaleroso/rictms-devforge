<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capstone_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->unsignedSmallInteger('estimated_weeks')->default(4);
            $table->boolean('is_active')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('capstone_template_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_template_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('requires_mentor_signoff')->default(true);
            $table->timestamps();
        });

        Schema::create('capstone_template_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_template_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('capstone_template_milestone_id')->nullable();
            $table->foreign('capstone_template_milestone_id', 'cap_tpl_tasks_milestone_fk')
                ->references('id')->on('capstone_template_milestones')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('default_status')->default('todo');
            $table->string('priority')->default('medium');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('capstone_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('capstone_template_id')->constrained()->restrictOnDelete();
            $table->foreignId('level_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('capstone_project_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_project_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('capstone_template_milestone_id')->nullable();
            $table->foreign('capstone_template_milestone_id', 'cap_proj_milestones_tpl_fk')
                ->references('id')->on('capstone_template_milestones')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('pending');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('mentor_feedback')->nullable();
            $table->unsignedTinyInteger('mentor_score')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['capstone_project_id', 'status']);
        });

        Schema::create('capstone_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_project_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('capstone_project_milestone_id')->nullable();
            $table->foreign('capstone_project_milestone_id', 'cap_tasks_milestone_fk')
                ->references('id')->on('capstone_project_milestones')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('todo');
            $table->string('priority')->default('medium');
            $table->foreignId('assignee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reporter_id')->constrained('users')->cascadeOnDelete();
            $table->date('due_date')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['capstone_project_id', 'status', 'sort_order']);
        });

        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('entry_date');
            $table->longText('content');
            $table->string('mood')->nullable();
            $table->decimal('hours_spent', 4, 1)->nullable();
            $table->timestamps();

            $table->unique(['capstone_project_id', 'user_id', 'entry_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
        Schema::dropIfExists('capstone_tasks');
        Schema::dropIfExists('capstone_project_milestones');
        Schema::dropIfExists('capstone_projects');
        Schema::dropIfExists('capstone_template_tasks');
        Schema::dropIfExists('capstone_template_milestones');
        Schema::dropIfExists('capstone_templates');
    }
};
