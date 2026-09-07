<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forms', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('company_id')
                ->constrained('companies')
                ->restrictOnDelete();

            $table->foreignId('contractor_id')
                ->nullable()
                ->constrained('contractors')
                ->restrictOnDelete();

            $table->foreignId('form_definition_id')
                ->constrained('form_definitions')
                ->restrictOnDelete();

            /*
             * draft
             * completed
             * filed
             * etc.
             */
            $table->string('status', 50)->default('draft');

            $table->timestamps();

            $table->softDeletes();

            $table->index(
                ['user_id', 'form_definition_id'],
                'forms_user_definition_index'
            );

            $table->index(
                ['company_id', 'form_definition_id'],
                'forms_company_definition_index'
            );

            $table->index('contractor_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forms');
    }
};