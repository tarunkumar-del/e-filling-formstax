<?php

namespace App\Application\Identity\Commands\ResetPassword;

use App\Application\Identity\DTOs\ResetPasswordData;
use App\Domain\Identity\Exceptions\InvalidPasswordResetTokenException;
use App\Domain\Identity\Repositories\PasswordResetTokenRepositoryInterface;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;

final class ResetPasswordHandler
{
    public function __construct(
        private PasswordResetTokenRepositoryInterface $tokenRepository,
        private UserRepositoryInterface $userRepository,
    ) {}

    public function handle(ResetPasswordData $data): void
    {
        DB::transaction(function () use ($data) {
            $resetToken = $this->tokenRepository->findValidToken(
                $data->token
            );

            if ($resetToken === null) {
                throw new InvalidPasswordResetTokenException();
            }

            $user = $this->userRepository->findByEmail(
                $resetToken->email
            );

            if ($user === null) {
                throw new InvalidPasswordResetTokenException();
            }

            $this->userRepository->updatePassword(
                $user,
                $data->password
            );

            $this->tokenRepository->delete(
                $data->token
            );
        });
    }
}