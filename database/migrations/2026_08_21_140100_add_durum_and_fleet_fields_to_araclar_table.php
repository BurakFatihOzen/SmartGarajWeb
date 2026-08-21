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
        Schema::table('araclar', function (Blueprint $table) {
            if (!Schema::hasColumn('araclar', 'durum')) {
                $table->string('durum')->default('aktif'); // aktif, serviste, gorevde, atil, satildi
            }
            if (!Schema::hasColumn('araclar', 'zimmet_surucu_adi')) {
                $table->string('zimmet_surucu_adi')->nullable();
            }
            if (!Schema::hasColumn('araclar', 'departman')) {
                $table->string('departman')->nullable(); // Saha Satış, Lojistik, Yönetim, Teknik Servis, Havuz vb.
            }
            if (!Schema::hasColumn('araclar', 'sozlesme_turu')) {
                $table->string('sozlesme_turu')->default('oz_mal'); // oz_mal, kiralik, leasing
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('araclar', function (Blueprint $table) {
            $table->dropColumn(['durum', 'zimmet_surucu_adi', 'departman', 'sozlesme_turu']);
        });
    }
};
