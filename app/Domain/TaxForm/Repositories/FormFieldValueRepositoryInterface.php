<?php

namespace App\Domain\TaxForm\Repositories;

use App\Models\FormFieldValue;
use Illuminate\Support\Collection;

interface FormFieldValueRepositoryInterface
{
    public function getByFormId(
        int $formId
    ): Collection;

    public function upsert(
        int $formId,
        int $fieldId,
        ?string $value
    ): FormFieldValue;

    public function deleteForForm(
        int $formId,
        array $fieldIds
    ): void;
}