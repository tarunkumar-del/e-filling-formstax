<?php

namespace App\Http\Controllers\TaxForm;

use App\Domain\TaxForm\Repositories\FormDefinitionFieldRepositoryInterface;
use App\Domain\TaxForm\Repositories\FormDefinitionRepositoryInterface;
use App\Domain\TaxForm\Repositories\FormRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ViewFormController
{
    public function __construct(
        private readonly FormRepositoryInterface $forms,
        private readonly FormDefinitionRepositoryInterface $formDefinitions,
        private readonly FormDefinitionFieldRepositoryInterface $formDefinitionFields,
    ) {}

    public function user(
        Request $request,
        int $form,
    ): Response {
        $user = $request->user();

        abort_unless($user !== null, 401);

        $formModel = $this->forms->findById($form);

        abort_unless($formModel !== null, 404);

        // A normal user can only view their own tax forms.
        abort_unless(
            $formModel->user_id === $user->id,
            403
        );

        return $this->render($formModel, false);
    }

    public function admin(
        Request $request,
        int $form,
    ): Response {
        $user = $request->user();

        abort_unless($user !== null, 401);

        abort_unless(
            $user->hasRole('admin'),
            403
        );

        $formModel = $this->forms->findById($form);

        abort_unless($formModel !== null, 404);

        return $this->render($formModel, true);
    }

    private function render(
        \App\Models\Form $form,
        bool $isAdmin,
    ): Response {
        $formDefinition = $this->formDefinitions->findById(
            (int) $form->form_definition_id
        );

        abort_unless($formDefinition !== null, 404);

        $fields = $this->formDefinitionFields
            ->getByFormDefinitionId(
                (int) $form->form_definition_id
            );

        $fieldValues = $form->fieldValues
            ->mapWithKeys(
                fn ($fieldValue) => [
                    (string) $fieldValue->field_id =>
                        $fieldValue->value,
                ]
            );

        return Inertia::render(
            'authenticated/tax-forms/view',
            [
                'form' => [
                    'id' => $form->id,
                    'user_id' => $form->user_id,
                    'company_id' => $form->company_id,
                    'contractor_id' => $form->contractor_id,
                    'form_definition_id' => $form->form_definition_id,
                    'status' => $form->status,
                    'created_at' => $form->created_at?->toISOString(),
                    'updated_at' => $form->updated_at?->toISOString(),
                    'user' => $form->user,
                    'company' => $form->company,
                    'contractor' => $form->contractor,
                ],
                'form_definition' => $formDefinition,
                'fields' => $fields,
                'field_values' => $fieldValues,
                'isAdmin' => $isAdmin,
            ]
        );
    }
}