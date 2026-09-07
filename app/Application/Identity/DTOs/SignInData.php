<?php

namespace App\Application\Identity\DTOs;

final readonly class SignInData
{
    public function __construct(
        public string $email,
        public string $password,
        public ?string $redirect = null,
    ) {}
}