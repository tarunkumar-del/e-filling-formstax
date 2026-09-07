<?php

namespace App\Domain\Identity\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function create(
        string $email,
        string $password,
        ?string $emailVerifiedAt = null,
        ?string $name = null
    ): User;

    public function updatePassword(
        User $user,
        string $password
    ): void;
     public function paginate(
        int $perPage = 10,
        ?string $search = null,
        array $roles = []
    ): LengthAwarePaginator;

    public function findById(int $id): ?User;

    public function delete(User $user): void;
    public function createUser(array $data): User;
}