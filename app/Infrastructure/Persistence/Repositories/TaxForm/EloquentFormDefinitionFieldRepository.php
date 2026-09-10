<?php

namespace App\Infrastructure\Persistence\Repositories\TaxForm;

use App\Domain\TaxForm\Repositories\FormDefinitionFieldRepositoryInterface;
use Illuminate\Support\Facades\DB;

class EloquentFormDefinitionFieldRepository implements FormDefinitionFieldRepositoryInterface
{
    public function getByFormDefinitionId(
        int $formDefinitionId
    ): array {
        return DB::table('form_definition_fields')
            ->join(
                'fields',
                'fields.id',
                '=',
                'form_definition_fields.field_id'
            )
            ->where(
                'form_definition_fields.form_definition_id',
                $formDefinitionId
            )
            ->orderBy(
                'form_definition_fields.sort_order'
            )
            ->get([
                'form_definition_fields.id',
                'form_definition_fields.form_definition_id',
                'form_definition_fields.field_id',

                'fields.field_key',
                'fields.label',
                'fields.input_type',
                'fields.source_type',
                'fields.source_key',

                'form_definition_fields.is_enabled',
                'form_definition_fields.is_required',
                'form_definition_fields.is_visible',
                'form_definition_fields.sort_order',
                'form_definition_fields.section',

                'form_definition_fields.validation_rules',
                'form_definition_fields.visibility_rules',

                'fields.validation_rules as field_validation_rules',
                'fields.options',
            ])
            ->map(function ($field) {
                return (array) $field;
            })
            ->map(function (array $field) {
                $field['is_enabled'] = (bool) $field['is_enabled'];
                $field['is_required'] = (bool) $field['is_required'];
                $field['is_visible'] = (bool) $field['is_visible'];

                $field['validation_rules'] = $field['validation_rules']
                    ? json_decode(
                        $field['validation_rules'],
                        true
                    )
                    : null;

                $field['visibility_rules'] = $field['visibility_rules']
                    ? json_decode(
                        $field['visibility_rules'],
                        true
                    )
                    : null;

                $field['field_validation_rules'] =
                    $field['field_validation_rules']
                    ? json_decode(
                        $field['field_validation_rules'],
                        true
                    )
                    : null;

                $field['options'] = $field['options']
                    ? json_decode(
                        $field['options'],
                        true
                    )
                    : null;

                return $field;
            })
            ->values()
            ->all();
    }

    public function findById(
        int $formDefinitionId,
        int $formDefinitionFieldId
    ): ?object {
        $field = DB::table('form_definition_fields')
            ->join(
                'fields',
                'fields.id',
                '=',
                'form_definition_fields.field_id'
            )
            ->where(
                'form_definition_fields.form_definition_id',
                $formDefinitionId
            )
            ->where(
                'form_definition_fields.id',
                $formDefinitionFieldId
            )
            ->first([
                'form_definition_fields.id',
                'form_definition_fields.form_definition_id',
                'form_definition_fields.field_id',

                'fields.field_key',
                'fields.label',
                'fields.input_type',
                'fields.source_type',
                'fields.source_key',

                'form_definition_fields.is_enabled',
                'form_definition_fields.is_required',
                'form_definition_fields.is_visible',
                'form_definition_fields.sort_order',
                'form_definition_fields.section',

                'form_definition_fields.validation_rules',
                'form_definition_fields.visibility_rules',

                'fields.options',
            ]);

        if ($field === null) {
            return null;
        }

        $field->is_enabled = (bool) $field->is_enabled;
        $field->is_required = (bool) $field->is_required;
        $field->is_visible = (bool) $field->is_visible;

        $field->validation_rules = $field->validation_rules
            ? json_decode(
                $field->validation_rules,
                true
            )
            : null;

        $field->visibility_rules = $field->visibility_rules
            ? json_decode(
                $field->visibility_rules,
                true
            )
            : null;

        $field->options = $field->options
            ? json_decode(
                $field->options,
                true
            )
            : null;

        return $field;
    }

    public function updateConfiguration(
        int $formDefinitionId,
        int $formDefinitionFieldId,
        array $data
    ): object {
        $isEnabled = (bool) $data['is_enabled'];

        DB::table('form_definition_fields')
            ->where(
                'form_definition_id',
                $formDefinitionId
            )
            ->where(
                'id',
                $formDefinitionFieldId
            )
            ->update([
                'is_enabled' => $isEnabled,

                /*
                 * A disabled field can never be required.
                 */
                'is_required' => $isEnabled
                    ? (bool) $data['is_required']
                    : false,

                /*
                 * Existing order and section remain untouched
                 * by the new UI.
                 */
                'sort_order' => $data['sort_order'],
                'section' => $data['section'],

                'updated_at' => now(),
            ]);

        return $this->findById(
            $formDefinitionId,
            $formDefinitionFieldId
        );
    }
}