<?php

namespace App\Application\Identity\DTOs;

final readonly class ForgotPasswordData
{
    public function __construct(
        public string $email,
    ) {}
}