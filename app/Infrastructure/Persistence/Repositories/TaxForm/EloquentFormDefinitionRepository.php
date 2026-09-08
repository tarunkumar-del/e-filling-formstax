<?php

namespace App\Infrastructure\Persistence\Repositories\TaxForm;

use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EloquentFormDefinitionRepository implements FormDefinitionRepositoryInterface
{
    public function getActiveDefinitions(): array
    {
        return DB::table('form_definitions')
            ->join(
                'form_types',
                'form_types.id',
                '=',
                'form_definitions.form_type_id'
            )
            ->where('form_definitions.is_active', true)
            ->orderByDesc('form_definitions.tax_year')
            ->orderByDesc('form_definitions.id')
            ->get([
                'form_definitions.id',
                'form_definitions.form_type_id',
                'form_definitions.tax_year',
                'form_definitions.name',
                'form_definitions.is_active',
            ])
            ->map(fn ($definition) => [
                'id' => $definition->id,
                'form_type_id' => $definition->form_type_id,
                'tax_year' => $definition->tax_year,
                'name' => $definition->name,
                'is_active' => (bool) $definition->is_active,
            ])
            ->toArray();
    }

    public function findById(int $id): ?object
    {
        return DB::table('form_definitions')
            ->join(
                'form_types',
                'form_types.id',
                '=',
                'form_definitions.form_type_id'
            )
            ->where('form_definitions.id', $id)
            ->where('form_definitions.is_active', true)
            ->first([
                'form_definitions.id',
                'form_definitions.form_type_id',
                'form_definitions.tax_year',
                'form_definitions.name',
                'form_definitions.is_active',
                'form_types.code as form_type',
                'form_types.name as form_type_name',
            ]);
    }

    public function getCreateFormOptions(
        ?int $year = null,
        ?string $search = null
    ): array {
        /*
        |--------------------------------------------------------------------------
        | Available Years
        |--------------------------------------------------------------------------
        |
        | Only active form-definition years are shown.
        |
        */
        $years = DB::table('form_definitions')
            ->where('is_active', true)
            ->select('tax_year')
            ->distinct()
            ->orderByDesc('tax_year')
            ->pluck('tax_year')
            ->map(fn ($value) => (int) $value)
            ->values()
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Default Year
        |--------------------------------------------------------------------------
        |
        | If frontend did not provide a year, use the tax year of the
        | latest-created active form definition.
        |
        */
        $defaultYear = DB::table('form_definitions')
            ->where('is_active', true)
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->value('tax_year');

        $defaultYear = $defaultYear !== null
            ? (int) $defaultYear
            : null;

        /*
        |--------------------------------------------------------------------------
        | Selected Year
        |--------------------------------------------------------------------------
        */
        $selectedYear = $year ?? $defaultYear;

        /*
        |--------------------------------------------------------------------------
        | Forms
        |--------------------------------------------------------------------------
        |
        | Search is performed by backend.
        |
        */
        $query = DB::table('form_definitions')
            ->join(
                'form_types',
                'form_types.id',
                '=',
                'form_definitions.form_type_id'
            )
            ->where('form_definitions.is_active', true);

        if ($selectedYear !== null) {
            $query->where(
                'form_definitions.tax_year',
                $selectedYear
            );
        }

        if ($search !== null && trim($search) !== '') {
            $search = trim($search);

            $query->where(function ($query) use ($search) {
                $query
                    ->where(
                        'form_definitions.name',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'form_types.name',
                        'ilike',
                        "%{$search}%"
                    )
                    ->orWhere(
                        'form_types.code',
                        'ilike',
                        "%{$search}%"
                    );
            });
        }

        $forms = $query
            ->orderBy('form_definitions.name')
            ->get([
                'form_definitions.id',
                'form_definitions.form_type_id',
                'form_types.code as form_type',
                'form_types.name as form_type_name',
                'form_definitions.tax_year',
                'form_definitions.name',
                'form_definitions.is_active',
            ])
            ->map(function ($form) {
                return [
                    'id' => $form->id,
                    'form_type_id' => $form->form_type_id,
                    'form_type' => $form->form_type,
                    'form_type_name' => $form->form_type_name,
                    'tax_year' => $form->tax_year,
                    'name' => $form->name,
                    'is_active' => (bool) $form->is_active,

                    /*
                     * Next step:
                     * Clicking this URL will open the actual
                     * Create Form wizard for this definition.
                     */
                    'create_url' => "/admin/tax-forms/create/{$form->id}",
                ];
            })
            ->values()
            ->toArray();

        return [
            'default_year' => $defaultYear,
            'selected_year' => $selectedYear,
            'years' => $years,
            'forms' => $forms,
        ];
    }
}