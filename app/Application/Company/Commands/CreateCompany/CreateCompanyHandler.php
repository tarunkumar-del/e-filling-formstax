<?php

namespace App\Application\Company\Commands\CreateCompany;

use App\Application\Company\DTOs\CompanyData;
use App\Domain\Company\Repositories\CompanyRepositoryInterface;
use App\Models\Company;

final class CreateCompanyHandler
{
    public function __construct(
        private CompanyRepositoryInterface $companies,
    ) {}

    public function handle(
        CompanyData $data,
        int $userId
    ): Company {
        return $this->companies->create([
            'user_id' => $userId,
            ...$data->toArray(),
        ]);
    }
}