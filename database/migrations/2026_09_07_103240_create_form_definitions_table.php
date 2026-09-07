<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_definitions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('form_type_id')
                ->constrained('form_types')
                ->cascadeOnDelete();

            $table->unsignedSmallInteger('tax_year');

            $table->string('name', 150);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(
                ['form_type_id', 'tax_year'],
                'form_definitions_type_year_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_definitions');
    }
};