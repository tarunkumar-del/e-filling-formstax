<?php

namespace App\Application\Identity\DTOs;

final readonly class RegisterUserData
{
    public function __construct(
        public string $email,
    ) {}
}