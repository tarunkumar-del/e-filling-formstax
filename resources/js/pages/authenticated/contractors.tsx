import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    ContractorTable,
    type Contractor,
} from '@/features/contractor';

interface Company {
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

interface ContractorsPageProps {
    company: Company;
    contractors: Contractor[];
}

export default function Contractors({
    company,
    contractors,
}: ContractorsPageProps) {
    const searchParams = new URLSearchParams(
        window.location.search,
    );

    const returnTo = searchParams.get('return_to');

    const backUrl =
        returnTo ??
        (company
            ? `/admin/companies/${company.id}`
            : '/admin/companies');

    return (
        <>
            <Head title={`Contractors - ${company.business_entity_name}`} />

            <div className="space-y-6 p-6">
                {/* =========================================================
                    HEADER
                ========================================================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="-ml-2"
                        >
                            <Link href={backUrl}>
                                <ArrowLeft className="mr-2 size-4" />
                                Back
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                                <Building2 className="size-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Contractors
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    {company.business_entity_name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    CONTRACTORS
                ========================================================= */}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Manage Contractors
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ContractorTable
                            companyId={company.id}
                            contractors={contractors}
                            isAdmin={true}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}