export interface FormField {
    id: number;
    form_definition_id: number;
    field_id: number;

    field_key: string;
    label: string;
    input_type: string;

    source_type: string;
    source_key: string | null;

    is_enabled: boolean;
    is_required: boolean;

    sort_order: number;
    section: string | null;

    validation_rules: Record<string, unknown> | null;
    visibility_rules: Record<string, unknown> | null;

    options: unknown[] | null;
}