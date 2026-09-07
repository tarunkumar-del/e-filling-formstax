<?php

namespace App\Application\Identity\Commands;

use App\Domain\Identity\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DeleteUserHandler
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(User $user): void
    {
        DB::transaction(function () use ($user) {
            if ($user->companies()->exists()) {
                throw new RuntimeException(
                    'This user cannot be deleted because they have associated companies.'
                );
            }

            $this->userRepository->delete($user);
        });
    }
}