<?php

namespace App\Domain\Identity\Repositories;

use App\Models\AccountSetupToken;
use DateTimeInterface;

interface AccountSetupTokenRepositoryInterface
{
    public function deleteByEmail(string $email): void;

    public function create(
        string $email,
        string $token,
        DateTimeInterface $expiresAt
    ): AccountSetupToken;


    public function findValidToken(
        string $token
    ): ?AccountSetupToken;

    public function delete(string $token): void;
}