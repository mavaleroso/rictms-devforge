<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_material_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_material_id')->constrained()->cascadeOnDelete();
            $table->string('file_path');
            $table->string('original_name');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        DB::table('learning_materials')
            ->whereNotNull('file_path')
            ->orderBy('id')
            ->each(function (object $material): void {
                DB::table('learning_material_files')->insert([
                    'learning_material_id' => $material->id,
                    'file_path' => $material->file_path,
                    'original_name' => basename($material->file_path),
                    'sort_order' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

        Schema::table('learning_materials', function (Blueprint $table) {
            $table->dropColumn('file_path');
        });
    }

    public function down(): void
    {
        Schema::table('learning_materials', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('content');
        });

        $files = DB::table('learning_material_files')
            ->orderBy('learning_material_id')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('learning_material_id');

        foreach ($files as $materialId => $materialFiles) {
            $first = $materialFiles->first();

            if ($first) {
                DB::table('learning_materials')
                    ->where('id', $materialId)
                    ->update(['file_path' => $first->file_path]);
            }
        }

        Schema::dropIfExists('learning_material_files');
    }
};
