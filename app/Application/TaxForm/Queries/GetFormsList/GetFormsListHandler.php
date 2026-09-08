<?php

namespace App\Application\TaxForm\Queries\GetFormsList;

use App\Domain\TaxForm\Repositories\FormRepositoryInterface;

class GetFormsListHandler
{
    public function __construct(
        private readonly FormRepositoryInterface $formRepository,
    ) {}

    public function handle(?int $userId = null)
    {
        if ($userId !== null) {
            return $this->formRepository->getAllForUser(
                $userId
            );
        }

        return $this->formRepository->getAll();
    }
}