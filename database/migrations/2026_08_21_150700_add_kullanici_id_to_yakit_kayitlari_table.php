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
        Schema::table('yakit_kayitlari', function (Blueprint $table) {
            if (!Schema::hasColumn('yakit_kayitlari', 'kullanici_id')) {
                $table->foreignId('kullanici_id')->nullable()->constrained('kullanicilar')->onDelete('cascade');
            }
            if (!Schema::hasColumn('yakit_kayitlari', 'istasyon')) {
                $table->string('istasyon', 150)->nullable();
            }
            if (!Schema::hasColumn('yakit_kayitlari', 'guncelleme_tarihi')) {
                $table->timestamp('guncelleme_tarihi')->nullable()->useCurrent();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('yakit_kayitlari', function (Blueprint $table) {
            $table->dropColumn(['kullanici_id', 'istasyon']);
        });
    }
};
