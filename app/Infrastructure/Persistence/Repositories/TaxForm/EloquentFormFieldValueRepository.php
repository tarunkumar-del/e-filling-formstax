<?php

namespace App\Infrastructure\Persistence\Repositories\TaxForm;

use App\Domain\TaxForm\Repositories\FormFieldValueRepositoryInterface;
use App\Models\FormFieldValue;
use Illuminate\Support\Collection;

class EloquentFormFieldValueRepository
    implements FormFieldValueRepositoryInterface
{
    public function getByFormId(
        int $formId
    ): Collection {
        return FormFieldValue::query()
            ->where(
                'form_id',
                $formId
            )
            ->get();
    }

    public function upsert(
        int $formId,
        int $fieldId,
        ?string $value
    ): FormFieldValue {
        return FormFieldValue::query()
            ->updateOrCreate(
                [
                    'form_id' => $formId,
                    'field_id' => $fieldId,
                ],
                [
                    'value' => $value,
                ],
            );
    }

    public function deleteForForm(
        int $formId,
        array $fieldIds
    ): void {
        if ($fieldIds === []) {
            return;
        }

        FormFieldValue::query()
            ->where(
                'form_id',
                $formId
            )
            ->whereIn(
                'field_id',
                $fieldIds
            )
            ->delete();
    }
}