<?php

namespace App\Application\Contractor\Queries\GetContractorsForCompany;

use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;

class GetContractorsForCompanyHandler
{
    public function __construct(
        private readonly ContractorRepositoryInterface $contractorRepository,
    ) {}

    public function handle(int $companyId): array
    {
        return $this->contractorRepository
            ->getByCompanyId($companyId);
    }
}