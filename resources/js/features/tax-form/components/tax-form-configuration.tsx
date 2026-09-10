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

interface FieldConfiguration {
    is_enabled: boolean;
    is_required: boolean;
}

export function TaxFormConfiguration({
    formDefinitionId,
    fields,
}: TaxFormConfigurationProps) {
    const [fieldValues, setFieldValues] = useState<
        Record<number, FieldConfiguration>
    >(() =>
        Object.fromEntries(
            fields.map((field) => [
                field.id,
                {
                    is_enabled: field.is_enabled,
                    is_required: field.is_enabled
                        ? field.is_required
                        : false,
                },
            ]),
        ),
    );

    const updateField = (
        fieldId: number,
        key: 'is_enabled' | 'is_required',
        value: boolean,
    ) => {
        setFieldValues((current) => {
            const currentField = current[fieldId];

            if (!currentField) {
                return current;
            }

            /*
             * When Enabled is turned OFF:
             * - Required is automatically turned OFF.
             * - Required becomes disabled in the UI.
             */
            if (
                key === 'is_enabled' &&
                value === false
            ) {
                return {
                    ...current,
                    [fieldId]: {
                        is_enabled: false,
                        is_required: false,
                    },
                };
            }

            return {
                ...current,
                [fieldId]: {
                    ...currentField,
                    [key]: value,
                },
            };
        });
    };

    const saveField = (field: FormField) => {
        const values = fieldValues[field.id];

        if (!values) {
            return;
        }

        /*
         * Required can never be TRUE when the field
         * itself is disabled.
         */
        const isRequired =
            values.is_enabled &&
            values.is_required;

        router.put(
            `/admin/tax-forms/${formDefinitionId}/configuration/${field.id}`,
            {
                is_enabled: values.is_enabled,
                is_required: isRequired,

                /*
                 * Keep existing backend values for these
                 * fields even though they are no longer
                 * editable from the UI.
                 */
                sort_order: field.sort_order,
                section: field.section || null,

                /*
                 * Existing validation configuration is
                 * preserved.
                 */
                validation_rules:
                    field.validation_rules,
                visibility_rules:
                    field.visibility_rules,
            },
            {
                preserveScroll: true,
            },
        );
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
                                    Enable or disable fields and mark
                                    enabled fields as required.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-card">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[320px]">
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

                                        <TableHead className="w-[100px] text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {fields
                                        .slice()
                                        .sort(
                                            (a, b) =>
                                                a.sort_order -
                                                b.sort_order,
                                        )
                                        .map((field) => {
                                            const values =
                                                fieldValues[field.id];

                                            if (!values) {
                                                return null;
                                            }

                                            const requiredDisabled =
                                                !values.is_enabled;

                                            return (
                                                <TableRow
                                                    key={field.id}
                                                >
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
                                                            aria-disabled={
                                                                requiredDisabled
                                                            }
                                                            disabled={
                                                                requiredDisabled
                                                            }
                                                            onClick={() =>
                                                                updateField(
                                                                    field.id,
                                                                    'is_required',
                                                                    !values.is_required,
                                                                )
                                                            }
                                                            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                                                requiredDisabled
                                                                    ? 'cursor-not-allowed bg-muted opacity-50'
                                                                    : 'cursor-pointer'
                                                            } ${
                                                                values.is_required &&
                                                                !requiredDisabled
                                                                    ? 'bg-primary'
                                                                    : 'bg-muted'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                                                                    values.is_required &&
                                                                    !requiredDisabled
                                                                        ? 'translate-x-5'
                                                                        : 'translate-x-0'
                                                                }`}
                                                            />
                                                        </button>
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
                </div>
            </Main>
        </>
    );
}