import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Building2,
    ChevronDown,
    ChevronRight,
    Edit,
    FileText,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';

import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type AnyRecord = Record<string, any>;

type ViewFormProps = {
    form: {
        id: number;
        user_id: number;
        company_id: number;
        contractor_id: number | null;
        form_definition_id: number;
        status: string;
        created_at: string | null;
        updated_at: string | null;
        user?: AnyRecord | null;
        company?: AnyRecord | null;
        contractor?: AnyRecord | null;
    };
    form_definition: AnyRecord;
    fields: AnyRecord[];
    field_values: Record<string, unknown>;
    isAdmin?: boolean;
};

function textValue(value: unknown): string {
    if (
        value === null ||
        value === undefined ||
        value === ''
    ) {
        return '—';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    if (Array.isArray(value)) {
        return value.join(', ');
    }

    return String(value);
}

function getFormType(
    definition: AnyRecord,
): string {
    return String(
        definition.form_type_name ??
            definition.form_type?.name ??
            definition.name ??
            'Tax Form',
    );
}

function getTaxYear(
    definition: AnyRecord,
): string {
    return textValue(definition.tax_year);
}

function getFieldValue(
    field: AnyRecord,
    fieldValues: Record<string, unknown>,
): unknown {
    const id =
        field.id ??
        field.field_id;

    if (
        id !== undefined &&
        fieldValues[String(id)] !== undefined
    ) {
        return fieldValues[String(id)];
    }

    return null;
}

function getFieldLabel(
    field: AnyRecord,
): string {
    return String(
        field.label ??
            field.field_label ??
            field.name ??
            field.field_key ??
            'Field',
    );
}

function getSectionName(
    field: AnyRecord,
): string {
    return String(
        field.section_name ??
            field.section ??
            field.section_title ??
            'Tax Information',
    );
}

function groupFields(
    fields: AnyRecord[],
): Array<[string, AnyRecord[]]> {
    const groups = new Map<
        string,
        AnyRecord[]
    >();

    fields.forEach((field) => {
        const section =
            getSectionName(field);

        if (!groups.has(section)) {
            groups.set(section, []);
        }

        groups
            .get(section)!
            .push(field);
    });

    return Array.from(
        groups.entries(),
    );
}

function getCompanyFields(
    company: AnyRecord | null | undefined,
): Array<[string, unknown]> {
    if (!company) {
        return [];
    }

    return [
        [
            'Company Tax ID',
            company.tax_id,
        ],
        [
            "Company's first name",
            company.payer_first_name ??
                company.first_name,
        ],
        [
            "Company's last name",
            company.payer_last_name ??
                company.last_name,
        ],
        [
            "Company's business or entity name",
            company.business_entity_name ??
                company.name,
        ],
        [
            'Company street address 1',
            company.address_1 ??
                company.street_address_1,
        ],
        [
            'Company street address 2',
            company.address_2 ??
                company.street_address_2,
        ],
        [
            'Company city or town',
            company.city ??
                company.city_or_town,
        ],
        [
            'Company state or province',
            company.state ??
                company.state_or_province,
        ],
        [
            'Company ZIP or foreign postal code',
            company.postal_code ??
                company.zip_or_foreign_postal_code,
        ],
        [
            'Company telephone no.',
            company.telephone ??
                company.telephone_no ??
                company.phone,
        ],
        [
            'Company email',
            company.email,
        ],
        [
            "Company's contact name",
            company.contact_name,
        ],
        [
            'Company country',
            company.country?.name ??
                company.country_name ??
                company.country_id,
        ],
    ].filter(
        ([, value]) =>
            value !== undefined,
    );
}

function getContractorFields(
    contractor: AnyRecord | null | undefined,
): Array<[string, unknown]> {
    if (!contractor) {
        return [];
    }

    return [
        [
            'Contractor Tax ID',
            contractor.tax_id,
        ],
        [
            "Contractor's first name",
            contractor.first_name,
        ],
        [
            "Contractor's middle initial",
            contractor.middle_initial,
        ],
        [
            "Contractor's last name",
            contractor.last_name,
        ],
        [
            "Contractor's suffix",
            contractor.suffix,
        ],
        [
            "Contractor's business or entity name",
            contractor.business_entity_name,
        ],
        [
            'Contractor street address 1',
            contractor.address_1 ??
                contractor.street_address_1,
        ],
        [
            'Contractor street address 2',
            contractor.address_2 ??
                contractor.street_address_2,
        ],
        [
            'Contractor city or town',
            contractor.city?.name ??
                contractor.city ??
                contractor.city_id,
        ],
        [
            'Contractor state or province',
            contractor.region?.name ??
                contractor.state ??
                contractor.state_or_province ??
                contractor.region_id,
        ],
        [
            'Contractor country',
            contractor.country?.name ??
                contractor.country_name ??
                contractor.country_id,
        ],
        [
            'Contractor ZIP or foreign postal code',
            contractor.postal_code ??
                contractor.zip_or_foreign_postal_code,
        ],
        [
            'Contractor telephone no.',
            contractor.telephone ??
                contractor.telephone_no ??
                contractor.phone,
        ],
        [
            'Contractor email',
            contractor.email,
        ],
    ].filter(
        ([, value]) =>
            value !== undefined,
    );
}

function formatDate(
    value: string | null,
): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString();
}

