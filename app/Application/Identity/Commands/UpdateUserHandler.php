<?php

namespace App\Application\Identity\Commands;

use App\Application\Identity\DTOs\UserData;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateUserHandler
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(
        User $user,
        UserData $data
    ): User {
        return DB::transaction(function () use ($user, $data) {
            $user = $this->userRepository->update(
                $user,
                $data->toArray()
            );

            if ($data->role !== null) {
                $user->syncRoles([$data->role]);
            }

            return $user->load('roles');
        });
    }
}