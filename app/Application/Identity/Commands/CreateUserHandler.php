<?php

namespace App\Application\Identity\Commands;

use App\Application\Identity\DTOs\UserData;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class CreateUserHandler
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {
    }

    public function handle(UserData $data): User
    {
        $user = DB::transaction(function () use ($data) {
            $user = $this->userRepository->createUser(
                $data->toArray()
            );

            if ($data->role !== null) {
                $user->syncRoles([$data->role]);
            }

            return $user->load('roles');
        });

        /*
         * Send credentials only after the database transaction
         * has successfully committed.
         */
        Mail::raw(
            "Your account has been created.\n\n"
            . "Email: {$data->email}\n"
            . "Password: {$data->password}\n\n"
            . "Please keep these credentials secure.",
            function ($message) use ($data) {
                $message
                    ->to($data->email)
                    ->subject('Your Account Has Been Created');
            }
        );

        return $user;
    }
}