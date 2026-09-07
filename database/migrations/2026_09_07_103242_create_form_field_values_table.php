<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_field_values', function (Blueprint $table) {
            $table->id();

            $table->foreignId('form_id')
                ->constrained('forms')
                ->cascadeOnDelete();

            $table->foreignId('field_id')
                ->constrained('fields')
                ->restrictOnDelete();

            /*
             * All manually entered dynamic values
             * are stored here.
             *
             * Examples:
             *
             * "12500.00"
             * "John"
             * "true"
             * "12345"
             */
            $table->longText('value')->nullable();

            $table->timestamps();

            $table->unique(
                ['form_id', 'field_id'],
                'form_field_values_unique'
            );

            $table->index('field_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_field_values');
    }
};