function ReadOnlyField({
    label,
    value,
}: {
    label: string;
    value: unknown;
}) {
    return (
        <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <div className="min-h-9 rounded-md border border-input bg-background px-3 py-2 text-sm">
                {textValue(value)}
            </div>
        </div>
    );
}

function Section({
    name,
    fields,
    fieldValues,
    open,
    onToggle,
}: {
    name: string;
    fields: AnyRecord[];
    fieldValues: Record<string, unknown>;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="overflow-hidden rounded-lg border bg-card">
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium transition-colors hover:bg-muted/40"
            >
                <span className="flex items-center gap-2">
                    {open ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}

                    <span className="capitalize">
                        {name}
                    </span>
                </span>

                <span className="text-xs text-muted-foreground">
                    {fields.length}{' '}
                    {fields.length === 1
                        ? 'field'
                        : 'fields'}
                </span>
            </button>

            {open && (
                <div className="grid gap-x-6 gap-y-5 border-t px-4 py-5 md:grid-cols-2">
                    {fields.map((field) => (
                        <ReadOnlyField
                            key={String(
                                field.id ??
                                    field.field_id ??
                                    field.field_key,
                            )}
                            label={getFieldLabel(
                                field,
                            )}
                            value={getFieldValue(
                                field,
                                fieldValues,
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ViewTaxForm({
    form,
    form_definition,
    fields,
    field_values,
    isAdmin = false,
}: ViewFormProps) {
    const formType =
        getFormType(form_definition);

    const taxYear =
        getTaxYear(form_definition);

    const backUrl = isAdmin
        ? '/admin/forms'
        : '/tax-forms';

    const editUrl = isAdmin
        ? `/admin/tax-forms/create/${form.form_definition_id}?form_id=${form.id}&user_id=${form.user_id}`
        : `/tax-forms/create/${form.form_definition_id}?form_id=${form.id}`;

    const sections =
        groupFields(fields);

    const companyFields =
        getCompanyFields(form.company);

    const contractorFields =
        getContractorFields(
            form.contractor,
        );

    const [openSections, setOpenSections] =
        useState<
            Record<string, boolean>
        >(() => {
            const initial: Record<
                string,
                boolean
            > = {};

            sections.forEach(
                ([sectionName]) => {
                    initial[sectionName] = true;
                },
            );

            return initial;
        });

    const toggleSection = (
        sectionName: string,
    ) => {
        setOpenSections(
            (current) => ({
                ...current,
                [sectionName]:
                    !(
                        current[
                            sectionName
                        ] ?? true
                    ),
            }),
        );
    };

    return (
        <>
            <Head
                title={`View ${formType}`}
            />

            {/* =====================================================
                TOP NAVBAR
            ====================================================== */}

            <Header>
                <Search />

                <div className="ms-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    {/* <ConfigDrawer /> */}
                    <ProfileDropdown />
                </div>
            </Header>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <Main>
                <div className="space-y-6">
                    {/* PAGE HEADER */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">
                                View {formType}
                            </h2>

                            <p className="text-muted-foreground">
                                Tax Year {taxYear}
                                {' · '}
                                Form #{form.id}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <Link
                                    href={
                                        backUrl
                                    }
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>

                            <Button
                                size="sm"
                                asChild
                            >
                                <Link
                                    href={
                                        editUrl
                                    }
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* FORM SUMMARY */}

                    <Card>
                        <CardContent className="p-5">
                            <div className="grid gap-6 md:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Form Type
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {formType}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Tax Year{' '}
                                        {taxYear}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Company
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {textValue(
                                            form
                                                .company
                                                ?.business_entity_name ??
                                                form
                                                    .company
                                                    ?.name,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Contractor
                                    </p>

                                    <p className="mt-1 text-sm font-medium">
                                        {form.contractor
                                            ? [
                                                  form
                                                      .contractor
                                                      .first_name,
                                                  form
                                                      .contractor
                                                      .last_name,
                                              ]
                                                  .filter(
                                                      Boolean,
                                                  )
                                                  .join(
                                                      ' ',
                                                  ) ||
                                              textValue(
                                                  form
                                                      .contractor
                                                      .business_entity_name,
                                              )
                                            : '—'}
                                    </p>
                                </div>

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Created
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            {formatDate(
                                                form.created_at,
                                            )}
                                        </p>
                                    </div>

                                    <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                                        {
                                            form.status
                                        }
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* COMPANY */}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Company
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Company information associated with this tax form.
                            </p>
                        </CardHeader>

                        <CardContent className="grid gap-x-6 gap-y-5 border-t p-5 md:grid-cols-2">
                            {companyFields.length >
                            0 ? (
                                companyFields.map(
                                    ([
                                        label,
                                        value,
                                    ]) => (
                                        <ReadOnlyField
                                            key={
                                                label
                                            }
                                            label={
                                                label
                                            }
                                            value={
                                                value
                                            }
                                        />
                                    ),
                                )
                            ) : (
                                <div className="md:col-span-2 rounded-md border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                                    No company information available.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* CONTRACTOR */}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserRound className="h-4 w-4" />
                                Contractor
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Contractor information associated with this tax form.
                            </p>
                        </CardHeader>

                        <CardContent className="grid gap-x-6 gap-y-5 border-t p-5 md:grid-cols-2">
                            {contractorFields.length >
                            0 ? (
                                contractorFields.map(
                                    ([
                                        label,
                                        value,
                                    ]) => (
                                        <ReadOnlyField
                                            key={
                                                label
                                            }
                                            label={
                                                label
                                            }
                                            value={
                                                value
                                            }
                                        />
                                    ),
                                )
                            ) : (
                                <div className="md:col-span-2 rounded-md border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                                    No contractor information available.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ADMIN OWNER */}

                    {isAdmin &&
                        form.user && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Form Owner
                                    </CardTitle>

                                    <p className="text-sm text-muted-foreground">
                                        User for whom this tax form was created.
                                    </p>
                                </CardHeader>

                                <CardContent className="grid gap-x-6 gap-y-5 border-t p-5 md:grid-cols-2">
                                    <ReadOnlyField
                                        label="Name"
                                        value={
                                            form
                                                .user
                                                .name
                                        }
                                    />

                                    <ReadOnlyField
                                        label="Email"
                                        value={
                                            form
                                                .user
                                                .email
                                        }
                                    />
                                </CardContent>
                            </Card>
                        )}

                    {/* FORM DETAILS */}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <FileText className="h-4 w-4" />
                                Form Details
                            </CardTitle>

                            <p className="text-sm text-muted-foreground">
                                Saved tax information for this form.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4 border-t p-5">
                            {sections.length ===
                            0 ? (
                                <div className="rounded-md border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                                    No form fields are configured for this tax form.
                                </div>
                            ) : (
                                sections.map(
                                    ([
                                        sectionName,
                                        sectionFields,
                                    ]) => (
                                        <Section
                                            key={
                                                sectionName
                                            }
                                            name={
                                                sectionName
                                            }
                                            fields={
                                                sectionFields
                                            }
                                            fieldValues={
                                                field_values
                                            }
                                            open={
                                                openSections[
                                                    sectionName
                                                ] ??
                                                true
                                            }
                                            onToggle={() =>
                                                toggleSection(
                                                    sectionName,
                                                )
                                            }
                                        />
                                    ),
                                )
                            )}
                        </CardContent>
                    </Card>

                    {/* FOOTER ACTIONS */}

                    <div className="flex items-center justify-between pb-6">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link
                                href={
                                    backUrl
                                }
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Tax Forms
                            </Link>
                        </Button>

                        <Button
                            size="sm"
                            asChild
                        >
                            <Link
                                href={
                                    editUrl
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Form
                            </Link>
                        </Button>
                    </div>
                </div>
            </Main>
        </>
    );
}