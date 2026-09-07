<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('form_definition_fields', function (Blueprint $table) {
            $table->boolean('is_enabled')
                ->default(true)
                ->after('field_id');

            $table->boolean('is_visible')
                ->default(true)
                ->after('is_required');

            $table->json('validation_rules')
                ->nullable()
                ->after('section');

            $table->json('visibility_rules')
                ->nullable()
                ->after('validation_rules');
        });
    }

    public function down(): void
    {
        Schema::table('form_definition_fields', function (Blueprint $table) {
            $table->dropColumn([
                'is_enabled',
                'is_visible',
                'validation_rules',
                'visibility_rules',
            ]);
        });
    }
};