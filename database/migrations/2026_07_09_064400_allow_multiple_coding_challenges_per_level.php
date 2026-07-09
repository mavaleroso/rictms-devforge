<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->dropForeign(['level_id']);
        });

        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->dropUnique(['level_id']);
            $table->unsignedSmallInteger('sort_order')->default(0)->after('is_active');
            $table->foreign('level_id')->references('id')->on('levels')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->dropForeign(['level_id']);
        });

        Schema::table('coding_challenges', function (Blueprint $table) {
            $table->dropColumn('sort_order');
            $table->unique('level_id');
            $table->foreign('level_id')->references('id')->on('levels')->cascadeOnDelete();
        });
    }
};
