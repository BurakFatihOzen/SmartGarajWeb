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
        Schema::create('trafik_cezalari', function (Blueprint $table) {
            $table->id();
            $table->foreignId('arac_id')->constrained('araclar')->onDelete('cascade');
            $table->foreignId('kullanici_id')->constrained('kullanicilar')->onDelete('cascade');
            $table->foreignId('surucu_id')->nullable()->constrained('suruculer')->nullOnDelete();
            $table->date('ceza_tarihi');
            $table->string('ceza_maddesi', 150)->nullable();
            $table->decimal('tutar', 12, 2)->default(0);
            $table->decimal('indirimli_tutar', 12, 2)->nullable();
            $table->date('son_odeme_tarihi')->nullable();
            $table->string('durum', 20)->default('odenmedi'); // 'odendi', 'odenmedi', 'itiraz_edildi'
            $table->date('odeme_tarihi')->nullable();
            $table->string('tutanak_url')->nullable();
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
        Schema::dropIfExists('trafik_cezalari');
    }
};
