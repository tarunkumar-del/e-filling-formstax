<?php

namespace App\Application\TaxForm\Queries\GetCreateFormPage;

use App\Domain\Company\Repositories\CompanyRepositoryInterface;
use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;

class GetCreateFormPageHandler
{
    public function __construct(
        private readonly FormDefinitionRepositoryInterface $formDefinitionRepository,
        private readonly CompanyRepositoryInterface $companyRepository,
    ) {}

    public function handle(
        int $formDefinitionId,
        int $ownerUserId,
    ): array {
        $formDefinition =
            $this->formDefinitionRepository
                ->findById(
                    $formDefinitionId
                );

        if ($formDefinition === null) {
            abort(404);
        }

        /*
         * Company list is scoped to the
         * selected/authorized user.
         */
        $companies =
            $this->companyRepository
                ->getByUserId(
                    $ownerUserId
                );

        return [
            'formDefinition' =>
                $formDefinition,

            'companies' =>
                $companies,
        ];
    }
}