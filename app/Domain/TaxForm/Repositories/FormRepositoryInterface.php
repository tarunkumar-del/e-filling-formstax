<?php

namespace App\Domain\TaxForm\Repositories;

use App\Models\Form;
use Illuminate\Support\Collection;

interface FormRepositoryInterface
{
    public function findById(int $id): ?Form;

    public function create(array $data): Form;

    public function update(Form $form, array $data): Form;

    /**
     * Get all forms created for a specific user.
     */
    public function getAllForUser(int $userId): Collection;

    /**
     * Get all forms for admin.
     */
    public function getAll(): Collection;

    /**
     * Delete a form.
     */
    public function delete(Form $form): bool;
}