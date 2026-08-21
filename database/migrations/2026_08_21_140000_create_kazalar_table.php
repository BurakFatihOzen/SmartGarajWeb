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
        Schema::create('kazalar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('arac_id')->constrained('araclar')->onDelete('cascade');
            $table->foreignId('kullanici_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->date('kaza_tarihi');
            $table->integer('kaza_km')->nullable();
            $table->string('kaza_turu')->default('Çarpışma'); // Çarpışma, Park Halinde Hasar, Arkadan Çarpma, Dolu / Doğal Afet, Cam Kırılması, Tek Taraflı Kaza, Diğer
            $table->decimal('hasar_tutari', 12, 2)->default(0);
            $table->boolean('tramer_kaydi')->default(false);
            $table->decimal('tramer_tutari', 12, 2)->nullable();
            $table->integer('kusur_orani')->default(0); // 0, 25, 50, 75, 100
            $table->string('sigorta_sirketi')->nullable();
            $table->string('dosya_no')->nullable();
            $table->string('karsi_taraf_plaka')->nullable();
            $table->string('surucu_adi')->nullable();
            $table->text('aciklama')->nullable();
            $table->json('hasarli_parcalar')->nullable(); // [{"parca": "Kaput", "durum": "Boyalı"}, {"parca": "Ön Tampon", "durum": "Değişen"}]
            $table->json('fotograflar')->nullable(); // Görsel URL dizisi
            $table->string('tutanak_url')->nullable();
            $table->timestamp('kayit_tarihi')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kazalar');
    }
};
