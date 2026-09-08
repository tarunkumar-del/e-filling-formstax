import { router } from '@inertiajs/react';
import {
    Edit,
    FileText,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface CreatedTaxForm {
    id: number;
    user_id: number;
    company_id: number;
    contractor_id: number | null;
    form_definition_id: number;
    status: string;
    created_at: string;
    updated_at: string;

    user?: {
        id: number;
        name: string;
        email: string;
    } | null;

    company?: {
        id: number;
        business_entity_name: string;
    } | null;

    contractor?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;

    form_definition?: {
        id: number;
        form_type_id: number;
        tax_year: number;
        name: string;
        form_type?: {
            id: number;
            name: string;
        } | null;
    } | null;

    form_type_id?: number;
    tax_year?: number;
    form_definition_name?: string;
    form_type_name?: string;
}

interface CreatedTaxFormListProps {
    forms: CreatedTaxForm[];
    isAdmin?: boolean;
}

function getContractorName(
    contractor: CreatedTaxForm['contractor'],
): string {
    if (!contractor) {
        return '—';
    }

    return [
        contractor.first_name,
        contractor.last_name,
    ]
        .filter(Boolean)
        .join(' ');
}

function getFormType(
    form: CreatedTaxForm,
): string {
    return (
        form.form_type_name ??
        form.form_definition?.form_type?.name ??
        form.form_definition_name ??
        form.form_definition?.name ??
        'Tax Form'
    );
}

function getTaxYear(
    form: CreatedTaxForm,
): number | string {
    return (
        form.tax_year ??
        form.form_definition?.tax_year ??
        '—'
    );
}

function formatDate(
    date: string,
): string {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '—';
    }

    return parsedDate.toLocaleDateString();
}

export function CreatedTaxFormList({
    forms,
    isAdmin = false,
}: CreatedTaxFormListProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [selectedFormId, setSelectedFormId] =
        useState<number | null>(null);

    const handleDeleteClick = (
        formId: number,
    ): void => {
        setSelectedFormId(formId);
        setDeleteDialogOpen(true);
    };

    const handleDelete = (): void => {
        if (selectedFormId === null) {
            return;
        }

        const deleteUrl = isAdmin
            ? `/admin/forms/${selectedFormId}`
            : `/tax-forms/${selectedFormId}`;

        router.delete(deleteUrl, {
            preserveScroll: true,

            onFinish: () => {
                setDeleteDialogOpen(false);
                setSelectedFormId(null);
            },
        });
    };

    const handleEdit = (
        form: CreatedTaxForm,
    ): void => {
        const editBaseUrl = isAdmin
            ? `/admin/tax-forms/create/${form.form_definition_id}`
            : `/tax-forms/create/${form.form_definition_id}`;

        window.location.href =
            `${editBaseUrl}?form_id=${form.id}`;
    };

    if (forms.length === 0) {
        return (
            <>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="mb-4 h-10 w-10 text-muted-foreground" />

                        <h3 className="text-lg font-semibold">
                            No tax forms found
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {isAdmin
                                ? 'No tax forms have been created yet.'
                                : 'You have not created any tax forms yet.'}
                        </p>
                    </CardContent>
                </Card>

                <ConfirmDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    title="Delete tax form"
                    desc="Are you sure you want to delete this tax form? This action cannot be undone."
                    confirmText="Delete"
                    destructive
                    handleConfirm={handleDelete}
                    className="sm:max-w-sm"
                />
            </>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {forms.map((form) => {
                    const formType =
                        getFormType(form);

                    const taxYear =
                        getTaxYear(form);

                    const contractorName =
                        getContractorName(
                            form.contractor,
                        );

                    return (
                        <Card key={form.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>
                                            {formType}
                                        </CardTitle>

                                        <CardDescription>
                                            Tax Year{' '}
                                            {taxYear}
                                        </CardDescription>
                                    </div>

                                    <div className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                                        {form.status}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div
                                    className={
                                        isAdmin
                                            ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-4'
                                            : 'grid gap-4 md:grid-cols-3'
                                    }
                                >
                                    {isAdmin && (
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                User
                                            </p>

                                            <p className="mt-1 text-sm font-medium">
                                                {form.user
                                                    ?.name ??
                                                    '—'}
                                            </p>

                                            {form.user
                                                ?.email && (
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {
                                                        form
                                                            .user
                                                            .email
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Company
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            {form.company
                                                ?.business_entity_name ??
                                                '—'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Contractor
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            {contractorName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Created
                                        </p>

                                        <p className="mt-1 text-sm">
                                            {formatDate(
                                                form.created_at,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            handleEdit(
                                                form,
                                            )
                                        }
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            handleDeleteClick(
                                                form.id,
                                            )
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);

                    if (!open) {
                        setSelectedFormId(null);
                    }
                }}
                title="Delete tax form"
                desc="Are you sure you want to delete this tax form? This action cannot be undone."
                confirmText="Delete"
                destructive
                handleConfirm={handleDelete}
                className="sm:max-w-sm"
            />
        </>
    );
}