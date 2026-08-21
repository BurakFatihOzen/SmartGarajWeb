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
        Schema::table('bakimlar', function (Blueprint $table) {
            $table->string('servis_turu')->nullable()->after('islem_turu'); // yetkili_servis, ozel_servis, sanayi, kendi_garajimiz
            $table->string('servis_adi')->nullable()->after('servis_turu');
            $table->string('sanayi_sitesi')->nullable()->after('servis_adi');
            $table->string('usta_adi')->nullable()->after('sanayi_sitesi');
            $table->string('usta_tel')->nullable()->after('usta_adi');
            
            // Yağ Bakım Alanları
            $table->string('yag_markasi')->nullable()->after('usta_tel');
            $table->string('yag_modeli')->nullable()->after('yag_markasi');
            $table->string('yag_viskozite')->nullable()->after('yag_modeli');
            $table->decimal('yag_litresi', 5, 2)->nullable()->after('yag_viskozite');
            $table->boolean('yag_filtresi_degisti')->default(false)->after('yag_litresi');
        });

        Schema::table('trafik_cezalari', function (Blueprint $table) {
            $table->string('ceza_tipi')->default('trafik_cezasi')->after('surucu_id'); // trafik_cezasi, hgs_ihlal
            $table->string('otoyol_kopru')->nullable()->after('ceza_tipi');
            $table->decimal('gecis_ucreti', 10, 2)->nullable()->after('otoyol_kopru');
            $table->integer('ihlal_kat_sayisi')->default(4)->after('gecis_ucreti');
            $table->string('hgs_etiket_no')->nullable()->after('ihlal_kat_sayisi');
            $table->string('giris_istasyonu')->nullable()->after('hgs_etiket_no');
            $table->string('cikis_istasyonu')->nullable()->after('giris_istasyonu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bakimlar', function (Blueprint $table) {
            $table->dropColumn([
                'servis_turu',
                'servis_adi',
                'sanayi_sitesi',
                'usta_adi',
                'usta_tel',
                'yag_markasi',
                'yag_modeli',
                'yag_viskozite',
                'yag_litresi',
                'yag_filtresi_degisti'
            ]);
        });

        Schema::table('trafik_cezalari', function (Blueprint $table) {
            $table->dropColumn([
                'ceza_tipi',
                'otoyol_kopru',
                'gecis_ucreti',
                'ihlal_kat_sayisi',
                'hgs_etiket_no',
                'giris_istasyonu',
                'cikis_istasyonu'
            ]);
        });
    }
};
