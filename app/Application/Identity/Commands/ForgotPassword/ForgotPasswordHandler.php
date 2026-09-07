<?php

namespace App\Application\Identity\Commands\ForgotPassword;

use App\Application\Identity\DTOs\ForgotPasswordData;
use App\Domain\Identity\Repositories\PasswordResetTokenRepositoryInterface;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final class ForgotPasswordHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private PasswordResetTokenRepositoryInterface $tokenRepository,
    ) {}

    public function handle(ForgotPasswordData $data): void
    {
        $user = $this->userRepository->findByEmail($data->email);

        /*
         * Do not reveal whether the email exists.
         */
        if ($user === null) {
            return;
        }

        $plainToken = Str::random(64);

        $this->tokenRepository->deleteByEmail($data->email);

        $this->tokenRepository->create(
            email: $data->email,
            token: hash('sha256', $plainToken),
            expiresAt: now()->addHours(1),
        );

        $resetUrl = url("/reset-password/{$plainToken}");

        Mail::raw(
            "Click this link to reset your password:\n\n{$resetUrl}",
            function ($message) use ($data) {
                $message
                    ->to($data->email)
                    ->subject('Reset your password');
            }
        );
    }
}