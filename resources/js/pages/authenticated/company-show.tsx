import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

interface CompanyShowProps {
    company: Company;
    contractors: Contractor[];
    backUrl: string;
    isAdmin: boolean;
}

export default function CompanyShow({
    company,
    contractors,
    backUrl,
    isAdmin,
}: CompanyShowProps) {
    const payerName = [
        company.payer_first_name,
        company.payer_last_name,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <Head title={company.business_entity_name} />

            <div className="space-y-6 p-6">
                {/* =====================================================
                    HEADER
                ===================================================== */}

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
                                Back to Companies
                            </Link>
                        </Button>

                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                                <Building2 className="size-6" />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {company.business_entity_name}
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    Company #{company.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    COMPANY INFORMATION
                ===================================================== */}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Payer Details */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Payer Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Payer Name
                                </p>

                                <p className="font-medium">
                                    {payerName || '—'}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Payer Contact
                                </p>

                                <p className="font-medium">
                                    {company.payer_contact_name ||
                                        '—'}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tax ID Type
                                </p>

                                <p className="font-medium">
                                    {company.tax_id_type}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tax ID
                                </p>

                                <p className="font-medium">
                                    {company.tax_id}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Contact Information
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-5">
                            <div className="flex gap-3">
                                <Building2 className="mt-0.5 size-4 text-muted-foreground" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Business Entity
                                    </p>

                                    <p className="font-medium">
                                        {company.business_entity_name}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-3">
                                <Phone className="mt-0.5 size-4 text-muted-foreground" />

                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Phone
                                    </p>

                                    <p className="font-medium">
                                        {company.phone}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-3">
                                <Mail className="mt-0.5 size-4 text-muted-foreground" />

                                <div className="min-w-0">
                                    <p className="text-sm text-muted-foreground">
                                        Email
                                    </p>

                                    <p className="truncate font-medium">
                                        {company.email}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Address
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {company.address_1}
                                    </p>

                                    {company.address_2 && (
                                        <p className="text-muted-foreground">
                                            {company.address_2}
                                        </p>
                                    )}

                                    <p className="text-muted-foreground">
                                        {company.city},{' '}
                                        {company.state}
                                    </p>

                                    <p className="text-muted-foreground">
                                        {company.country},{' '}
                                        {company.zip_code}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* =====================================================
                    CONTRACTORS
                ===================================================== */}

                <Card>
                    <CardContent className="pt-6">
                        <ContractorTable
                            companyId={company.id}
                            contractors={contractors}
                            isAdmin={isAdmin}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}