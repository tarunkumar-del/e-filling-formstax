<?php

namespace App\Http\Requests\TaxForm;

use Illuminate\Foundation\Http\FormRequest;

class GetFormContractorsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'company_id' => [
                'required',
                'integer',
                'exists:companies,id',
            ],
            'user_id' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
        ];
    }
}