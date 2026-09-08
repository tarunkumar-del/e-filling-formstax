<?php

namespace App\Domain\TaxForm\Repositories;

interface FormDefinitionRepositoryInterface
{
    public function getActiveDefinitions(): array;

    public function findById(int $id): ?object;
    public function getCreateFormOptions(
        ?int $year = null,
        ?string $search = null
    ): array;
}