import { usePage } from '@inertiajs/react';

import { CompanyFeature } from '@/features/company';
import { type Company } from '@/features/company/types';

interface PageProps extends Record<string, unknown> {
    companies: Company[];

    companyStoreUrl: string;
    companyUpdateBaseUrl: string;
    companyViewBaseUrl: string;
}

export default function CompaniesPage() {
    const {
        companies,
        companyStoreUrl,
        companyUpdateBaseUrl,
        companyViewBaseUrl,
    } = usePage<PageProps>().props;

    return (
        <CompanyFeature
            companies={companies}
            storeUrl={companyStoreUrl}
            updateBaseUrl={companyUpdateBaseUrl}
            viewBaseUrl={companyViewBaseUrl}
        />
    );
}