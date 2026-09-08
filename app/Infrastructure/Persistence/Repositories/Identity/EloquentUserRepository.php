<?php

namespace App\Infrastructure\Persistence\Repositories\Identity;

use App\Domain\Identity\Repositories\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class EloquentUserRepository implements UserRepositoryInterface
{
    public function paginate(
        int $perPage = 10,
        ?string $search = null,
        array $roles = []
    ): LengthAwarePaginator {
        $query = User::query()
            ->with('roles')
            ->withCount('companies')
            ->whereDoesntHave('roles', function (Builder $query) {
                $query->where('name', 'admin');
            })
            ->latest('id');

        if ($search) {
            $search = trim($search);

            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($roles)) {
            $query->role($roles);
        }

        return $query
            ->paginate($perPage)
            ->withQueryString();
    }
    public function findById(int $id): ?User
    {
        return User::query()
            ->with('roles')
            ->withCount('companies')
            ->find($id);
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
    public function findByEmail(string $email): ?User
    {
        return User::query()
            ->where('email', $email)
            ->first();
    }

    public function create(
        string $email,
        string $password,
        ?string $emailVerifiedAt = null,
        ?string $name = null
    ): User {
        return User::create([
            'email' => $email,
            'password' => $password,
            'name' => $name,
            'email_verified_at' => now(),
        ]);
    }

    public function updatePassword(
        User $user,
        string $password
    ): void {
        $user->update([
            'password' => $password,
        ]);
    }
    public function createUser(array $data): User
    {
        return User::create($data);
    }

    public function update(
        User $user,
        array $data
    ): User {
        $user->update($data);

        return $user->refresh();
    }
    public function getSimpleUsers(): array
    {
        return User::query()
            ->whereDoesntHave('roles', function ($query) {
                $query->where('name', 'admin');
            })
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'email',
            ])
            ->toArray();
    }
}