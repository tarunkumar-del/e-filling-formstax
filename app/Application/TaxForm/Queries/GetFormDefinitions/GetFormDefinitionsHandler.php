<?php

namespace App\Application\TaxForm\Queries\GetFormDefinitions;

use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;

class GetFormDefinitionsHandler
{
    public function __construct(
        private readonly FormDefinitionRepositoryInterface $repository
    ) {}

    public function handle(): array
    {
        return $this->repository->getActiveDefinitions();
    }
}