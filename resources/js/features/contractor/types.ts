export interface Country {
    id: number;
    name: string;
    code: string;
    region_label: string;
    postal_label: string;
}

export interface CountryRegion {
    id: number;
    country_id: number;
    name: string;
    code: string | null;
    type: string | null;
}

export interface CountryCity {
    id: number;
    country_id: number;
    region_id: number;
    name: string;
    code: string | null;
}

export type TaxIdType =
    | 'TIN'
    | 'EIN'
    | 'SSN'
    | 'Unknown';

export interface Contractor {
    id: number;
    company_id: number;

    tax_id_type: TaxIdType;
    tax_id: string | null;

    first_name: string | null;
    middle_initial: string | null;
    last_name: string | null;
    suffix: string | null;
    business_entity_name: string | null;

    address_1: string;
    address_2: string | null;

    country_id: number;
    region_id: number | null;
    city_id: number | null;

    postal: string | null;

    phone: string | null;
    email: string | null;

    country?: Country;
    region?: CountryRegion | null;
    city?: CountryCity | null;

    created_at: string;
    updated_at: string;
}