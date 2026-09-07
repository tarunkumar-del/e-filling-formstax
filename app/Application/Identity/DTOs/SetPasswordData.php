<?php

namespace App\Application\Identity\DTOs;

final readonly class SetPasswordData
{
    public function __construct(
        public string $token,
        public string $password,
    ) {}
}