<?php

namespace App\Infrastructure\Persistence\Repositories\TaxForm;

use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EloquentFormDefinitionRepository implements FormDefinitionRepositoryInterface
{
    public function getActiveDefinitions(): array
    {
        return DB::table('form_definitions')
            ->where('is_active', true)
            ->orderBy('tax_year', 'desc')
            ->orderBy('id')
            ->get()
            ->map(function ($definition) {
                return [
                    'id' => (int) $definition->id,
                    'form_type_id' => (int) $definition->form_type_id,
                    'tax_year' => (int) $definition->tax_year,
                    'name' => $definition->name,
                    'is_active' => (bool) $definition->is_active,
                ];
            })
            ->values()
            ->all();
    }

    public function findById(int $id): ?object
    {
        return DB::table('form_definitions')
            ->where('id', $id)
            ->first();
    }
}