<?php

namespace App\Application\TaxForm\DTOs;

class CreateFormData
{
    public function __construct(
        public readonly int $userId,
        public readonly int $companyId,
        public readonly int $formDefinitionId,
        public readonly ?int $contractorId = null,
        public readonly string $status = 'draft',
    ) {}

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'company_id' => $this->companyId,
            'contractor_id' => $this->contractorId,
            'form_definition_id' => $this->formDefinitionId,
            'status' => $this->status,
        ];
    }
}