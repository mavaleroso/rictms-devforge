<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->string('workspace_mode')->default('single_file')->after('environment');
            $table->string('template_key')->nullable()->after('workspace_mode');
            $table->json('target_files')->nullable()->after('template_key');
        });

        Schema::table('challenge_test_cases', function (Blueprint $table) {
            $table->string('assertion_type')->default('function_output')->after('label');
            $table->string('target_path')->nullable()->after('assertion_type');
        });

        Schema::table('challenge_submissions', function (Blueprint $table) {
            $table->json('files')->nullable()->after('code');
        });
    }

    public function down(): void
    {
        Schema::table('challenge_submissions', function (Blueprint $table) {
            $table->dropColumn('files');
        });

        Schema::table('challenge_test_cases', function (Blueprint $table) {
            $table->dropColumn(['assertion_type', 'target_path']);
        });

        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->dropColumn(['workspace_mode', 'template_key', 'target_files']);
        });
    }
};
