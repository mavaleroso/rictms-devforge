<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->nullable()->after('middle_name');
            $table->string('sex', 24)->nullable()->after('bio');
            $table->date('birthdate')->nullable()->after('sex');
            $table->string('phone', 30)->nullable()->after('birthdate');
            $table->text('address')->nullable()->after('phone');
            $table->string('occupation')->nullable()->after('address');
        });

        User::query()->each(function (User $user) {
            $parts = preg_split('/\s+/', trim($user->name), 2) ?: [];
            $user->update([
                'first_name' => $parts[0] ?? $user->name,
                'last_name' => $parts[1] ?? '',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'sex',
                'birthdate',
                'phone',
                'address',
                'occupation',
            ]);
        });
    }
};
