<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('country_cities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('country_id')
                ->constrained('countries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('region_id')
                ->nullable()
                ->constrained('country_regions')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('name', 150);

            $table->string('code', 50)->nullable();

            $table->timestamps();

            $table->unique(
                ['country_id', 'region_id', 'name'],
                'country_cities_country_region_name_unique'
            );

            $table->index('country_id');
            $table->index('region_id');
            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('country_cities');
    }
};