<?php

namespace App\Infrastructure\Persistence\Repositories\Contractor;

use App\Domain\Contractor\Repositories\ContractorRepositoryInterface;
use App\Models\Contractor;
use Illuminate\Database\Eloquent\Collection;

class EloquentContractorRepository implements ContractorRepositoryInterface
{
    /**
     * Get all contractors for a company.
     */
    public function getByCompany(int $companyId): Collection
    {
        return Contractor::query()
            ->where('company_id', $companyId)
            ->with([
                'country',
                'region',
                'city',
            ])
            ->latest()
            ->get();
    }

    /**
     * Find a contractor by ID.
     */
    public function findById(int $id): ?Contractor
    {
        return Contractor::query()
            ->with([
                'country',
                'region',
                'city',
            ])
            ->find($id);
    }

    /**
     * Find a contractor belonging to a specific company.
     */
    public function findByCompany(
        int $companyId,
        int $contractorId
    ): ?Contractor {
        return Contractor::query()
            ->where('company_id', $companyId)
            ->with([
                'country',
                'region',
                'city',
            ])
            ->find($contractorId);
    }

    /**
     * Create a contractor.
     */
    public function create(array $data): Contractor
    {
        $contractor = Contractor::query()->create($data);

        return $contractor->load([
            'country',
            'region',
            'city',
        ]);
    }

    /**
     * Update a contractor.
     */
    public function update(
        Contractor $contractor,
        array $data
    ): Contractor {
        $contractor->update($data);

        return $contractor->refresh()->load([
            'country',
            'region',
            'city',
        ]);
    }

    /**
     * Soft delete a contractor.
     */
    public function delete(Contractor $contractor): void
    {
        $contractor->delete();
    }
    public function getByCompanyId(int $companyId): array
    {
        return Contractor::query()
            ->where('company_id', $companyId)
            ->latest('id')
            ->get()
            ->toArray();
    }
}