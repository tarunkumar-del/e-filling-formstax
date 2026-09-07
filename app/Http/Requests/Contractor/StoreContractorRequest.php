<?php

namespace App\Http\Requests\Contractor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContractorRequest extends FormRequest
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
                Rule::in([
                    'TIN',
                    'EIN',
                    'SSN',
                    'Unknown',
                ]),
            ],

            'tax_id' => [
                'nullable',
                'string',
                'max:50',
            ],

            'first_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'middle_initial' => [
                'nullable',
                'string',
                'max:10',
            ],

            'last_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'suffix' => [
                'nullable',
                'string',
                'max:30',
            ],

            'business_entity_name' => [
                'nullable',
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

            'country_id' => [
                'required',
                'integer',
                'exists:countries,id',
            ],

            'region_id' => [
                'nullable',
                'integer',
                'exists:country_regions,id',
            ],

            'city_id' => [
                'nullable',
                'integer',
                'exists:country_cities,id',
            ],

            'postal' => [
                'nullable',
                'string',
                'max:30',
            ],

            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],

            'email' => [
                'nullable',
                'email',
                'max:255',
            ],
        ];
    }
}