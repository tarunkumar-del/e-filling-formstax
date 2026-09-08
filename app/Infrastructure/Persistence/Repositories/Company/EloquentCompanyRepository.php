<?php

namespace App\Infrastructure\Persistence\Repositories\Company;

use App\Domain\Company\Repositories\CompanyRepositoryInterface;
use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;

final class EloquentCompanyRepository implements CompanyRepositoryInterface
{
    public function find(int $id): ?Company
    {
        return Company::query()
            ->find($id);
    }

    public function findForUser(int $id, int $userId): ?Company
    {
        return Company::query()
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();
    }

    public function all(): Collection
    {
        return Company::query()
            ->latest()
            ->get();
    }

    public function allForUser(int $userId): Collection
    {
        return Company::query()
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function create(array $data): Company
    {
        return Company::create($data);
    }

    public function update(Company $company, array $data): Company
    {
        $company->update($data);

        return $company->refresh();
    }

    public function delete(Company $company): void
    {
        $company->delete();
    }
    public function getByUserId(int $userId): array
    {
        return Company::query()
            ->where('user_id', $userId)
            ->latest('id')
            ->get()
            ->toArray();
    }
}