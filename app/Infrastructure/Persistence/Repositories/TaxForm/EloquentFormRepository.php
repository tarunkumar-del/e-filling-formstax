<?php

namespace App\Infrastructure\Persistence\Repositories\TaxForm;

use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use App\Models\Form;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EloquentFormRepository implements FormRepositoryInterface
{
    public function findById(int $id): ?Form
    {
        return Form::query()
            ->with([
                'user:id,name,email',
                'company',
                'contractor',
                'fieldValues',
            ])
            ->find($id);
    }

    public function create(array $data): Form
    {
        return Form::query()->create($data);
    }

    public function update(Form $form, array $data): Form
    {
        $form->update($data);

        return $form->fresh([
            'user:id,name,email',
            'company',
            'contractor',
            'fieldValues',
        ]);
    }

    public function getAllForUser(int $userId): Collection
    {
        return $this->buildListQuery()
            ->where('forms.user_id', $userId)
            ->whereExists(function ($query) use ($userId) {
                $query->select(DB::raw(1))
                    ->from('companies')
                    ->whereColumn(
                        'companies.id',
                        'forms.company_id'
                    )
                    ->where(
                        'companies.user_id',
                        $userId
                    );
            })
            ->orderByDesc('forms.created_at')
            ->get();
    }

    public function getAll(): Collection
    {
        return $this->buildListQuery()
            ->orderByDesc('forms.created_at')
            ->get();
    }

    public function delete(Form $form): bool
    {
        return (bool) $form->delete();
    }

    private function buildListQuery()
    {
        return Form::query()
            ->select([
                'forms.id',
                'forms.user_id',
                'forms.company_id',
                'forms.contractor_id',
                'forms.form_definition_id',
                'forms.status',
                'forms.created_at',
                'forms.updated_at',

                'form_definitions.form_type_id',
                'form_definitions.tax_year',
                'form_definitions.name as form_definition_name',

                'form_types.name as form_type_name',
            ])
            ->join(
                'form_definitions',
                'form_definitions.id',
                '=',
                'forms.form_definition_id'
            )
            ->join(
                'form_types',
                'form_types.id',
                '=',
                'form_definitions.form_type_id'
            )
            ->with([
                'user:id,name,email',
                'company',
                'contractor',
            ]);
    }
}