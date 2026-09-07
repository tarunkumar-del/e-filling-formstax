<?php

namespace App\Application\TaxForm\Commands\UpdateFormFieldConfiguration;

use App\Domain\TaxForm\Repositories\FormDefinitionFieldRepositoryInterface;
use Illuminate\Support\Facades\DB;

class UpdateFormFieldConfigurationHandler
{
    public function __construct(
        private readonly FormDefinitionFieldRepositoryInterface $repository
    ) {}

    public function handle(
        int $formDefinitionId,
        int $formDefinitionFieldId,
        UpdateFormFieldConfigurationData $data
    ): object {
        return DB::transaction(function () use (
            $formDefinitionId,
            $formDefinitionFieldId,
            $data
        ) {
            return $this->repository->updateConfiguration(
                $formDefinitionId,
                $formDefinitionFieldId,
                $data->toArray()
            );
        });
    }
}