<?php

namespace App\Application\TaxForm\Queries\GetCreateFormOptions;

use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;

class GetCreateFormOptionsHandler
{
    public function __construct(
        private readonly FormDefinitionRepositoryInterface $repository
    ) {}

    public function handle(
        ?int $year = null,
        ?string $search = null
    ): array {
        return $this->repository->getCreateFormOptions(
            $year,
            $search
        );
    }
}