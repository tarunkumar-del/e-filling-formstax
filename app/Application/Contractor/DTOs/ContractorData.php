<?php

namespace App\Application\Contractor\DTOs;

class ContractorData
{
    public function __construct(
        public readonly int $companyId,
        public readonly string $taxIdType,
        public readonly ?string $taxId,
        public readonly ?string $firstName,
        public readonly ?string $middleInitial,
        public readonly ?string $lastName,
        public readonly ?string $suffix,
        public readonly ?string $businessEntityName,
        public readonly string $address1,
        public readonly ?string $address2,
        public readonly int $countryId,
        public readonly ?int $regionId,
        public readonly ?int $cityId,
        public readonly ?string $postal,
        public readonly ?string $phone,
        public readonly ?string $email,
    ) {}

    public function toArray(): array
    {
        return [
            'company_id' => $this->companyId,
            'tax_id_type' => $this->taxIdType,
            'tax_id' => $this->taxId,
            'first_name' => $this->firstName,
            'middle_initial' => $this->middleInitial,
            'last_name' => $this->lastName,
            'suffix' => $this->suffix,
            'business_entity_name' => $this->businessEntityName,
            'address_1' => $this->address1,
            'address_2' => $this->address2,
            'country_id' => $this->countryId,
            'region_id' => $this->regionId,
            'city_id' => $this->cityId,
            'postal' => $this->postal,
            'phone' => $this->phone,
            'email' => $this->email,
        ];
    }
}