<?php

namespace App\Http\Requests\Admin\TaxForm;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFormFieldConfigurationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    public function rules(): array
    {
        return [
            'is_enabled' => [
                'required',
                'boolean',
            ],

            'is_required' => [
                'required',
                'boolean',
            ],

            'sort_order' => [
                'required',
                'integer',
                'min:0',
            ],

            'section' => [
                'nullable',
                'string',
                'max:100',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_enabled' => filter_var(
                $this->input('is_enabled'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),

            'is_required' => filter_var(
                $this->input('is_required'),
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ),
        ]);
    }
}