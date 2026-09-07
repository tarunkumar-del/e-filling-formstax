<?php

namespace App\Application\TaxForm\Queries\GetFormFieldConfiguration;

use App\Domain\TaxForm\Repositories\FormDefinitionFieldRepositoryInterface;

class GetFormFieldConfigurationHandler
{
    public function __construct(
        private readonly FormDefinitionFieldRepositoryInterface $repository
    ) {}

    public function handle(int $formDefinitionId): array
    {
        return $this->repository->getByFormDefinitionId(
            $formDefinitionId
        );
    }
}