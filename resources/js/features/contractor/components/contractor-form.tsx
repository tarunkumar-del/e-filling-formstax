import { useEffect, useMemo, useState } from 'react';
import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    fetchCities,
    fetchCountries,
    fetchRegions,
} from '../api';

import type {
    Country,
    CountryCity,
    CountryRegion,
    Contractor,
    TaxIdType,
} from '../types';

interface ContractorFormProps {
    companyId: number;
    contractor?: Contractor;
    isAdmin?: boolean;
    onSuccess?: () => void;
}

interface ContractorFormData {
    tax_id_type: TaxIdType;
    tax_id: string;

    first_name: string;
    middle_initial: string;
    last_name: string;
    suffix: string;

    business_entity_name: string;

    address_1: string;
    address_2: string;

    country_id: string;
    region_id: string;
    city_id: string;

    postal: string;
    phone: string;
    email: string;

    /*
     * Tax Form return context.
     */
    return_to?: string;
    user_id?: number;
}

export function ContractorForm({
    companyId,
    contractor,
    isAdmin = false,
    onSuccess,
}: ContractorFormProps) {
    const [countries, setCountries] =
        useState<Country[]>([]);

    const [regions, setRegions] =
        useState<CountryRegion[]>([]);

    const [cities, setCities] =
        useState<CountryCity[]>([]);

    const [countriesLoading, setCountriesLoading] =
        useState(false);

    const [regionsLoading, setRegionsLoading] =
        useState(false);

    const [citiesLoading, setCitiesLoading] =
        useState(false);

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

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
    } = useForm<ContractorFormData>({
        tax_id_type:
            contractor?.tax_id_type ?? 'TIN',

        tax_id:
            contractor?.tax_id ?? '',

        first_name:
            contractor?.first_name ?? '',

        middle_initial:
            contractor?.middle_initial ?? '',

        last_name:
            contractor?.last_name ?? '',

        suffix:
            contractor?.suffix ?? '',

        business_entity_name:
            contractor?.business_entity_name ?? '',

        address_1:
            contractor?.address_1 ?? '',

        address_2:
            contractor?.address_2 ?? '',

        country_id:
            contractor?.country_id
                ? String(contractor.country_id)
                : '',

        region_id:
            contractor?.region_id
                ? String(contractor.region_id)
                : '',

        city_id:
            contractor?.city_id
                ? String(contractor.city_id)
                : '',

        postal:
            contractor?.postal ?? '',

        phone:
            contractor?.phone ?? '',

        email:
            contractor?.email ?? '',

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
    | Load Countries
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        const loadCountries = async () => {
            setCountriesLoading(true);

            try {
                const result =
                    await fetchCountries();

                if (cancelled) {
                    return;
                }

                setCountries(
                    Array.isArray(result)
                        ? result
                        : Array.isArray(
                              result?.countries,
                          )
                          ? result.countries
                          : [],
                );
            } catch (error) {
                console.error(
                    'Failed to load countries:',
                    error,
                );

                if (!cancelled) {
                    setCountries([]);
                }
            } finally {
                if (!cancelled) {
                    setCountriesLoading(false);
                }
            }
        };

        loadCountries();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Load Regions
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        if (!data.country_id) {
            setRegions([]);
            setCities([]);

            return;
        }

        const loadRegions = async () => {
            setRegionsLoading(true);

            try {
                const result =
                    await fetchRegions(
                        Number(data.country_id),
                    );

                if (cancelled) {
                    return;
                }

                setRegions(
                    Array.isArray(result)
                        ? result
                        : Array.isArray(
                              result?.regions,
                          )
                          ? result.regions
                          : [],
                );
            } catch (error) {
                console.error(
                    'Failed to load regions:',
                    error,
                );

                if (!cancelled) {
                    setRegions([]);
                }
            } finally {
                if (!cancelled) {
                    setRegionsLoading(false);
                }
            }
        };

        loadRegions();

        return () => {
            cancelled = true;
        };
    }, [data.country_id]);

    /*
    |--------------------------------------------------------------------------
    | Load Cities
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        if (!data.region_id) {
            setCities([]);

            return;
        }

        const loadCities = async () => {
            setCitiesLoading(true);

            try {
                const result =
                    await fetchCities(
                        Number(data.region_id),
                    );

                if (cancelled) {
                    return;
                }

                setCities(
                    Array.isArray(result)
                        ? result
                        : Array.isArray(
                              result?.cities,
                          )
                          ? result.cities
                          : [],
                );
            } catch (error) {
                console.error(
                    'Failed to load cities:',
                    error,
                );

                if (!cancelled) {
                    setCities([]);
                }
            } finally {
                if (!cancelled) {
                    setCitiesLoading(false);
                }
            }
        };

        loadCities();

        return () => {
            cancelled = true;
        };
    }, [data.region_id]);

    /*
    |--------------------------------------------------------------------------
    | Selected Country
    |--------------------------------------------------------------------------
    */

    const selectedCountry = useMemo(
        () =>
            countries.find(
                (country) =>
                    String(country.id) ===
                    data.country_id,
            ),
        [
            countries,
            data.country_id,
        ],
    );

    /*
    |--------------------------------------------------------------------------
    | Dynamic Labels
    |--------------------------------------------------------------------------
    */

    const regionLabel =
        selectedCountry?.region_label ??
        'State';

    const postalLabel =
        selectedCountry?.postal_label ??
        'Postal Code';

    /*
    |--------------------------------------------------------------------------
    | Validation Styling
    |--------------------------------------------------------------------------
    */

    const inputErrorClass = (
        field: keyof typeof errors,
    ) =>
        errors[field]
            ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive'
            : '';

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const submit = () => {
        const baseUrl = isAdmin
            ? `/admin/companies/${companyId}/contractors`
            : `/companies/${companyId}/contractors`;

        const url = contractor
            ? `${baseUrl}/${contractor.id}`
            : baseUrl;

        const options = {
            preserveScroll: true,

            onSuccess: () => {
                /*
                 * When returning to Tax Form, backend redirects
                 * away from this page. For normal creation,
                 * preserve the existing reset behaviour.
                 */
                if (!contractor && !returnTo) {
                    reset();
                }

                onSuccess?.();
            },
        };

        if (contractor) {
            put(url, options);
        } else {
            post(url, options);
        }
    };

    return (
        <div className="space-y-8">
            {/* =========================================================
                TAX INFORMATION
            ========================================================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        Tax Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Enter the contractor's tax identification
                        information.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>
                            Tax ID Type
                        </Label>

                        <Select
                            value={
                                data.tax_id_type
                            }
                            onValueChange={(
                                value,
                            ) =>
                                setData(
                                    'tax_id_type',
                                    value as TaxIdType,
                                )
                            }
                        >
                            <SelectTrigger
                                className={`w-full ${inputErrorClass(
                                    'tax_id_type',
                                )}`}
                            >
                                <SelectValue placeholder="Select tax ID type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="TIN">
                                    TIN
                                </SelectItem>

                                <SelectItem value="EIN">
                                    EIN
                                </SelectItem>

                                <SelectItem value="SSN">
                                    SSN
                                </SelectItem>

                                <SelectItem value="Unknown">
                                    Unknown
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.tax_id_type && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.tax_id_type
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Tax ID
                        </Label>

                        <Input
                            value={
                                data.tax_id
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'tax_id',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'tax_id',
                            )}
                        />

                        {errors.tax_id && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.tax_id
                                }
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* =========================================================
                RECIPIENT INFORMATION
            ========================================================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        Recipient Information
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                        <Label>
                            First Name
                        </Label>

                        <Input
                            value={
                                data.first_name
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'first_name',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'first_name',
                            )}
                        />

                        {errors.first_name && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.first_name
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Middle Initial
                        </Label>

                        <Input
                            value={
                                data.middle_initial
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'middle_initial',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'middle_initial',
                            )}
                        />

                        {errors.middle_initial && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.middle_initial
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Last Name
                        </Label>

                        <Input
                            value={
                                data.last_name
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'last_name',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'last_name',
                            )}
                        />

                        {errors.last_name && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.last_name
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Suffix
                        </Label>

                        <Input
                            value={
                                data.suffix
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'suffix',
                                    event.target.value,
                                )
                            }
                            placeholder="Jr., Sr., III"
                            className={inputErrorClass(
                                'suffix',
                            )}
                        />

                        {errors.suffix && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.suffix
                                }
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>
                        Business or Entity Name
                    </Label>

                    <Input
                        value={
                            data.business_entity_name
                        }
                        onChange={(
                            event,
                        ) =>
                            setData(
                                'business_entity_name',
                                event.target.value,
                            )
                        }
                        className={inputErrorClass(
                            'business_entity_name',
                        )}
                    />

                    {errors.business_entity_name && (
                        <p className="text-sm text-destructive">
                            {
                                errors.business_entity_name
                            }
                        </p>
                    )}
                </div>
            </section>

            {/* =========================================================
                ADDRESS
            ========================================================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        Address
                    </h3>
                </div>

                <div className="space-y-2">
                    <Label>
                        Address 1
                    </Label>

                    <Input
                        value={
                            data.address_1
                        }
                        onChange={(
                            event,
                        ) =>
                            setData(
                                'address_1',
                                event.target.value,
                            )
                        }
                        className={inputErrorClass(
                            'address_1',
                        )}
                    />

                    {errors.address_1 && (
                        <p className="text-sm text-destructive">
                            {
                                errors.address_1
                            }
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>
                        Address 2
                    </Label>

                    <Input
                        value={
                            data.address_2
                        }
                        onChange={(
                            event,
                        ) =>
                            setData(
                                'address_2',
                                event.target.value,
                            )
                        }
                        className={inputErrorClass(
                            'address_2',
                        )}
                    />

                    {errors.address_2 && (
                        <p className="text-sm text-destructive">
                            {
                                errors.address_2
                            }
                        </p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>
                            Country
                        </Label>

                        <Select
                            value={
                                data.country_id
                            }
                            onValueChange={(
                                value,
                            ) => {
                                setData(
                                    'country_id',
                                    value,
                                );

                                setData(
                                    'region_id',
                                    '',
                                );

                                setData(
                                    'city_id',
                                    '',
                                );
                            }}
                        >
                            <SelectTrigger
                                className={`w-full ${inputErrorClass(
                                    'country_id',
                                )}`}
                            >
                                <SelectValue
                                    placeholder={
                                        countriesLoading
                                            ? 'Loading countries...'
                                            : 'Select country'
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="max-h-72">
                                {countries.map(
                                    (
                                        country,
                                    ) => (
                                        <SelectItem
                                            key={
                                                country.id
                                            }
                                            value={String(
                                                country.id,
                                            )}
                                        >
                                            {
                                                country.name
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        {errors.country_id && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.country_id
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {regionLabel}
                        </Label>

                        <Select
                            value={
                                data.region_id
                            }
                            onValueChange={(
                                value,
                            ) => {
                                setData(
                                    'region_id',
                                    value,
                                );

                                setData(
                                    'city_id',
                                    '',
                                );
                            }}
                            disabled={
                                !data.country_id ||
                                regionsLoading
                            }
                        >
                            <SelectTrigger
                                className={`w-full ${inputErrorClass(
                                    'region_id',
                                )}`}
                            >
                                <SelectValue
                                    placeholder={
                                        regionsLoading
                                            ? `Loading ${regionLabel.toLowerCase()}s...`
                                            : `Select ${regionLabel.toLowerCase()}`
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="max-h-72">
                                {regions.map(
                                    (
                                        region,
                                    ) => (
                                        <SelectItem
                                            key={
                                                region.id
                                            }
                                            value={String(
                                                region.id,
                                            )}
                                        >
                                            {
                                                region.name
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        {errors.region_id && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.region_id
                                }
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>
                            City
                        </Label>

                        <Select
                            value={
                                data.city_id
                            }
                            onValueChange={(
                                value,
                            ) =>
                                setData(
                                    'city_id',
                                    value,
                                )
                            }
                            disabled={
                                !data.region_id ||
                                citiesLoading
                            }
                        >
                            <SelectTrigger
                                className={`w-full ${inputErrorClass(
                                    'city_id',
                                )}`}
                            >
                                <SelectValue
                                    placeholder={
                                        citiesLoading
                                            ? 'Loading cities...'
                                            : 'Select city'
                                    }
                                />
                            </SelectTrigger>

                            <SelectContent className="max-h-72">
                                {cities.map(
                                    (
                                        city,
                                    ) => (
                                        <SelectItem
                                            key={
                                                city.id
                                            }
                                            value={String(
                                                city.id,
                                            )}
                                        >
                                            {
                                                city.name
                                            }
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        {errors.city_id && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.city_id
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {postalLabel}
                        </Label>

                        <Input
                            value={
                                data.postal
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'postal',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'postal',
                            )}
                        />

                        {errors.postal && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.postal
                                }
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* =========================================================
                CONTACT INFORMATION
            ========================================================= */}

            <section className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        Contact Information
                    </h3>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>
                            Phone
                        </Label>

                        <Input
                            value={
                                data.phone
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'phone',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'phone',
                            )}
                        />

                        {errors.phone && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.phone
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Email
                        </Label>

                        <Input
                            type="email"
                            value={
                                data.email
                            }
                            onChange={(
                                event,
                            ) =>
                                setData(
                                    'email',
                                    event.target.value,
                                )
                            }
                            className={inputErrorClass(
                                'email',
                            )}
                        />

                        {errors.email && (
                            <p className="text-sm text-destructive">
                                {
                                    errors.email
                                }
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* =========================================================
                SUBMIT
            ========================================================= */}

            <div className="flex justify-end border-t pt-4">
                <Button
                    type="button"
                    disabled={processing}
                    onClick={submit}
                >
                    {processing
                        ? 'Saving...'
                        : contractor
                          ? 'Update Contractor'
                          : 'Add Contractor'}
                </Button>
            </div>
        </div>
    );
}