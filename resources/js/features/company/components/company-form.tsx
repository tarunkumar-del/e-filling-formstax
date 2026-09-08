import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { Company } from '@/features/company/types';

interface CompanyFormProps {
    company?: Company;
    storeUrl: string;
    updateUrl?: string;
    onSuccess?: () => void;
}

interface CompanyFormData {
    tax_id_type: 'TIN' | 'EIN' | 'SSN';
    tax_id: string;
    payer_first_name: string;
    payer_last_name: string;
    business_entity_name: string;
    address_1: string;
    address_2: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
    email: string;
    payer_contact_name: string;

    /*
     * These are only populated when the form was opened
     * from the Tax Form creation flow.
     */
    return_to?: string;
    user_id?: number;
}

export function CompanyForm({
    company,
    storeUrl,
    updateUrl,
    onSuccess,
}: CompanyFormProps) {
    const isEdit = Boolean(company);

    /*
    |--------------------------------------------------------------------------
    | Tax Form Return Context
    |--------------------------------------------------------------------------
    */

    const searchParams = new URLSearchParams(
        window.location.search,
    );

    const returnTo = searchParams.get('return_to');

    const ownerUserId = searchParams.get('user_id');

    const form = useForm<CompanyFormData>({
        tax_id_type: 'TIN',
        tax_id: '',
        payer_first_name: '',
        payer_last_name: '',
        business_entity_name: '',
        address_1: '',
        address_2: '',
        country: 'United States',
        city: '',
        state: '',
        zip_code: '',
        phone: '',
        email: '',
        payer_contact_name: '',

        ...(returnTo
            ? {
                  return_to: returnTo,
              }
            : {}),

        ...(ownerUserId
            ? {
                  user_id: Number(ownerUserId),
              }
            : {}),
    });

    /*
    |--------------------------------------------------------------------------
    | Populate Form When Editing
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!company) {
            return;
        }

        form.setData({
            tax_id_type: company.tax_id_type,
            tax_id: company.tax_id,
            payer_first_name: company.payer_first_name,
            payer_last_name: company.payer_last_name,
            business_entity_name:
                company.business_entity_name,
            address_1: company.address_1,
            address_2: company.address_2 ?? '',
            country: company.country,
            city: company.city,
            state: company.state,
            zip_code: company.zip_code,
            phone: company.phone,
            email: company.email,
            payer_contact_name:
                company.payer_contact_name,
        });
    }, [company]);

    /*
    |--------------------------------------------------------------------------
    | Field Error
    |--------------------------------------------------------------------------
    */

    const fieldError = (
        field: keyof CompanyFormData,
    ) => {
        const error = form.errors[field];

        if (!error) {
            return null;
        }

        return (
            <p className="mt-1 text-sm text-red-500">
                {error}
            </p>
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Field Error Class
    |--------------------------------------------------------------------------
    */

    const fieldClassName = (
        field: keyof CompanyFormData,
    ) => {
        if (form.errors[field]) {
            return 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500';
        }

        return '';
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (
        e: React.FormEvent,
    ) => {
        e.preventDefault();

        form.clearErrors();

        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        if (
            isEdit &&
            updateUrl &&
            company
        ) {
            form.put(updateUrl, {
                preserveScroll: true,

                onError: (errors) => {
                    console.log(
                        'COMPANY UPDATE BACKEND ERRORS:',
                        errors,
                    );
                },

                onSuccess: () => {
                    onSuccess?.();
                },
            });

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Create
        |--------------------------------------------------------------------------
        */

        form.post(storeUrl, {
            preserveScroll: true,

            onError: (errors) => {
                console.log(
                    'COMPANY CREATE BACKEND ERRORS:',
                    errors,
                );
            },

            onSuccess: () => {
                /*
                 * When the backend redirects to the Tax Form,
                 * this callback will not continue the normal
                 * Company-page flow. For the normal Company page,
                 * the existing reset behaviour remains.
                 */
                if (!returnTo) {
                    form.reset();

                    form.setData(
                        'tax_id_type',
                        'TIN',
                    );

                    form.setData(
                        'country',
                        'United States',
                    );
                }

                onSuccess?.();
            },

            onFinish: () => {
                console.log(
                    'COMPANY CREATE FINISHED',
                );
            },
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 px-6 pb-6 pt-2"
        >
            {/* ============================================================ */}
            {/* TAX INFORMATION */}
            {/* ============================================================ */}

            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold">
                        Tax Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Enter the company's tax identification details.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tax_id_type">
                        Tax ID Type
                    </Label>

                    <select
                        id="tax_id_type"
                        value={
                            form.data.tax_id_type
                        }
                        onChange={(e) =>
                            form.setData(
                                'tax_id_type',
                                e.target.value as
                                    | 'TIN'
                                    | 'EIN'
                                    | 'SSN',
                            )
                        }
                        className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                            form.errors
                                .tax_id_type
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : 'border-input'
                        }`}
                    >
                        <option value="TIN">
                            TIN
                        </option>

                        <option value="EIN">
                            EIN
                        </option>

                        <option value="SSN">
                            SSN
                        </option>
                    </select>

                    {fieldError(
                        'tax_id_type',
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tax_id">
                        Tax ID
                    </Label>

                    <Input
                        id="tax_id"
                        value={
                            form.data.tax_id
                        }
                        onChange={(e) =>
                            form.setData(
                                'tax_id',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'tax_id',
                        )}
                    />

                    {fieldError('tax_id')}
                </div>
            </div>

            {/* ============================================================ */}
            {/* PAYER INFORMATION */}
            {/* ============================================================ */}

            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold">
                        Payer Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Enter the payer or business owner information.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="payer_first_name">
                            First Name
                        </Label>

                        <Input
                            id="payer_first_name"
                            value={
                                form.data
                                    .payer_first_name
                            }
                            onChange={(e) =>
                                form.setData(
                                    'payer_first_name',
                                    e.target.value,
                                )
                            }
                            className={fieldClassName(
                                'payer_first_name',
                            )}
                        />

                        {fieldError(
                            'payer_first_name',
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="payer_last_name">
                            Last Name
                        </Label>

                        <Input
                            id="payer_last_name"
                            value={
                                form.data
                                    .payer_last_name
                            }
                            onChange={(e) =>
                                form.setData(
                                    'payer_last_name',
                                    e.target.value,
                                )
                            }
                            className={fieldClassName(
                                'payer_last_name',
                            )}
                        />

                        {fieldError(
                            'payer_last_name',
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="business_entity_name">
                        Business Entity Name
                    </Label>

                    <Input
                        id="business_entity_name"
                        value={
                            form.data
                                .business_entity_name
                        }
                        onChange={(e) =>
                            form.setData(
                                'business_entity_name',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'business_entity_name',
                        )}
                    />

                    {fieldError(
                        'business_entity_name',
                    )}
                </div>
            </div>

            {/* ============================================================ */}
            {/* ADDRESS */}
            {/* ============================================================ */}

            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold">
                        Address
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Enter the company's business address.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address_1">
                        Address Line 1
                    </Label>

                    <Input
                        id="address_1"
                        value={
                            form.data.address_1
                        }
                        onChange={(e) =>
                            form.setData(
                                'address_1',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'address_1',
                        )}
                    />

                    {fieldError('address_1')}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address_2">
                        Address Line 2
                    </Label>

                    <Input
                        id="address_2"
                        value={
                            form.data.address_2
                        }
                        onChange={(e) =>
                            form.setData(
                                'address_2',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'address_2',
                        )}
                    />

                    {fieldError('address_2')}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="country">
                            Country
                        </Label>

                        <Input
                            id="country"
                            value={
                                form.data.country
                            }
                            onChange={(e) =>
                                form.setData(
                                    'country',
                                    e.target.value,
                                )
                            }
                            className={fieldClassName(
                                'country',
                            )}
                        />

                        {fieldError('country')}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">
                            City
                        </Label>

                        <Input
                            id="city"
                            value={
                                form.data.city
                            }
                            onChange={(e) =>
                                form.setData(
                                    'city',
                                    e.target.value,
                                )
                            }
                            className={fieldClassName(
                                'city',
                            )}
                        />

                        {fieldError('city')}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="state">
                            State
                        </Label>

                        <Input
                            id="state"
                            value={
                                form.data.state
                            }
                            onChange={(e) =>
                                form.setData(
                                    'state',
                                    e.target.value,
                                )
                            }
                            className={fieldClassName(
                                'state',
                            )}
                        />

                        {fieldError('state')}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="zip_code">
                            ZIP Code
                        </Label>

                        <Input
                            id="zip_code"
                            value={
                                form.data.zip_code
                            }
                            onChange={(e) =>
                                form.setData(
                                    'zip_code',
                                    e.target.value,
                                )
                            }
                            className={fieldClassName(
                                'zip_code',
                            )}
                        />

                        {fieldError('zip_code')}
                    </div>
                </div>
            </div>

            {/* ============================================================ */}
            {/* CONTACT INFORMATION */}
            {/* ============================================================ */}

            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold">
                        Contact Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Enter the company's contact details.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">
                        Phone
                    </Label>

                    <Input
                        id="phone"
                        type="tel"
                        value={
                            form.data.phone
                        }
                        onChange={(e) =>
                            form.setData(
                                'phone',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'phone',
                        )}
                    />

                    {fieldError('phone')}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        value={
                            form.data.email
                        }
                        onChange={(e) =>
                            form.setData(
                                'email',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'email',
                        )}
                    />

                    {fieldError('email')}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="payer_contact_name">
                        Payer Contact Name
                    </Label>

                    <Input
                        id="payer_contact_name"
                        value={
                            form.data
                                .payer_contact_name
                        }
                        onChange={(e) =>
                            form.setData(
                                'payer_contact_name',
                                e.target.value,
                            )
                        }
                        className={fieldClassName(
                            'payer_contact_name',
                        )}
                    />

                    {fieldError(
                        'payer_contact_name',
                    )}
                </div>
            </div>

            {/* ============================================================ */}
            {/* SUBMIT */}
            {/* ============================================================ */}

            <div className="flex justify-end gap-3 border-t pt-4">
                <Button
                    type="submit"
                    disabled={
                        form.processing
                    }
                >
                    {form.processing
                        ? isEdit
                            ? 'Updating...'
                            : 'Creating...'
                        : isEdit
                          ? 'Update Company'
                          : 'Create Company'}
                </Button>
            </div>
        </form>
    );
}