<?php

namespace App\Application\Company\DTOs;

final readonly class CompanyData
{
    public function __construct(
        public string $taxIdType,
        public string $taxId,
        public string $payerFirstName,
        public string $payerLastName,
        public string $businessEntityName,
        public string $address1,
        public ?string $address2,
        public string $country,
        public string $city,
        public string $state,
        public string $zipCode,
        public string $phone,
        public string $email,
        public string $payerContactName,
    ) {}

    public function toArray(): array
    {
        return [
            'tax_id_type' => $this->taxIdType,
            'tax_id' => $this->taxId,
            'payer_first_name' => $this->payerFirstName,
            'payer_last_name' => $this->payerLastName,
            'business_entity_name' => $this->businessEntityName,
            'address_1' => $this->address1,
            'address_2' => $this->address2,
            'country' => $this->country,
            'city' => $this->city,
            'state' => $this->state,
            'zip_code' => $this->zipCode,
            'phone' => $this->phone,
            'email' => $this->email,
            'payer_contact_name' => $this->payerContactName,
        ];
    }
}