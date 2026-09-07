<?php

namespace App\Domain\TaxForm\Repositories;

interface FormDefinitionRepositoryInterface
{
    public function getActiveDefinitions(): array;

    public function findById(int $id): ?object;
}