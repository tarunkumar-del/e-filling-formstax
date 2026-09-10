import { router, usePage } from '@inertiajs/react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { UserSelectorDialog } from '@/features/tax-form/components/create-form/user-selector-dialog';
import type { CreateFormUser } from '@/features/tax-form/types';

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';

interface FormOption {
    id: number;
    form_type_id: number;
    form_type: string;
    form_type_name: string;
    tax_year: number;
    name: string;
    is_active: boolean;
    create_url: string;
}

interface CreateFormOptionsResponse {
    default_year: number | null;
    selected_year: number | null;
    years: number[];
    forms: FormOption[];
}

interface CreateFormSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    roles?: string[];
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
}

export function CreateFormSelector({
    open,
    onOpenChange,
}: CreateFormSelectorProps) {
    const { auth } = usePage<PageProps>().props;

    const isAdmin =
        auth?.user?.roles?.includes('admin') ?? false;

    const [data, setData] =
        useState<CreateFormOptionsResponse | null>(null);

    const [year, setYear] =
        useState<number | null>(null);

    const [search, setSearch] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    /*
     |--------------------------------------------------------------------------
     | Admin User Selection
     |--------------------------------------------------------------------------
     */

    const [userSelectorOpen, setUserSelectorOpen] =
        useState(false);

    const [selectedFormId, setSelectedFormId] =
        useState<number | null>(null);

    /*
     |--------------------------------------------------------------------------
     | Load Forms
     |--------------------------------------------------------------------------
     */

    const loadForms = async (
        selectedYear?: number | null,
        searchValue?: string,
    ) => {
        setLoading(true);
        setError(null);

        try {
            const params =
                new URLSearchParams();

            if (selectedYear) {
                params.set(
                    'year',
                    String(selectedYear),
                );
            }

            if (searchValue?.trim()) {
                params.set(
                    'search',
                    searchValue.trim(),
                );
            }
            const endpoint = isAdmin
            ? '/admin/tax-forms/create/options'
            : '/tax-forms/create/options';
            const queryString =
                params.toString();

            const response = await fetch(
                `${endpoint}${
                    queryString
                    ? `?${queryString}`
                    : ''
                }`,
                    {
                        method: 'GET',
                        headers: {
                            Accept:
                                'application/json',
                            'X-Requested-With':
                                'XMLHttpRequest',
                        },
                        credentials:
                            'same-origin',
                    },
                );

            if (!response.ok) {
                throw new Error(
                    'Unable to load tax forms.',
                );
            }

            const result =
                (await response.json()) as CreateFormOptionsResponse;

            setData(result);

            /*
             |--------------------------------------------------------------------------
             | First API call
             |--------------------------------------------------------------------------
             |
             | Backend decides the default/latest year.
             |
             */

            if (
                selectedYear === undefined &&
                result.selected_year !== null
            ) {
                setYear(
                    result.selected_year,
                );
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Unable to load tax forms.',
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     |--------------------------------------------------------------------------
     | Initial Load
     |--------------------------------------------------------------------------
     */

    useEffect(() => {
        if (!open) {
            return;
        }

        setSearch('');
        setData(null);
        setYear(null);
        setSelectedFormId(null);
        setUserSelectorOpen(false);

        loadForms();
    }, [open]);

    /*
     |--------------------------------------------------------------------------
     | Year Change
     |--------------------------------------------------------------------------
     */

    const handleYearChange = (
        selectedYear: number,
    ) => {
        setYear(selectedYear);

        loadForms(
            selectedYear,
            search,
        );
    };

    /*
     |--------------------------------------------------------------------------
     | Search
     |--------------------------------------------------------------------------
     */

    useEffect(() => {
        if (!open || year === null) {
            return;
        }

        const timer = window.setTimeout(() => {
            loadForms(
                year,
                search,
            );
        }, 400);

        return () => {
            window.clearTimeout(timer);
        };
    }, [search]);

    /*
     |--------------------------------------------------------------------------
     | Select Form
     |--------------------------------------------------------------------------
     */

    const handleSelectForm = (
        form: FormOption,
    ) => {
        /*
         |--------------------------------------------------------------------------
         | Simple User
         |--------------------------------------------------------------------------
         |
         | Already logged in.
         | No user popup required.
         |
         */

        if (!isAdmin) {
            onOpenChange(false);

            router.visit(
                `/tax-forms/create/${form.id}`,
            );

            return;
        }

        /*
         |--------------------------------------------------------------------------
         | Admin
         |--------------------------------------------------------------------------
         |
         | Admin must first select a simple user.
         |
         */

        setSelectedFormId(form.id);
        setUserSelectorOpen(true);
    };

    /*
     |--------------------------------------------------------------------------
     | Admin User Selected
     |--------------------------------------------------------------------------
     */

    const handleUserSelect = (
        user: CreateFormUser,
    ) => {
        if (!selectedFormId) {
            return;
        }

        const targetUrl =
            `/admin/tax-forms/create/${selectedFormId}?user_id=${user.id}`;

        /*
         |--------------------------------------------------------------------------
         | Close both dialogs first
         |--------------------------------------------------------------------------
         */

        setUserSelectorOpen(false);
        onOpenChange(false);

        /*
         |--------------------------------------------------------------------------
         | Navigate directly to the tax-form wizard
         |--------------------------------------------------------------------------
         |
         | Use browser navigation here so the Radix Dialog close/unmount
         | lifecycle cannot interfere with the navigation.
         |
         */

        window.location.href =
            targetUrl;
    };

    /*
     |--------------------------------------------------------------------------
     | Close Main Dialog
     |--------------------------------------------------------------------------
     */

    const handleMainDialogChange = (
        value: boolean,
    ) => {
        if (!value) {
            setSelectedFormId(null);
            setUserSelectorOpen(false);
        }

        onOpenChange(value);
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={
                    handleMainDialogChange
                }
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            Create a Form
                        </DialogTitle>

                        <DialogDescription>
                            Select a tax year and form
                            to get started.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        {/* =====================================================
                            SEARCH
                        ===================================================== */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Search
                            </label>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    value={search}
                                    onChange={(
                                        event,
                                    ) =>
                                        setSearch(
                                            event.target
                                                .value,
                                        )
                                    }
                                    placeholder="Search forms..."
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* =====================================================
                            YEAR
                        ===================================================== */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Tax Year
                            </label>

                            <div className="relative">
                                <select
                                    value={
                                        year ?? ''
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        handleYearChange(
                                            Number(
                                                event
                                                    .target
                                                    .value,
                                            ),
                                        )
                                    }
                                    disabled={
                                        loading &&
                                        !data
                                    }
                                    className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {!year && (
                                        <option value="">
                                            Select year
                                        </option>
                                    )}

                                    {data?.years.map(
                                        (
                                            availableYear,
                                        ) => (
                                            <option
                                                key={
                                                    availableYear
                                                }
                                                value={
                                                    availableYear
                                                }
                                            >
                                                {
                                                    availableYear
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>

                        {/* =====================================================
                            FORM LIST
                        ===================================================== */}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Select Form
                            </label>

                            <div className="min-h-32 overflow-hidden rounded-md border">
                                {loading ? (
                                    <div className="flex min-h-32 items-center justify-center">
                                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                ) : error ? (
                                    <div className="flex min-h-32 items-center justify-center px-4 text-center text-sm text-destructive">
                                        {error}
                                    </div>
                                ) : data?.forms
                                      .length ? (
                                    <div className="divide-y">
                                        {data.forms.map(
                                            (
                                                form,
                                            ) => (
                                                <Button
                                                    key={
                                                        form.id
                                                    }
                                                    type="button"
                                                    variant="ghost"
                                                    className="h-auto w-full justify-between rounded-none px-4 py-4 text-left"
                                                    onClick={() =>
                                                        handleSelectForm(
                                                            form,
                                                        )
                                                    }
                                                >
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-medium">
                                                            {
                                                                form.name
                                                            }
                                                        </span>

                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                form.form_type_name
                                                            }{' '}
                                                            ·{' '}
                                                            {
                                                                form.tax_year
                                                            }
                                                        </span>
                                                    </div>

                                                    <span className="text-sm text-muted-foreground">
                                                        Select →
                                                    </span>
                                                </Button>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex min-h-32 items-center justify-center px-4 text-center text-sm text-muted-foreground">
                                        No forms found
                                        for the selected
                                        year.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ================================================================
                ADMIN USER SELECTOR
            ================================================================= */}

            {isAdmin && (
                <UserSelectorDialog
                    open={
                        userSelectorOpen
                    }
                    onOpenChange={
                        setUserSelectorOpen
                    }
                    onSelect={
                        handleUserSelect
                    }
                />
            )}
        </>
    );
}