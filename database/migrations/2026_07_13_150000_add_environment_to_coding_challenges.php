<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->string('environment')
                ->default('laravel_inertia_react')
                ->after('language');
        });

        DB::table('coding_challenges')
            ->whereNull('environment')
            ->orWhere('environment', '')
            ->update(['environment' => 'laravel_inertia_react']);
    }

    public function down(): void
    {
        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->dropColumn('environment');
        });
    }
};
