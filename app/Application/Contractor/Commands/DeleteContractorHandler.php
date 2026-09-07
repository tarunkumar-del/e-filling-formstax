<?php

namespace App\Application\Contractor\Commands;

use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;
use App\Models\Contractor;
use Illuminate\Support\Facades\DB;

class DeleteContractorHandler
{
    public function __construct(
        private readonly ContractorRepositoryInterface $contractorRepository
    ) {}

    public function handle(Contractor $contractor): void
    {
        DB::transaction(function () use ($contractor) {
            $this->contractorRepository->delete($contractor);
        });
    }
}