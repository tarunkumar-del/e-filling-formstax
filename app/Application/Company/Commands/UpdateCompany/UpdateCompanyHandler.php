<?php

namespace App\Application\Company\Commands\UpdateCompany;

use App\Application\Company\DTOs\CompanyData;
use App\Domain\Company\Repositories\CompanyRepositoryInterface;
use App\Models\Company;

final class UpdateCompanyHandler
{
    public function __construct(
        private CompanyRepositoryInterface $companies,
    ) {}

    public function handle(
        Company $company,
        CompanyData $data
    ): Company {
        return $this->companies->update(
            $company,
            $data->toArray()
        );
    }
}