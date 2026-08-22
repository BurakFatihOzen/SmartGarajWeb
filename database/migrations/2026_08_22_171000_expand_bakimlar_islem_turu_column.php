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
        // Use DB::statement for PostgreSQL native ALTER COLUMN to TEXT to handle any length
        DB::statement('ALTER TABLE bakimlar ALTER COLUMN islem_turu TYPE TEXT');
        
        // Also ensure other text fields have plenty of capacity
        if (Schema::hasColumn('bakimlar', 'servis_adi')) {
            DB::statement('ALTER TABLE bakimlar ALTER COLUMN servis_adi TYPE VARCHAR(255)');
        }
        if (Schema::hasColumn('bakimlar', 'sanayi_sitesi')) {
            DB::statement('ALTER TABLE bakimlar ALTER COLUMN sanayi_sitesi TYPE VARCHAR(255)');
        }
        if (Schema::hasColumn('bakimlar', 'usta_adi')) {
            DB::statement('ALTER TABLE bakimlar ALTER COLUMN usta_adi TYPE VARCHAR(255)');
        }
        if (Schema::hasColumn('bakimlar', 'yag_markasi')) {
            DB::statement('ALTER TABLE bakimlar ALTER COLUMN yag_markasi TYPE VARCHAR(255)');
        }
        if (Schema::hasColumn('bakimlar', 'yag_modeli')) {
            DB::statement('ALTER TABLE bakimlar ALTER COLUMN yag_modeli TYPE VARCHAR(255)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE bakimlar ALTER COLUMN islem_turu TYPE VARCHAR(150)');
    }
};
