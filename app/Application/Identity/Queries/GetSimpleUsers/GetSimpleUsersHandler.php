<?php

namespace App\Application\Identity\Queries\GetSimpleUsers;

use App\Domain\Identity\Repositories\UserRepositoryInterface;

class GetSimpleUsersHandler
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository
    ) {}

    public function handle(): array
    {
        return $this->userRepository->getSimpleUsers();
    }
}