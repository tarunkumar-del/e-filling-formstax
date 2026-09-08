import { Building2 } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import type { CreateFormCompany } from '../../types';

interface CompanyDetailsProps {
    company: CreateFormCompany;
}

export function CompanyDetails({
    company,
}: CompanyDetailsProps) {
    const businessName =
        company.business_entity_name ||
        `${company.payer_first_name} ${company.payer_last_name}`;

    const address = [
        company.address_1,
        company.address_2,
        company.city,
        company.state,
        company.zip_code,
    ]
        .filter(Boolean)
        .join(', ');

    return (
        <div className="rounded-xl border bg-muted/20">
            <div className="flex items-center gap-3 p-5">
                <div className="flex size-9 items-center justify-center rounded-lg border bg-background">
                    <Building2 className="size-4 text-muted-foreground" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold">
                        Company Details
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        Selected company information
                    </p>
                </div>
            </div>

            <Separator />

            <div className="grid gap-5 p-5 sm:grid-cols-2">
                <Detail
                    label="Business Name"
                    value={businessName}
                />

                <Detail
                    label="Tax ID"
                    value={company.tax_id}
                />

                <Detail
                    label="Contact Name"
                    value={company.payer_contact_name}
                />

                <Detail
                    label="Email"
                    value={company.email}
                />

                <Detail
                    label="Phone"
                    value={company.phone}
                />

                <Detail
                    label="Address"
                    value={address}
                />
            </div>
        </div>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>

            <p className="text-sm">
                {value || '—'}
            </p>
        </div>
    );
}