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
        Schema::create('arac_belgeleri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('arac_id')->constrained('araclar')->onDelete('cascade');
            $table->foreignId('kullanici_id')->constrained('kullanicilar')->onDelete('cascade');
            $table->string('belge_turu', 50); // 'ruhsat', 'kasko', 'sigorta', 'sozlesme', 'muayene', 'garanti', 'diger'
            $table->string('belge_adi', 150);
            $table->string('dosya_url');
            $table->date('gecerlilik_tarihi')->nullable();
            $table->text('aciklama')->nullable();
            $table->timestamp('kayit_tarihi')->useCurrent();
            $table->timestamp('guncelleme_tarihi')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arac_belgeleri');
    }
};
