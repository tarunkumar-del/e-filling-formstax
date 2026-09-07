<?php

namespace App\Http\Requests\Company;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'tax_id_type' => [
                'required',
                Rule::in(['TIN', 'EIN', 'SSN']),
            ],

            'tax_id' => [
                'required',
                'string',
                'max:50',
            ],

            'payer_first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'payer_last_name' => [
                'required',
                'string',
                'max:100',
            ],

            'business_entity_name' => [
                'required',
                'string',
                'max:255',
            ],

            'address_1' => [
                'required',
                'string',
                'max:255',
            ],

            'address_2' => [
                'nullable',
                'string',
                'max:255',
            ],

            'country' => [
                'required',
                'string',
                'max:100',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'state' => [
                'required',
                'string',
                'max:100',
            ],

            'zip_code' => [
                'required',
                'string',
                'max:20',
            ],

            'phone' => [
                'required',
                'string',
                'max:30',
            ],

            'email' => [
                'required',
                'email',
                'max:255',
            ],

            'payer_contact_name' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }
}