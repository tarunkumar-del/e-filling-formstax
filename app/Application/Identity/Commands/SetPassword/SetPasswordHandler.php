<?php

namespace App\Application\Identity\Commands\SetPassword;

use App\Application\Identity\DTOs\SetPasswordData;
use App\Domain\Identity\Exceptions\InvalidAccountSetupTokenException;
use App\Domain\Identity\Repositories\AccountSetupTokenRepositoryInterface;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;

final class SetPasswordHandler
{
    public function __construct(
        private AccountSetupTokenRepositoryInterface $tokenRepository,
        private UserRepositoryInterface $userRepository,
    ) {}

    public function handle(SetPasswordData $data): void
    {
        DB::transaction(function () use ($data): void {
            
            // 1. Find and validate the temporary setup token
            $setupToken = $this->tokenRepository->findValidToken(
                $data->token
            );

            if ($setupToken === null) {
                throw new InvalidAccountSetupTokenException();
            }

            // 2. Get the email from the temporary setup record
            $email = $setupToken->email;

            // 3. Create the permanent user account
            $user = $this->userRepository->create(
                email: $email,
                password: $data->password,  
            );
            
            // 4. Assign default role
            $user->assignRole('user');

            // 5. Delete the temporary setup token
            $this->tokenRepository->delete(
                $data->token
            );
        });
    }
}