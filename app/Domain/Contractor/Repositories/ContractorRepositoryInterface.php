<?php

namespace App\Domain\Contractor\Repositories;

use App\Models\Contractor;
use Illuminate\Database\Eloquent\Collection;

interface ContractorRepositoryInterface
{
    /**
     * Get all contractors for a company.
     */
    public function getByCompany(int $companyId): Collection;

    /**
     * Find a contractor by ID.
     */
    public function findById(int $id): ?Contractor;

    /**
     * Find a contractor belonging to a specific company.
     */
    public function findByCompany(
        int $companyId,
        int $contractorId
    ): ?Contractor;

    /**
     * Create a contractor.
     */
    public function create(array $data): Contractor;

    /**
     * Update a contractor.
     */
    public function update(
        Contractor $contractor,
        array $data
    ): Contractor;

    /**
     * Soft delete a contractor.
     */
    public function delete(Contractor $contractor): void;
}