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

export interface CreateFormDefinition {
    id: number;
    form_type_id: number;
    tax_year: number;
    name: string;
    is_active: boolean;
}

export interface CreateFormOption {
    id: number;
    form_type_id: number;
    form_type: string;
    form_type_name: string;
    tax_year: number;
    name: string;
    is_active: boolean;
    create_url: string;
}

export interface CreateFormUser {
    id: number;
    name: string;
    email: string;
}

export interface CreateFormCompany {
    id: number;
    user_id: number;
    tax_id_type: 'TIN' | 'EIN' | 'SSN';
    tax_id: string;
    payer_first_name: string;
    payer_last_name: string;
    business_entity_name: string;
    address_1: string;
    address_2: string | null;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
    payer_contact_name: string;
}
export interface CreateFormContractor {
    id: number;
    company_id: number;

    tax_id_type: 'TIN' | 'EIN' | 'SSN' | 'Unknown';
    tax_id: string;

    first_name: string;
    last_name: string;

    address_1: string;
    address_2: string | null;

    country_id: number | null;
    region_id: number | null;
    city_id: number | null;

    country?: {
        id: number;
        name: string;
        code?: string | null;
    } | null;

    region?: {
        id: number;
        name: string;
        code?: string | null;
    } | null;

    city?: {
        id: number;
        name: string;
        code?: string | null;
    } | null;

    postal_code: string | null;

    phone: string | null;
    email: string | null;