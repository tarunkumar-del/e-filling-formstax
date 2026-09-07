import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { useState } from 'react';

import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import type { FormField } from '../types';

interface TaxFormConfigurationProps {
    formDefinitionId: number;
    fields: FormField[];
}

export function TaxFormConfiguration({
    formDefinitionId,
    fields,
}: TaxFormConfigurationProps) {
    const [fieldValues, setFieldValues] = useState<
        Record<
            number,
            {
                is_enabled: boolean;
                is_required: boolean;
                sort_order: number;
                section: string;
            }
        >
    >(() =>
        Object.fromEntries(
            fields.map((field) => [
                field.id,
                {
                    is_enabled: field.is_enabled,
                    is_required: field.is_required,
                    sort_order: field.sort_order,
                    section: field.section ?? '',
                },
            ]),
        ),
    );

    const updateField = (
        fieldId: number,
        key: 'is_enabled' | 'is_required' | 'sort_order' | 'section',
        value: boolean | number | string,
    ) => {
        setFieldValues((current) => ({
            ...current,
            [fieldId]: {
                ...current[fieldId],
                [key]: value,
            },
        }));
    };

    const saveField = (field: FormField) => {
        const values = fieldValues[field.id];

        router.put(
            `/admin/tax-forms/${formDefinitionId}/configuration/${field.id}`,
            {
                is_enabled: values.is_enabled,
                is_required: values.is_required,
                sort_order: values.sort_order,
                section: values.section || null,

                // These are intentionally not configured
                // from the current UI.
                validation_rules: field.validation_rules,
                visibility_rules: field.visibility_rules,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const getSectionLabel = (section: string) => {
        if (!section) {
            return '—';
        }

        return section.charAt(0).toUpperCase() + section.slice(1);
    };

    return (
        <>
            <Header>
                <Search />

                <div className="ms-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className="mb-6 flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                    >
                        <Link href="/admin/tax-forms">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">
                                Back to Tax Forms
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Manage Form Fields
                        </h2>

                        <p className="text-muted-foreground">
                            Configure the fields used on this tax form.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-5">
                        <div className="flex items-start gap-3">
                            <div className="rounded-md border p-2">
                                <Settings2 className="h-4 w-4" />
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    Field Configuration
                                </h3>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Enable or disable fields, mark fields as
                                    required, and control their order and
                                    section.
                                </p>
                            </div>
                        </div>
                    </div>

                    {Object.entries(
                        fields.reduce<Record<string, FormField[]>>(
                            (groups, field) => {
                                const section = field.section || 'other';

                                if (!groups[section]) {
                                    groups[section] = [];
                                }

                                groups[section].push(field);

                                return groups;
                            },
                            {},
                        ),
                    ).map(([section, sectionFields]) => (
                        <div
                            key={section}
                            className="overflow-hidden rounded-lg border bg-card"
                        >
                            <div className="border-b px-5 py-4">
                                <h3 className="font-semibold">
                                    {getSectionLabel(section)}
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    {sectionFields.length}{' '}
                                    {sectionFields.length === 1
                                        ? 'field'
                                        : 'fields'}
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[280px]">
                                                Field
                                            </TableHead>

                                            <TableHead>
                                                Type
                                            </TableHead>

                                            <TableHead className="text-center">
                                                Enabled
                                            </TableHead>

                                            <TableHead className="text-center">
                                                Required
                                            </TableHead>

                                            <TableHead className="w-[110px]">
                                                Order
                                            </TableHead>

                                            <TableHead className="min-w-[150px]">
                                                Section
                                            </TableHead>

                                            <TableHead className="w-[100px] text-right">
                                                Action
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {sectionFields
                                            .sort(
                                                (a, b) =>
                                                    a.sort_order -
                                                    b.sort_order,
                                            )
                                            .map((field) => {
                                                const values =
                                                    fieldValues[field.id];

                                                return (
                                                    <TableRow key={field.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">
                                                                    {
                                                                        field.label
                                                                    }
                                                                </div>

                                                                <div className="mt-1 text-xs text-muted-foreground">
                                                                    {
                                                                        field.field_key
                                                                    }
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <span className="text-sm">
                                                                {
                                                                    field.input_type
                                                                }
                                                            </span>
                                                        </TableCell>

                                                        <TableCell className="text-center">
                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={
                                                                    values.is_enabled
                                                                }
                                                                onClick={() =>
                                                                    updateField(
                                                                        field.id,
                                                                        'is_enabled',
                                                                        !values.is_enabled,
                                                                    )
                                                                }
                                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                                                    values.is_enabled
                                                                        ? 'bg-primary'
                                                                        : 'bg-muted'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                                                                        values.is_enabled
                                                                            ? 'translate-x-5'
                                                                            : 'translate-x-0'
                                                                    }`}
                                                                />
                                                            </button>
                                                        </TableCell>

                                                        <TableCell className="text-center">
                                                            <button
                                                                type="button"
                                                                role="switch"
                                                                aria-checked={
                                                                    values.is_required
                                                                }
                                                                onClick={() =>
                                                                    updateField(
                                                                        field.id,
                                                                        'is_required',
                                                                        !values.is_required,
                                                                    )
                                                                }
                                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                                                    values.is_required
                                                                        ? 'bg-primary'
                                                                        : 'bg-muted'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                                                                        values.is_required
                                                                            ? 'translate-x-5'
                                                                            : 'translate-x-0'
                                                                    }`}
                                                                />
                                                            </button>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                value={
                                                                    values.sort_order
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateField(
                                                                        field.id,
                                                                        'sort_order',
                                                                        Number(
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                                className="h-9"
                                                            />
                                                        </TableCell>

                                                        <TableCell>
                                                            <Input
                                                                value={
                                                                    values.section
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateField(
                                                                        field.id,
                                                                        'section',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="h-9"
                                                            />
                                                        </TableCell>

                                                        <TableCell className="text-right">
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={() =>
                                                                    saveField(
                                                                        field,
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ))}
                </div>
            </Main>
        </>
    );
}