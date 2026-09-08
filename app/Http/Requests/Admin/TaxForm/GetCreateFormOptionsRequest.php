<?php

namespace App\Http\Requests\Admin\TaxForm;

use Illuminate\Foundation\Http\FormRequest;

class GetCreateFormOptionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('admin') ?? false;
    }

    public function rules(): array
    {
        return [
            'year' => [
                'nullable',
                'integer',
                'min:2000',
                'max:2100',
            ],

            'search' => [
                'nullable',
                'string',
                'max:100',
            ],
        ];
    }
}