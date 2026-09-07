<?php

namespace App\Application\Contractor\Commands;

use App\Application\Contractor\DTOs\ContractorData;
use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;
use App\Models\Contractor;
use Illuminate\Support\Facades\DB;

class UpdateContractorHandler
{
    public function __construct(
        private readonly ContractorRepositoryInterface $contractorRepository
    ) {}

    public function handle(
        Contractor $contractor,
        ContractorData $data
    ): Contractor {
        return DB::transaction(function () use ($contractor, $data) {
            return $this->contractorRepository->update(
                $contractor,
                $data->toArray()
            );
        });
    }
}