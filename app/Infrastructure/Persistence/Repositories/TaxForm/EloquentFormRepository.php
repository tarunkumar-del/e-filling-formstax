<?php

namespace App\Infrastructure\Persistence\Repositories\TaxForm;

use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use App\Models\Form;

class EloquentFormRepository implements FormRepositoryInterface
{
    public function findById(int $id): ?Form
    {
        return Form::query()
            ->with([
                'user:id,name,email',
                'company',
                'contractor',
                'formDefinition',
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
            'formDefinition',
            'fieldValues',
        ]);
    }
}