<?php

namespace App\Application\Identity\DTOs;

final readonly class ResetPasswordData
{
    public function __construct(
        public string $token,
        public string $password,
    ) {}
}