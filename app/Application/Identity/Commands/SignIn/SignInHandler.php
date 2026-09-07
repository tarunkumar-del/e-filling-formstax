<?php

namespace App\Application\Identity\Commands\SignIn;

use App\Application\Identity\DTOs\SignInData;
use App\Domain\Identity\Exceptions\InvalidCredentialsException;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

final class SignInHandler
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {}

    public function handle(SignInData $data): User
    {
        // 1. Find user by email
        $user = $this->userRepository->findByEmail(
            $data->email
        );

        // 2. User doesn't exist
        if ($user === null) {
            throw new InvalidCredentialsException();
        }

        // 3. Check password
        if (! Hash::check($data->password, $user->password)) {
            throw new InvalidCredentialsException();
        }

        // 4. Return authenticated user
        return $user;
    }
}