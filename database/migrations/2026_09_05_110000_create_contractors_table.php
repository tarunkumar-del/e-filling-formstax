<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contractors', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Company
            |--------------------------------------------------------------------------
            */
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Tax Information
            |--------------------------------------------------------------------------
            */
            $table->string('tax_id_type', 20);

            $table->string('tax_id', 50)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Recipient Information
            |--------------------------------------------------------------------------
            */
            $table->string('first_name', 100)->nullable();

            $table->string('middle_initial', 10)->nullable();

            $table->string('last_name', 100)->nullable();

            $table->string('suffix', 30)->nullable();

            $table->string('business_entity_name', 255)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Address
            |--------------------------------------------------------------------------
            */
            $table->string('address_1', 255);

            $table->string('address_2', 255)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Location
            |--------------------------------------------------------------------------
            */
            $table->foreignId('country_id')
                ->constrained('countries')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('region_id')
                ->nullable()
                ->constrained('country_regions')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('city_id')
                ->nullable()
                ->constrained('country_cities')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('postal', 30)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Contact
            |--------------------------------------------------------------------------
            */
            $table->string('phone', 30)->nullable();

            $table->string('email', 255)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Timestamps / Soft Delete
            |--------------------------------------------------------------------------
            */
            $table->timestamps();

            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Indexes
            |--------------------------------------------------------------------------
            */
            $table->index('company_id');
            $table->index('country_id');
            $table->index('region_id');
            $table->index('city_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contractors');
    }
};