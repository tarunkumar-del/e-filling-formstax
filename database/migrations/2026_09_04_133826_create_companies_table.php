<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            // Owner / creator of the company
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Tax information
            $table->string('tax_id_type', 20);
            $table->string('tax_id');

            // Payer information
            $table->string('payer_first_name');
            $table->string('payer_last_name');
            $table->string('business_entity_name');

            // Address
            $table->string('address_1');
            $table->string('address_2')->nullable();
            $table->string('country');
            $table->string('city');
            $table->string('state');
            $table->string('zip_code');

            // Contact
            $table->string('phone');
            $table->string('email');
            $table->string('payer_contact_name');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};