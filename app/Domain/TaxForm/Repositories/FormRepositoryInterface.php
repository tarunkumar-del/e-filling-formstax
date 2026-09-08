<?php

namespace App\Domain\TaxForm\Repositories;

use App\Models\Form;

interface FormRepositoryInterface
{
    public function findById(int $id): ?Form;

    public function create(array $data): Form;

    public function update(Form $form, array $data): Form;
}