<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('capstone_milestone_attachments')) {
            $foreignKeys = collect(Schema::getForeignKeys('capstone_milestone_attachments'))
                ->pluck('name')
                ->all();

            if (! in_array('cap_ms_attach_milestone_fk', $foreignKeys, true)) {
                Schema::table('capstone_milestone_attachments', function (Blueprint $table) {
                    $table->foreign('capstone_project_milestone_id', 'cap_ms_attach_milestone_fk')
                        ->references('id')
                        ->on('capstone_project_milestones')
                        ->cascadeOnDelete();
                });
            }
        }

        if (! Schema::hasColumn('journal_entries', 'capstone_project_milestone_id')) {
            Schema::table('journal_entries', function (Blueprint $table) {
                $table->unsignedBigInteger('capstone_project_milestone_id')->nullable()->after('user_id');
                $table->foreign('capstone_project_milestone_id', 'journal_entries_milestone_fk')
                    ->references('id')
                    ->on('capstone_project_milestones')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('journal_entries', 'capstone_project_milestone_id')) {
            Schema::table('journal_entries', function (Blueprint $table) {
                $table->dropForeign('journal_entries_milestone_fk');
                $table->dropColumn('capstone_project_milestone_id');
            });
        }

        if (Schema::hasTable('capstone_milestone_attachments')) {
            $foreignKeys = collect(Schema::getForeignKeys('capstone_milestone_attachments'))
                ->pluck('name')
                ->all();

            if (in_array('cap_ms_attach_milestone_fk', $foreignKeys, true)) {
                Schema::table('capstone_milestone_attachments', function (Blueprint $table) {
                    $table->dropForeign('cap_ms_attach_milestone_fk');
                });
            }
        }
    }
};
