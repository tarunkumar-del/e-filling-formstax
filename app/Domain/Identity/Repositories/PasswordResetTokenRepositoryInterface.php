<?php

namespace App\Domain\Identity\Repositories;

use App\Models\PasswordResetToken;

interface PasswordResetTokenRepositoryInterface
{
    public function deleteByEmail(string $email): void;

    public function create(
        string $email,
        string $token,
        \DateTimeInterface $expiresAt
    ): PasswordResetToken;

    public function findValidToken(string $token): ?PasswordResetToken;

    public function delete(string $token): void;
}