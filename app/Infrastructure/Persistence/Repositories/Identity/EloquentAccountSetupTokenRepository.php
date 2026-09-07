<?php

namespace App\Infrastructure\Persistence\Repositories\Identity;

use App\Domain\Identity\Repositories\AccountSetupTokenRepositoryInterface;
use App\Models\AccountSetupToken;
use DateTimeInterface;

final class EloquentAccountSetupTokenRepository
    implements AccountSetupTokenRepositoryInterface
{
    public function deleteByEmail(string $email): void
    {
        AccountSetupToken::query()
            ->where('email', $email)
            ->delete();
    }

    public function create(
        string $email,
        string $token,
        DateTimeInterface $expiresAt
    ): AccountSetupToken {
        return AccountSetupToken::create([
            'email' => $email,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);
    }

    public function findValidToken(string $token): ?AccountSetupToken
    {
        $hashedToken = hash('sha256', $token);
       
        return AccountSetupToken::query()
            ->where('token', $hashedToken)
            ->where('expires_at', '>', now())
            ->first();
    }

    public function delete(string $token): void
    {
        $hashedToken = hash('sha256', $token);

        AccountSetupToken::query()
            ->where('token', $hashedToken)
            ->delete();
    }
}