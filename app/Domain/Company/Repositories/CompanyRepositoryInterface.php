<?php

namespace App\Domain\Company\Repositories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;

interface CompanyRepositoryInterface
{
    public function find(int $id): ?Company;

    public function findForUser(int $id, int $userId): ?Company;

    public function all(): Collection;

    public function allForUser(int $userId): Collection;

    public function create(array $data): Company;

    public function update(Company $company, array $data): Company;

    public function delete(Company $company): void;
    public function getByUserId(int $userId): array;
}