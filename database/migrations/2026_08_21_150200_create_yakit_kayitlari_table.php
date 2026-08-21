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
        if (!Schema::hasTable('yakit_kayitlari')) {
            Schema::create('yakit_kayitlari', function (Blueprint $table) {
                $table->id();
                $table->foreignId('arac_id')->constrained('araclar')->onDelete('cascade');
                $table->foreignId('kullanici_id')->constrained('kullanicilar')->onDelete('cascade');
                $table->foreignId('surucu_id')->nullable()->constrained('suruculer')->nullOnDelete();
                $table->date('tarih');
                $table->integer('km')->default(0);
                $table->decimal('litre', 10, 2)->default(0);
                $table->decimal('birim_fiyat', 10, 2)->default(0);
                $table->decimal('toplam_tutar', 12, 2)->default(0);
                $table->string('yakit_turu', 50)->default('Benzin');
                $table->string('istasyon', 150)->nullable();
                $table->boolean('tam_depo_mu')->default(true);
                $table->string('fis_url')->nullable();
                $table->text('notlar')->nullable();
                $table->timestamp('kayit_tarihi')->useCurrent();
                $table->timestamp('guncelleme_tarihi')->useCurrent();
            });
        } else {
            Schema::table('yakit_kayitlari', function (Blueprint $table) {
                if (!Schema::hasColumn('yakit_kayitlari', 'surucu_id')) {
                    $table->foreignId('surucu_id')->nullable()->constrained('suruculer')->nullOnDelete();
                }
                if (!Schema::hasColumn('yakit_kayitlari', 'birim_fiyat')) {
                    $table->decimal('birim_fiyat', 10, 2)->default(0);
                }
                if (!Schema::hasColumn('yakit_kayitlari', 'tam_depo_mu')) {
                    $table->boolean('tam_depo_mu')->default(true);
                }
                if (!Schema::hasColumn('yakit_kayitlari', 'fis_url')) {
                    $table->string('fis_url')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('yakit_kayitlari');
    }
};
