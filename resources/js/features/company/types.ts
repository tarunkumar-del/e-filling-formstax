export interface Company {
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

    created_at: string;
    updated_at: string;
}