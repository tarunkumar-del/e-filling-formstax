<?php

namespace App\Application\TaxForm\Commands\SaveFormFieldValues;

use App\Domain\TaxForm\Repositories\FormFieldValueRepositoryInterface;
use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class SaveFormFieldValuesHandler
{
    public function __construct(
        private readonly FormRepositoryInterface $formRepository,
        private readonly FormFieldValueRepositoryInterface $valueRepository,
    ) {}

    public function handle(
        SaveFormFieldValuesData $data
    ): void {
        DB::transaction(
            function () use ($data) {
                $form =
                    $this->formRepository->findById(
                        $data->formId
                    );

                if ($form === null) {
                    throw new RuntimeException(
                        'Tax form not found.'
                    );
                }

                foreach (
                    $data->values
                    as $fieldId => $value
                ) {
                    $this->valueRepository->upsert(
                        $data->formId,
                        (int) $fieldId,
                        $value === null
                            ? null
                            : (string) $value,
                    );
                }

                $this->formRepository->update(
                    $form,
                    [
                        'status' => 'completed',
                    ]
                );
            }
        );
    }
}