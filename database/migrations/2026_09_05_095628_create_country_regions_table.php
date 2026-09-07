<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('country_regions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('country_id')
                ->constrained('countries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('name', 150);

            $table->string('code', 30)->nullable();

            $table->string('type', 100)->nullable();

            $table->timestamps();

            $table->unique(
                ['country_id', 'name'],
                'country_regions_country_name_unique'
            );

            $table->index('country_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('country_regions');
    }
};