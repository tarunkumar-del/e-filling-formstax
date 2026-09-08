<?php

namespace App\Application\TaxForm\Commands\CreateForm;

use App\Application\TaxForm\DTOs\CreateFormData;
use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use Illuminate\Support\Facades\DB;
use App\Models\Form;

class CreateFormHandler
{
    public function __construct(
        private readonly FormRepositoryInterface $formRepository,
    ) {}

    public function handle(CreateFormData $data): Form
    {
        return DB::transaction(function () use ($data) {
            return $this->formRepository->create(
                $data->toArray()
            );
        });
    }
}