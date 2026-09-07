<?php

namespace App\Application\TaxForm\Commands\UpdateFormFieldConfiguration;

class UpdateFormFieldConfigurationData
{
    public function __construct(
        public readonly bool $isEnabled,
        public readonly bool $isRequired,
        public readonly int $sortOrder,
        public readonly ?string $section,
    ) {}

    public function toArray(): array
    {
        return [
            'is_enabled' => $this->isEnabled,
            'is_required' => $this->isRequired,
            'sort_order' => $this->sortOrder,
            'section' => $this->section,
        ];
    }
}