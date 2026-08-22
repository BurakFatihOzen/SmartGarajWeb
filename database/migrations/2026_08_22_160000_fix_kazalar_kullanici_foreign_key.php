<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop old foreign key constraint pointing to users table if exists
        try {
            DB::statement('ALTER TABLE kazalar DROP CONSTRAINT IF EXISTS kazalar_kullanici_id_foreign;');
        } catch (\Throwable $e) {
            // Ignore if already dropped
        }

        // Add correct foreign key constraint pointing to kullanicilar table
        Schema::table('kazalar', function (Blueprint $table) {
            $table->foreign('kullanici_id')->references('id')->on('kullanicilar')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            DB::statement('ALTER TABLE kazalar DROP CONSTRAINT IF EXISTS kazalar_kullanici_id_foreign;');
        } catch (\Throwable $e) {
            // Ignore
        }

        Schema::table('kazalar', function (Blueprint $table) {
            $table->foreign('kullanici_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
