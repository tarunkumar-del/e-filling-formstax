<?php

namespace App\Application\Company\Queries\GetCompaniesForUser;

use App\Domain\Company\Repositories\CompanyRepositoryInterface;

class GetCompaniesForUserHandler
{
    public function __construct(
        private readonly CompanyRepositoryInterface $companyRepository,
    ) {}

    public function handle(int $userId): array
    {
        return $this->companyRepository->getByUserId($userId);
    }
}