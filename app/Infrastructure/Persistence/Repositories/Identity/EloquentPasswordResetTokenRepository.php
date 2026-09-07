<?php

namespace App\Infrastructure\Persistence\Repositories\Identity;

use App\Domain\Identity\Repositories\PasswordResetTokenRepositoryInterface;
use App\Models\PasswordResetToken;
use DateTimeInterface;

final class EloquentPasswordResetTokenRepository
    implements PasswordResetTokenRepositoryInterface
{
    public function deleteByEmail(string $email): void
    {
        PasswordResetToken::query()
            ->where('email', $email)
            ->delete();
    }

    public function create(
        string $email,
        string $token,
        DateTimeInterface $expiresAt
    ): PasswordResetToken {
        return PasswordResetToken::create([
            'email' => $email,
            'token' => $token,
            'expires_at' => $expiresAt,
        ]);
    }

    public function findValidToken(string $token): ?PasswordResetToken
    {
        $hashedToken = hash('sha256', $token);

        return PasswordResetToken::query()
            ->where('token', $hashedToken)
            ->where('expires_at', '>', now())
            ->first();
    }

    public function delete(string $token): void
    {
        $hashedToken = hash('sha256', $token);

        PasswordResetToken::query()
            ->where('token', $hashedToken)
            ->delete();
    }
}