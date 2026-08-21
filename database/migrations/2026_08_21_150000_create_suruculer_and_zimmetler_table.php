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
        Schema::create('suruculer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kullanici_id')->constrained('kullanicilar')->onDelete('cascade');
            $table->string('ad_soyad');
            $table->string('tc_no', 11)->nullable();
            $table->string('telefon', 30)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('ehliyet_sinifi', 30)->default('B');
            $table->date('ehliyet_verilis_tarihi')->nullable();
            $table->date('ehliyet_gecerlilik_tarihi')->nullable();
            $table->string('departman', 100)->nullable();
            $table->string('gorev_unvani', 100)->nullable();
            $table->string('durum', 20)->default('aktif'); // 'aktif', 'pasif'
            $table->text('notlar')->nullable();
            $table->timestamp('kayit_tarihi')->useCurrent();
            $table->timestamp('guncelleme_tarihi')->useCurrent();
        });

        Schema::create('arac_zimmetleri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('arac_id')->constrained('araclar')->onDelete('cascade');
            $table->foreignId('surucu_id')->constrained('suruculer')->onDelete('cascade');
            $table->foreignId('kullanici_id')->constrained('kullanicilar')->onDelete('cascade');
            $table->dateTime('teslim_tarihi');
            $table->dateTime('iade_tarihi')->nullable();
            $table->integer('baslangic_km')->default(0);
            $table->integer('bitis_km')->nullable();
            $table->string('yakit_seviyesi', 30)->nullable(); // '%100', '%75', '%50', '%25', 'Çeyrek Altı'
            $table->string('tutanak_no', 50)->nullable();
            $table->string('durum', 20)->default('aktif'); // 'aktif', 'tamamlandi'
            $table->text('teslim_notu')->nullable();
            $table->text('iade_notu')->nullable();
            $table->timestamp('kayit_tarihi')->useCurrent();
            $table->timestamp('guncelleme_tarihi')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arac_zimmetleri');
        Schema::dropIfExists('suruculer');
    }
};
