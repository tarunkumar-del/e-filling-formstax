<?php

namespace App\Application\Contractor\Commands;

use App\Application\Contractor\DTOs\ContractorData;
use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;
use App\Models\Contractor;
use Illuminate\Support\Facades\DB;

class CreateContractorHandler
{
    public function __construct(
        private readonly ContractorRepositoryInterface $contractorRepository
    ) {}


    public function handle(ContractorData $data): Contractor
    {
        return DB::transaction(function () use ($data) {
            return $this->contractorRepository->create(
                $data->toArray()
            );
        });
    }
}