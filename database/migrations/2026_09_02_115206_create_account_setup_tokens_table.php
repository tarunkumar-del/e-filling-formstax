<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_setup_tokens', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('email')->index();

            $table->string('token', 64)->unique();

            $table->timestamp('expires_at');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_setup_tokens');
    }
};