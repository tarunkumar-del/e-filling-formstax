<?php

namespace App\Application\TaxForm\Commands\SaveFormFieldValues;

class SaveFormFieldValuesData
{
    public function __construct(
        public readonly int $formId,
        public readonly array $values,
    ) {}
}