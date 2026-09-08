<?php

namespace App\Application\TaxForm\Commands\DeleteForm;

use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use App\Models\Form;
use Illuminate\Support\Facades\DB;

class DeleteFormHandler
{
    public function __construct(
        private readonly FormRepositoryInterface $formRepository,
    ) {}

    public function handle(Form $form): bool
    {
        return DB::transaction(function () use ($form) {
            return $this->formRepository->delete($form);
        });
    }
}