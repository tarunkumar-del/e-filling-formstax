<?php

namespace App\Application\Identity\Commands\RegisterUser;

use App\Application\Identity\DTOs\RegisterUserData;
use App\Domain\Identity\Repositories\AccountSetupTokenRepositoryInterface;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

final class RegisterUserHandler
{
    public function __construct(
        private AccountSetupTokenRepositoryInterface $tokens,
    ) {}

    public function handle(RegisterUserData $data): void
    {
        $plainToken = Str::random(64);

        $this->tokens->deleteByEmail($data->email);
        
        $this->tokens->create(
            email: $data->email,
            token: hash('sha256', $plainToken),
            expiresAt: now()->addHours(24),
        );

        $setupUrl = url("/set-password/{$plainToken}");

        Mail::raw(
            "Click this link to create your password:\n\n{$setupUrl}",
            function ($message) use ($data) {
                $message
                    ->to($data->email)
                    ->subject('Set up your account');
            }
        );
    }
}