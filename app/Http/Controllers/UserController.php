<?php

namespace App\Http\Controllers;

use App\Application\Identity\Commands\{CreateUserHandler, UpdateUserHandler, DeleteUserHandler};
use Illuminate\Http\{RedirectResponse, Request};
use Inertia\{Inertia, Response};
use App\Http\Requests\User\{StoreUserRequest, UpdateUserRequest};

use App\Application\Identity\DTOs\UserData;
use App\Domain\Identity\Repositories\UserRepositoryInterface;
use App\Models\User;


class UserController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly CreateUserHandler $createUserHandler,
        private readonly UpdateUserHandler $updateUserHandler,
        private readonly DeleteUserHandler $deleteUserHandler
    ) {
    }

    public function index(Request $request): Response
    {
        $users = $this->userRepository->paginate(
            perPage: min(
                max(
                    (int) $request->input(
                        'pageSize',
                        10
                    ),
                    1
                ),
                100
            ),
            search: $request->input('username'),
            roles: $this->decodeArray(
                $request->input('role')
            ),
        );

        $data = collect($users->items())
            ->map(function (User $user) {
                $role = $user
                    ->getRoleNames()
                    ->first();

                return [
                    'id' => $user->id,

                    'firstName' =>
                        $this->firstName(
                            $user->name
                        ),

                    'lastName' =>
                        $this->lastName(
                            $user->name
                        ),

                    'username' =>
                        $this->username(
                            $user
                        ),

                    'email' =>
                        $user->email,

                    /*
                     * These two fields do not exist
                     * in the current users table.
                     */
                    'phoneNumber' => null,
                    'status' => 'active',

                    'role' =>
                        $role ?? 'user',

                    'companyCount' =>
                        $user->companies_count,

                    'createdAt' =>
                        $user->created_at?->toISOString(),

                    'updatedAt' =>
                        $user->updated_at?->toISOString(),
                ];
            })
            ->values();

        return Inertia::render(
            'authenticated/users',
            [
                'users' => [
                    'data' => $data,

                    'current_page' =>
                        $users->currentPage(),

                    'last_page' =>
                        $users->lastPage(),

                    'per_page' =>
                        $users->perPage(),

                    'total' =>
                        $users->total(),
                ],
            ]
        );
    }

    public function store(
        StoreUserRequest $request
    ): RedirectResponse {
        $validated = $request->validated();

        $user = $this->createUserHandler->handle(
            new UserData(
                name: $validated['name'],
                email: $validated['email'],
                password: $validated['password'],
                role: 'user',
            )
        );

        return back()->with(
            'success',
            "User {$user->email} created successfully."
        );
    }

    public function update(
        UpdateUserRequest $request,
        User $user
    ): RedirectResponse {
        $validated = $request->validated();

        $this->updateUserHandler->handle(
            $user,
            new UserData(
                name: $validated['name'],
                email: $validated['email'],
                password: $validated['password'] ?: null,
                role: 'user',
            )
        );

        return back()->with(
            'success',
            'User updated successfully.'
        );
    }

    public function destroy(User $user): RedirectResponse
    {
        try {
            $this->deleteUserHandler->handle($user);

            return back()->with(
                'success',
                "User {$user->email} deleted successfully."
            );
        } catch (\RuntimeException $e) {
            return back()->withErrors([
                'user' => $e->getMessage(),
            ]);
        }
    }
    private function decodeArray(
        mixed $value
    ): array {
        if (is_array($value)) {
            return array_values($value);
        }

        if (
            !is_string($value) ||
            $value === ''
        ) {
            return [];
        }

        $decoded = json_decode(
            $value,
            true
        );

        return is_array($decoded)
            ? array_values($decoded)
            : [];
    }

    private function firstName(
        ?string $name
    ): string {
        $name = trim(
            (string) $name
        );

        if ($name === '') {
            return '';
        }

        return explode(
            ' ',
            $name
        )[0];
    }

    private function lastName(
        ?string $name
    ): string {
        $name = trim(
            (string) $name
        );

        if ($name === '') {
            return '';
        }

        $parts = preg_split(
            '/\s+/',
            $name
        );

        return count($parts) > 1
            ? (string) end($parts)
            : '';
    }

    private function username(
        User $user
    ): string {
        $username = strtolower(
            preg_replace(
                '/[^a-zA-Z0-9]+/',
                '.',
                trim($user->name)
            ) ?? ''
        );

        return trim(
            $username,
            '.'
        );
    }
}