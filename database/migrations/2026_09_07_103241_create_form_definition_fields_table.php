<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_definition_fields', function (Blueprint $table) {
            $table->id();

            $table->foreignId('form_definition_id')
                ->constrained('form_definitions')
                ->cascadeOnDelete();

            $table->foreignId('field_id')
                ->constrained('fields')
                ->cascadeOnDelete();

            $table->boolean('is_required')->default(false);

            $table->unsignedInteger('sort_order')->default(0);

            /*
             * Example:
             * payer
             * recipient
             * compensation
             * state
             */
            $table->string('section', 100)->nullable();

            $table->timestamps();

            $table->unique(
                ['form_definition_id', 'field_id'],
                'form_definition_fields_unique'
            );

            $table->index(
                ['form_definition_id', 'sort_order'],
                'form_definition_fields_order_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_definition_fields');
    }
};