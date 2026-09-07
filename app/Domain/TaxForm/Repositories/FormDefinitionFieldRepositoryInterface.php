<?php

namespace App\Domain\TaxForm\Repositories;

interface FormDefinitionFieldRepositoryInterface
{
    public function getByFormDefinitionId(int $formDefinitionId): array;

    public function findById(
        int $formDefinitionId,
        int $formDefinitionFieldId
    ): ?object;

    public function updateConfiguration(
        int $formDefinitionId,
        int $formDefinitionFieldId,
        array $data
    ): object;
}