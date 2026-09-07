<?php

namespace App\Http\Controllers\Admin\TaxForm;

use App\Application\TaxForm\Commands\UpdateFormFieldConfiguration\UpdateFormFieldConfigurationData;
use App\Application\TaxForm\Commands\UpdateFormFieldConfiguration\UpdateFormFieldConfigurationHandler;
use App\Application\TaxForm\Queries\GetFormFieldConfiguration\GetFormFieldConfigurationHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TaxForm\UpdateFormFieldConfigurationRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FormConfigurationController extends Controller
{
    public function __construct(
        private readonly GetFormFieldConfigurationHandler $getHandler,
        private readonly UpdateFormFieldConfigurationHandler $updateHandler,
    ) {}

    public function index(
        int $formDefinitionId
    ): Response {
        $fields = $this->getHandler->handle(
            $formDefinitionId
        );

        return Inertia::render(
            'authenticated/admin/tax-forms/configuration',
            [
                'formDefinitionId' => $formDefinitionId,
                'fields' => $fields,
            ]
        );
    }

    public function update(
        UpdateFormFieldConfigurationRequest $request,
        int $formDefinitionId,
        int $formDefinitionFieldId
    ): RedirectResponse {
        $data = new UpdateFormFieldConfigurationData(
            isEnabled: $request->boolean('is_enabled'),
            isRequired: $request->boolean('is_required'),
            sortOrder: (int) $request->input('sort_order'),
            section: $request->input('section'),
        );

        $this->updateHandler->handle(
            $formDefinitionId,
            $formDefinitionFieldId,
            $data
        );

        return back()->with(
            'success',
            'Field configuration updated successfully.'
        );
    }
}