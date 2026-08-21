<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kazalar', function (Blueprint $table) {
            if (!Schema::hasColumn('kazalar', 'dosya_durumu')) {
                $table->string('dosya_durumu', 50)->default('dosya_acildi'); // 'dosya_acildi', 'eksper_incelemesinde', 'onarimda', 'tramer_onaylandi', 'kapandi'
            }
            if (!Schema::hasColumn('kazalar', 'eksper_adi')) {
                $table->string('eksper_adi', 150)->nullable();
            }
            if (!Schema::hasColumn('kazalar', 'eksper_tel')) {
                $table->string('eksper_tel', 30)->nullable();
            }
            if (!Schema::hasColumn('kazalar', 'rucu_durumu')) {
                $table->string('rucu_durumu', 100)->nullable();
            }
            if (!Schema::hasColumn('kazalar', 'tazminat_tutari')) {
                $table->decimal('tazminat_tutari', 12, 2)->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kazalar', function (Blueprint $table) {
            $table->dropColumn(['dosya_durumu', 'eksper_adi', 'eksper_tel', 'rucu_durumu', 'tazminat_tutari']);
        });
    }
};
