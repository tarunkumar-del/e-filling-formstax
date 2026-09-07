<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fields', function (Blueprint $table) {
            $table->id();

            /*
             * Stable internal identifier.
             * Example:
             * recipient_tin
             * recipient_first_name
             * nonemployee_compensation
             */
            $table->string('field_key', 150)->unique();

            $table->string('label', 255);

            /*
             * text
             * number
             * checkbox
             * select
             * textarea
             * etc.
             */
            $table->string('input_type', 50)->default('text');

            /*
             * manual
             * company
             * contractor
             * country
             * region
             * city
             */
            $table->string('source_type', 50)->default('manual');

            /*
             * Validation configuration.
             *
             * Example:
             * {
             *   "required": true,
             *   "maxLength": 40
             * }
             */
            $table->json('validation_rules')->nullable();

            /*
             * Select options if the field has
             * static options.
             */
            $table->json('options')->nullable();

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fields');
    }
};