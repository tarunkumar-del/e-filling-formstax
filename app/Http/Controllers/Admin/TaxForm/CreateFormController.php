<?php

namespace App\Http\Controllers\Admin\TaxForm;

use App\Application\TaxForm\Commands\CreateForm\CreateFormHandler;
use App\Application\TaxForm\DTOs\CreateFormData;
use App\Application\TaxForm\Queries\GetCreateFormPage\GetCreateFormPageHandler;
use App\Domain\TaxForm\Repositories\FormDefinitionFieldRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Contractor;
use App\Models\Form;
use App\Models\FormFieldValue;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CreateFormController extends Controller
{
    public function __construct(
        private readonly FormDefinitionFieldRepositoryInterface $formDefinitionFieldRepository,
    ) {}

    public function __invoke(
        Request $request,
        int $formDefinitionId,
        GetCreateFormPageHandler $handler,
    ): Response {
        $authUser = $request->user();

        $ownerUserId = $this->resolveOwnerUserId(
            $request,
            $authUser,
        );

        $data = $handler->handle(
            $formDefinitionId,
            $ownerUserId,
        );

        /*
         * FormDefinitionRepository returns a stdClass.
         * Dynamic configured fields therefore come from the
         * dedicated FormDefinitionFieldRepository.
         */
        $formFields = $this->formDefinitionFieldRepository
            ->getByFormDefinitionId($formDefinitionId);

        $data['form_fields'] = collect($formFields)
            ->filter(
                fn (array $field): bool =>
                    (bool) ($field['is_enabled'] ?? false)
            )
            ->values()
            ->toArray();

        $data['form_id'] = null;
        $data['form_values'] = [];
        $data['selected_company_id'] = null;
        $data['selected_contractor_id'] = null;

        $formId = $request->integer('form_id');

        if ($formId > 0) {
            $form = Form::query()
                ->whereKey($formId)
                ->where('user_id', $ownerUserId)
                ->where('form_definition_id', $formDefinitionId)
                ->with([
                    'company',
                    'contractor.country',
                    'contractor.region',
                    'contractor.city',
                    'fieldValues',
                ])
                ->first();

            if ($form === null) {
                abort(404);
            }

            abort_unless(
                $form->company_id !== null,
                404,
            );

            if ($form->contractor_id !== null) {
                abort_unless(
                    $form->contractor !== null &&
                        $form->contractor->company_id === $form->company_id,
                    404,
                );
            }

            $data['form_id'] = $form->id;
            $data['selected_company_id'] = $form->company_id;
            $data['selected_contractor_id'] = $form->contractor_id;

            $data['form_values'] = $form->fieldValues
                ->mapWithKeys(
                    function (FormFieldValue $fieldValue): array {
                        return [
                            (string) $fieldValue->field_id =>
                                $fieldValue->value,
                        ];
                    }
                )
                ->toArray();
        }

        return Inertia::render(
            'authenticated/admin/tax-forms/create',
            [
                ...$data,
                'owner_user_id' => $ownerUserId,
                'is_admin' => $authUser->hasRole('admin'),
            ],
        );
    }

    public function store(
        Request $request,
        int $formDefinitionId,
        CreateFormHandler $handler,
    ): RedirectResponse {
        $authUser = $request->user();

        /*
         * Laravel validation errors are returned through Inertia's
         * onError callback instead of raw abort(422) responses.
         */
        $request->validate([
            'company_id' => ['required', 'integer', 'min:1'],
            'contractor_id' => ['required', 'integer', 'min:1'],
            'field_values' => ['required', 'array'],
        ]);

        $ownerUserId = $this->resolveOwnerUserId(
            $request,
            $authUser,
        );

        $companyId = (int) $request->input('company_id');

        $company = Company::query()
            ->whereKey($companyId)
            ->where('user_id', $ownerUserId)
            ->first();

        if ($company === null) {
            throw ValidationException::withMessages([
                'company_id' => 'Invalid company selection.',
            ]);
        }

        $contractorId = (int) $request->input('contractor_id');

        $contractor = Contractor::query()
            ->whereKey($contractorId)
            ->where('company_id', $company->id)
            ->with([
                'country',
                'region',
                'city',
            ])
            ->first();

        if ($contractor === null) {
            throw ValidationException::withMessages([
                'contractor_id' => 'Invalid contractor selection.',
            ]);
        }

        /*
         * Make sure the submitted definition exists and only its
         * enabled fields can be submitted.
         */
        $configuredFields = collect(
            $this->formDefinitionFieldRepository
                ->getByFormDefinitionId($formDefinitionId)
        )
            ->filter(
                fn (array $field): bool =>
                    (bool) ($field['is_enabled'] ?? false)
            )
            ->keyBy(
                fn (array $field): int =>
                    (int) $field['field_id']
            );

        if ($configuredFields->isEmpty()) {
            throw ValidationException::withMessages([
                'field_values' =>
                    'No fields are configured for this tax form.',
            ]);
        }

        $submittedValues = $request->input('field_values', []);

        /*
         * Reject field IDs that do not belong to this form definition.
         */
        $unknownFieldIds = collect(array_keys($submittedValues))
            ->filter(
                fn ($fieldId): bool =>
                    !$configuredFields->has((int) $fieldId)
            );

        if ($unknownFieldIds->isNotEmpty()) {
            throw ValidationException::withMessages([
                'field_values' =>
                    'One or more submitted fields are invalid for this form.',
            ]);
        }

        $validationErrors = [];

        /*
         * Validate every configured field server-side. Frontend
         * validation is only a convenience; backend validation is
         * authoritative.
         */
        foreach ($configuredFields as $fieldId => $field) {
            $key = (string) $fieldId;
            $value = array_key_exists($key, $submittedValues)
                ? $submittedValues[$key]
                : null;

            $isEmpty =
                $value === null ||
                $value === '' ||
                (
                    is_string($value) &&
                    trim($value) === ''
                );

            if (($field['is_required'] ?? false) && $isEmpty) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} is required.";

                continue;
            }

            if ($isEmpty) {
                continue;
            }

            $rules = is_array($field['validation_rules'] ?? null)
                ? $field['validation_rules']
                : [];

            $inputType = (string) ($field['input_type'] ?? 'text');

            if (
                in_array($inputType, [
                    'number',
                    'currency',
                ], true)
                && !is_numeric($value)
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} must be a valid number.";

                continue;
            }

            if ($inputType === 'checkbox' && !is_bool($value)) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} must be true or false.";

                continue;
            }

            if (
                in_array($inputType, [
                    'text',
                    'textarea',
                    'select',
                    'country',
                    'region',
                    'city',
                    'date',
                    'email',
                ], true)
                && !is_scalar($value)
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} contains an invalid value.";

                continue;
            }

            if (
                $inputType === 'email' &&
                filter_var((string) $value, FILTER_VALIDATE_EMAIL) === false
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} must be a valid email address.";
            }

            if (
                isset($rules['maxLength']) &&
                is_string($value) &&
                mb_strlen($value) > (int) $rules['maxLength']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} cannot exceed {$rules['maxLength']} characters.";
            }

            if (
                isset($rules['minLength']) &&
                is_string($value) &&
                mb_strlen($value) < (int) $rules['minLength']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} must be at least {$rules['minLength']} characters.";
            }

            if (
                isset($rules['max']) &&
                is_numeric($value) &&
                (float) $value > (float) $rules['max']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} cannot be greater than {$rules['max']}.";
            }

            if (
                isset($rules['min']) &&
                is_numeric($value) &&
                (float) $value < (float) $rules['min']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} cannot be less than {$rules['min']}.";
            }

            if (
                isset($rules['maxDigits']) &&
                is_numeric($value) &&
                strlen(preg_replace('/\D/', '', (string) $value)) >
                    (int) $rules['maxDigits']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} cannot exceed {$rules['maxDigits']} digits.";
            }

            if (
                isset($rules['minDigits']) &&
                is_numeric($value) &&
                strlen(preg_replace('/\D/', '', (string) $value)) <
                    (int) $rules['minDigits']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} must contain at least {$rules['minDigits']} digits.";
            }

            if (
                isset($rules['length']) &&
                is_string($value) &&
                mb_strlen($value) !== (int) $rules['length']
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} must be {$rules['length']} characters.";
            }

            if (
                ($rules['alpha'] ?? false) &&
                !preg_match('/^[A-Za-z]+$/', (string) $value)
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} may contain letters only.";
            }

            if (
                ($rules['alphaNumeric'] ?? false) &&
                !preg_match('/^[A-Za-z0-9]+$/', (string) $value)
            ) {
                $validationErrors["field_values.{$fieldId}"] =
                    "{$field['label']} may contain letters and numbers only.";
            }

            /*
             * Select fields are limited to configured option values.
             */
            if (
                $inputType === 'select' &&
                is_array($field['options'] ?? null)
            ) {
                $allowedValues = collect($field['options'])
                    ->map(
                        function ($option): string {
                            if (is_array($option)) {
                                return (string) (
                                    $option['value'] ?? ''
                                );
                            }

                            return (string) $option;
                        }
                    )
                    ->filter(
                        fn (string $option): bool =>
                            $option !== ''
                    )
                    ->values()
                    ->all();

                if (
                    $allowedValues !== [] &&
                    !in_array((string) $value, $allowedValues, true)
                ) {
                    $validationErrors["field_values.{$fieldId}"] =
                        "{$field['label']} has an invalid selection.";
                }
            }

        }

        if ($validationErrors !== []) {
            throw ValidationException::withMessages(
                $validationErrors
            );
        }

        /*
         * Rebuild auto-filled company/contractor values from trusted
         * database records. The browser's readonly values are never
         * trusted as the source of truth.
         */
        $finalValues = $submittedValues;

        foreach ($configuredFields as $fieldId => $field) {
            if (($field['source_type'] ?? null) === 'company') {
                $finalValues[(string) $fieldId] =
                    $this->resolveCompanySourceValue(
                        $company,
                        $field['source_key'] ?? null,
                    );
            }

            if (($field['source_type'] ?? null) === 'contractor') {
                $finalValues[(string) $fieldId] =
                    $this->resolveContractorSourceValue(
                        $contractor,
                        $field['source_key'] ?? null,
                    );
            }
        }

        $form = DB::transaction(
            function () use (
                $handler,
                $ownerUserId,
                $company,
                $contractor,
                $formDefinitionId,
                $finalValues,
            ): Form {
                $form = $handler->handle(
                    new CreateFormData(
                        userId: $ownerUserId,
                        companyId: $company->id,
                        formDefinitionId: $formDefinitionId,
                        contractorId: $contractor->id,
                        status: 'completed',
                    ),
                );

                foreach ($finalValues as $fieldId => $value) {
                    $fieldId = (int) $fieldId;

                    if ($fieldId <= 0) {
                        continue;
                    }

                    FormFieldValue::updateOrCreate(
                        [
                            'form_id' => $form->id,
                            'field_id' => $fieldId,
                        ],
                        [
                            'value' => is_bool($value)
                                ? ($value ? 'true' : 'false')
                                : (
                                    $value === null
                                        ? null
                                        : (string) $value
                                ),
                        ],
                    );
                }

                return $form;
            }
        );

        /*
         * Save & Complete means the workflow is finished. Go to the
         * admin dashboard instead of reopening the create-form wizard.
         */
        return redirect()->to('/admin/dashboard')
            ->with(
                'success',
                'Tax form created successfully.'
            );
    }

    private function resolveCompanySourceValue(
        Company $company,
        ?string $sourceKey,
    ): string {
        if (!$sourceKey) {
            return '';
        }

        $value = $company->{$sourceKey} ?? '';

        return $value === null ? '' : (string) $value;
    }

    private function resolveContractorSourceValue(
        Contractor $contractor,
        ?string $sourceKey,
    ): string {
        if (!$sourceKey) {
            return '';
        }

        return match ($sourceKey) {
            'country_id' => $contractor->country_id === null
                ? ''
                : (string) $contractor->country_id,

            'region_id' => $contractor->region_id === null
                ? ''
                : (string) $contractor->region_id,

            'city_id' => $contractor->city_id === null
                ? ''
                : (string) $contractor->city_id,

            'country' => (string) (
                $contractor->country?->name ??
                ''
            ),

            'region',
            'state' => (string) (
                $contractor->region?->name ??
                ''
            ),

            'city' => (string) (
                $contractor->city?->name ??
                ''
            ),

            'business_name',
            'business_entity_name' => (string) (
                $contractor->business_entity_name ??
                ''
            ),

            'postal',
            'postal_code' => (string) (
                $contractor->postal_code ??
                ''
            ),

            default => (
                ($value = $contractor->{$sourceKey} ?? null) === null
                    ? ''
                    : (string) $value
            ),
        };
    }

    private function resolveOwnerUserId(
        Request $request,
        User $authUser,
    ): int {
        if (!$authUser->hasRole('admin')) {
            return (int) $authUser->id;
        }

        $ownerUserId = (int) $request->input('user_id');

        if ($ownerUserId <= 0) {
            throw ValidationException::withMessages([
                'user_id' => 'User selection is required.',
            ]);
        }

        $selectedUser = User::query()
            ->whereKey($ownerUserId)
            ->whereDoesntHave(
                'roles',
                function ($query) {
                    $query->where('name', 'admin');
                },
            )
            ->first();

        if ($selectedUser === null) {
            throw ValidationException::withMessages([
                'user_id' => 'Invalid user selection.',
            ]);
        }

        return (int) $selectedUser->id;
        }
}