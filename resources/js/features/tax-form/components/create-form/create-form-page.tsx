import { router } from '@inertiajs/react';

import {
    ArrowLeft,
    ArrowRight,
    Building2,
    Check,
    ChevronDown,
    ChevronRight,
    Plus,
    UserRound,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';

import { CompanySelector } from './company-selector';
import { ContractorSelector } from './contractor-selector';
import { CompanyDetails } from './company-details';
import { ContractorDetails } from './contractor-details';

import type {
    CreateFormCompany,
    CreateFormContractor,
    CreateFormPageProps,
    FormField,
} from '../../types';

interface CreateFormPagePropsWithContext
    extends CreateFormPageProps {
    owner_user_id?: number;
    is_admin?: boolean;
    form_id?: number | null;
    form_fields?: FormField[];
    form_values?: Record<string, string | null>;
    selected_company_id?: number | null;
    selected_contractor_id?: number | null;
}

interface LocationRegion {
    id: number;
    name: string;
    code?: string | null;
}


function getSourceValue(
    field: FormField,
    company: CreateFormCompany | null,
    contractor: CreateFormContractor | null,
): string | boolean {
    if (field.source_type === 'company' && company) {
        const sourceKey = field.source_key;

        if (!sourceKey) {
            return '';
        }

        const value = company[sourceKey as keyof CreateFormCompany];

        return value == null ? '' : String(value);
    }

    if (field.source_type === 'contractor' && contractor) {
        const sourceKey = field.source_key;

        if (!sourceKey) {
            return '';
        }

        /*
         * Contractor source_key values are defined by the
         * form field configuration. Location fields use IDs,
         * while the UI can use the loaded location relation
         * name when available.
         */
        if (
            sourceKey === 'country_id' ||
            sourceKey === 'country'
        ) {
            return contractor.country?.name
                ? String(contractor.country.name)
                : contractor.country_id == null
                    ? ''
                    : String(contractor.country_id);
        }

        if (
            sourceKey === 'region_id' ||
            sourceKey === 'region' ||
            sourceKey === 'state'
        ) {
            return contractor.region?.name
                ? String(contractor.region.name)
                : contractor.region_id == null
                    ? ''
                    : String(contractor.region_id);
        }

        if (sourceKey === 'city_id' || sourceKey === 'city') {
            return contractor.city?.name
                ? String(contractor.city.name)
                : contractor.city_id == null
                    ? ''
                    : String(contractor.city_id);
        }

        if (
            sourceKey === 'postal_code' ||
            sourceKey === 'postal'
        ) {
            const postal =
                contractor.postal_code ??
                (contractor as CreateFormContractor & {
                    postal?: string | null;
                }).postal;

            return postal == null ? '' : String(postal);
        }

        if (
            sourceKey === 'business_name' ||
            sourceKey === 'business_entity_name'
        ) {
            return contractor.business_entity_name ?? '';
        }

        const value =
            contractor[
                sourceKey as keyof CreateFormContractor
            ];

        return value == null ? '' : String(value);
    }

    return '';
}

function isAutoFilledField(field: FormField): boolean {
    return (
        field.source_type === 'company' ||
        field.source_type === 'contractor'
    );
}

function groupFormFieldsBySection(
    fields: FormField[],
): Record<string, FormField[]> {
    return fields.reduce<Record<string, FormField[]>>(
        (groups, field) => {
            const section =
                field.section?.trim() || 'General';

            if (!groups[section]) {
                groups[section] = [];
            }

            groups[section].push(field);

            return groups;
        },
        {},
    );
}

export default function CreateFormPage({
    formDefinition,
    companies: initialCompanies = [],
    owner_user_id,
    is_admin = false,
    form_id = null,
    form_fields = [],
    form_values = {},
    selected_company_id = null,
    selected_contractor_id = null,
}: CreateFormPagePropsWithContext) {
    const [step, setStep] = useState<1 | 2 | 3>(form_id ? 3 : 1);

    const groupedFormFields =
        groupFormFieldsBySection(form_fields);

    const [openSections, setOpenSections] =
        useState<Record<string, boolean>>(() =>
            Object.fromEntries(
                Object.keys(groupedFormFields).map((section) => [
                    section,
                    true,
                ]),
            ),
        );

    const [stateRegions, setStateRegions] =
        useState<LocationRegion[]>([]);

    const [stateRegionsLoading, setStateRegionsLoading] =
        useState(false);

    const [stateRegionsError, setStateRegionsError] =
        useState<string | null>(null);

    const [companies, setCompanies] =
        useState<CreateFormCompany[]>(
            initialCompanies,
        );

    const [selectedCompany, setSelectedCompany] =
        useState<CreateFormCompany | null>(() => {
            if (!selected_company_id) {
                return null;
            }

            return (
                initialCompanies.find(
                    (company) =>
                        company.id === selected_company_id,
                ) ?? null
            );
        });

    const [contractors, setContractors] =
        useState<CreateFormContractor[]>(
            [],
        );

    const [
        selectedContractor,
        setSelectedContractor,
    ] =
        useState<CreateFormContractor | null>(
            null,
        );

    const [
        loadingCompanies,
        setLoadingCompanies,
    ] = useState(false);

    const [
        loadingContractors,
        setLoadingContractors,
    ] = useState(false);

    const [
        submittingForm,
        setSubmittingForm,
    ] = useState(false);

    const [companyError, setCompanyError] =
        useState<string | null>(null);

    const [
        contractorError,
        setContractorError,
    ] = useState<string | null>(null);

    const [formError, setFormError] =
        useState<string | null>(null);

    const [fieldValues, setFieldValues] =
        useState<
            Record<string, string | boolean>
        >(() => {
            const values: Record<
                string,
                string | boolean
            > = {};

            Object.entries(form_values).forEach(
                ([fieldId, value]) => {
                    if (value === 'true') {
                        values[fieldId] = true;
                    } else if (
                        value === 'false'
                    ) {
                        values[fieldId] = false;
                    } else {
                        values[fieldId] =
                            value ?? '';
                    }
                },
            );

            return values;
        });

    const [fieldErrors, setFieldErrors] =
        useState<Record<string, string>>({});

    const [
        savingDetails,
        setSavingDetails,
    ] = useState(false);

    const [
        loadingSelectedContractor,
        setLoadingSelectedContractor,
    ] = useState(false);

    /*
     * ---------------------------------------------------------
     * Current Tax Form URL
     * ---------------------------------------------------------
     */

    const getCurrentTaxFormUrl = () => {
        return `${window.location.pathname}${window.location.search}`;
    };

    /*
     * ---------------------------------------------------------
     * Load Companies
     * ---------------------------------------------------------
     */

    useEffect(() => {
        loadCompanies();
    }, [
        owner_user_id,
        is_admin,
        form_id,
        selected_company_id,
    ]);

    const loadCompanies = async () => {
        setLoadingCompanies(true);
        setCompanyError(null);

        try {
            const params =
                new URLSearchParams();

            if (
                is_admin &&
                owner_user_id
            ) {
                params.set(
                    'user_id',
                    String(owner_user_id),
                );
            }

            const query =
                params.toString();

            const response =
                await fetch(
                    `/tax-forms/create/companies${
                        query
                            ? `?${query}`
                            : ''
                    }`,
                    {
                        headers: {
                            Accept:
                                'application/json',
                            'X-Requested-With':
                                'XMLHttpRequest',
                        },
                    },
                );

            if (!response.ok) {
                throw new Error(
                    'Unable to load companies.',
                );
            }

            const data =
                await response.json();

            const loadedCompanies =
                data.companies ?? [];

            setCompanies(
                loadedCompanies,
            );

            /*
             * Edit mode: restore the company that is already
             * attached to the existing tax form.
             */
            const editCompanyId =
                form_id && selected_company_id
                    ? selected_company_id
                    : null;

            if (editCompanyId) {
                const existingCompany =
                    loadedCompanies.find(
                        (company: CreateFormCompany) =>
                            company.id === editCompanyId,
                    );

                if (existingCompany) {
                    setSelectedCompany(existingCompany);
                    await loadContractors(existingCompany.id);
                }
            }

            /*
             * Auto-select company created
             * from the company creation flow.
             */
            const paramsFromUrl =
                new URLSearchParams(
                    window.location.search,
                );

            const companyId =
                paramsFromUrl.get(
                    'company_id',
                );

            if (companyId) {
                const parsedCompanyId =
                    Number(companyId);

                const newCompany =
                    loadedCompanies.find(
                        (
                            company: CreateFormCompany,
                        ) =>
                            company.id ===
                            parsedCompanyId,
                    );

                if (newCompany) {
                    setSelectedCompany(
                        newCompany,
                    );

                    await loadContractors(
                        parsedCompanyId,
                    );

                    /*
                     * Only move to contractor
                     * step when we are not already
                     * on Step 3.
                     */
                    if (!form_id) {
                        setStep(2);
                    }
                }
            }
        } catch (error) {
            console.error(error);

            setCompanyError(
                'Unable to load companies. Please try again.',
            );
        } finally {
            setLoadingCompanies(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * Company Changed
     * ---------------------------------------------------------
     */

    const handleCompanyChange = (
        companyId: number,
    ) => {
        const company =
            companies.find(
                (item) =>
                    item.id === companyId,
            ) ?? null;

        setSelectedCompany(
            company,
        );

        setSelectedContractor(null);
        setContractors([]);

        setContractorError(null);
        setCompanyError(null);
        setFormError(null);

        setStep(1);
    };

    /*
     * ---------------------------------------------------------
     * Load Contractors
     * ---------------------------------------------------------
     */

    const loadContractors = async (
        companyId: number,
    ) => {
        setLoadingContractors(true);
        setContractorError(null);

        try {
            const params =
                new URLSearchParams();

            params.set(
                'company_id',
                String(companyId),
            );

            if (
                is_admin &&
                owner_user_id
            ) {
                params.set(
                    'user_id',
                    String(owner_user_id),
                );
            }

            const response =
                await fetch(
                    `/tax-forms/create/contractors?${params.toString()}`,
                    {
                        headers: {
                            Accept:
                                'application/json',
                            'X-Requested-With':
                                'XMLHttpRequest',
                        },
                    },
                );

            if (!response.ok) {
                throw new Error(
                    'Unable to load contractors.',
                );
            }

            const data =
                await response.json();

            const loadedContractors =
                data.contractors ?? [];

            setContractors(
                loadedContractors,
            );

            /*
             * Edit mode: restore the contractor that is already
             * attached to the existing tax form.
             */
            const editContractorId =
                form_id && selected_contractor_id
                    ? selected_contractor_id
                    : null;

            if (editContractorId) {
                const existingContractor =
                    loadedContractors.find(
                        (contractor: CreateFormContractor) =>
                            contractor.id === editContractorId,
                    );

                if (existingContractor) {
                    setSelectedContractor(existingContractor);
                    void loadSelectedContractorDetails(existingContractor);
                    setStep(3);
                }
            }

            /*
             * Auto-select newly created contractor.
             */
            const paramsFromUrl =
                new URLSearchParams(
                    window.location.search,
                );

            const contractorId =
                paramsFromUrl.get(
                    'contractor_id',
                );

            if (contractorId) {
                const parsedContractorId =
                    Number(contractorId);

                const newContractor =
                    loadedContractors.find(
                        (
                            contractor: CreateFormContractor,
                        ) =>
                            contractor.id ===
                            parsedContractorId,
                    );

                if (newContractor) {
                    setSelectedContractor(
                        newContractor,
                    );

                    void loadSelectedContractorDetails(
                        newContractor,
                    );

                    if (!form_id) {
                        setStep(2);
                    }
                }
            }
        } catch (error) {
            console.error(error);

            setContractorError(
                'Unable to load contractors. Please try again.',
            );
        } finally {
            setLoadingContractors(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * Company Continue
     * ---------------------------------------------------------
     */

    const handleCompanyContinue =
        async () => {
            if (!selectedCompany) {
                setCompanyError(
                    'Please select a company first.',
                );

                return;
            }

            setFormError(null);

            setSelectedContractor(
                null,
            );

            await loadContractors(
                selectedCompany.id,
            );

            setStep(2);
        };

    /*
     * ---------------------------------------------------------
     * Contractor Changed
     * ---------------------------------------------------------
     */

    const handleContractorChange = (
        contractorId: number,
    ) => {
        const contractor =
            contractors.find(
                (item) =>
                    item.id ===
                    contractorId,
            ) ?? null;

        setSelectedContractor(
            contractor,
        );

        setContractorError(null);
        setFormError(null);

        if (contractor) {
            void loadSelectedContractorDetails(
                contractor,
            );
        }
    };

    /*
     * ---------------------------------------------------------
     * Contractor Continue
     * ---------------------------------------------------------
     */

    const handleContractorContinue = () => {
        if (!selectedCompany) {
            setCompanyError(
                'Please select a company first.',
            );

            return;
        }

        if (!selectedContractor) {
            setContractorError(
                'Please select a contractor first.',
            );

            return;
        }

        if (loadingSelectedContractor) {
            return;
        }

        setFormError(null);

        /*
         * Step 2 only selects the contractor.
         * The actual tax form is created when the
         * user clicks "Save & Complete" on Step 3.
         */
        setStep(3);
    };

    /*
     * ---------------------------------------------------------
     * Add New Company
     * ---------------------------------------------------------
     */

    const handleAddNewCompany =
        () => {
            const returnTo =
                getCurrentTaxFormUrl();

            const params =
                new URLSearchParams();

            params.set(
                'return_to',
                returnTo,
            );

            /*
             * Admin creates the company
             * on behalf of selected simple user.
             */
            if (
                is_admin &&
                owner_user_id
            ) {
                params.set(
                    'user_id',
                    String(owner_user_id),
                );
            }

            const baseUrl = is_admin
                ? '/admin/companies'
                : '/companies';

            router.visit(
                `${baseUrl}?${params.toString()}`,
            );
        };

    /*
     * ---------------------------------------------------------
     * Add New Contractor
     * ---------------------------------------------------------
     */

    const handleAddNewContractor =
        () => {
            if (!selectedCompany) {
                setContractorError(
                    'Please select a company first.',
                );

                return;
            }

            const returnTo =
                getCurrentTaxFormUrl();

            const params =
                new URLSearchParams();

            params.set(
                'return_to',
                returnTo,
            );

            /*
             * Admin creates contractor in the
             * company belonging to selected user.
             */
            if (
                is_admin &&
                owner_user_id
            ) {
                params.set(
                    'user_id',
                    String(owner_user_id),
                );
            }

            if (is_admin) {
                router.visit(
                    `/admin/companies/${selectedCompany.id}/contractors?${params.toString()}`,
                );

                return;
            }

            router.visit(
                `/companies/${selectedCompany.id}/contractors?${params.toString()}`,
            );
        };


    /*
     * ---------------------------------------------------------
     * Load Selected Contractor Details
     * ---------------------------------------------------------
     *
     * The contractor list contains the IDs for country,
     * region and city. The existing Contractor show endpoint
     * returns those location relations, so load the selected
     * contractor once before pre-filling Step 3.
     */
    const loadSelectedContractorDetails = async (
        contractor: CreateFormContractor,
    ) => {
        setLoadingSelectedContractor(true);

        try {
            const baseUrl = is_admin
                ? `/admin/companies/${contractor.company_id}/contractors/${contractor.id}`
                : `/companies/${contractor.company_id}/contractors/${contractor.id}`;

            const response = await fetch(baseUrl, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(
                    'Unable to load contractor details.',
                );
            }

            const details =
                (await response.json()) as CreateFormContractor;

            setSelectedContractor(details);
        } catch (error) {
            console.error(error);
            /*
             * Keep the selected list item if the details endpoint
             * is unavailable. Other contractor fields can still
             * be pre-filled from the list response.
             */
        } finally {
            setLoadingSelectedContractor(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * Pre-fill Company / Contractor Fields
     * ---------------------------------------------------------
     *
     * Only fields whose source_type is company or contractor
     * are populated automatically. Manual tax fields remain
     * untouched and editable.
     */
    useEffect(() => {
        if (step !== 3) {
            return;
        }

        if (!selectedCompany && !selectedContractor) {
            return;
        }

        setFieldValues((current) => {
            const next = { ...current };

            form_fields.forEach((field) => {
                if (!isAutoFilledField(field)) {
                    return;
                }

                const value = getSourceValue(
                    field,
                    selectedCompany,
                    selectedContractor,
                );

                next[String(field.field_id)] = value;
            });

            return next;
        });
    }, [
        step,
        form_fields,
        selectedCompany,
        selectedContractor,
    ]);

    /*
     * ---------------------------------------------------------
     * Load State / Region Options
     * ---------------------------------------------------------
     *
     * State fields such as state_a/state_b are configured as
     * input_type=region and source_key=code. Their country is
     * the selected contractor country, so the region list is
     * loaded from the same location endpoints used by the
     * contractor form.
     */
    useEffect(() => {
        const countryId = selectedContractor?.country_id;

        if (!countryId) {
            setStateRegions([]);
            setStateRegionsError(null);
            return;
        }

        let cancelled = false;

        const loadStateRegions = async () => {
            setStateRegionsLoading(true);
            setStateRegionsError(null);

            try {
                const response = await fetch(
                    `/locations/countries/${countryId}/regions`,
                    {
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Unable to load regions.');
                }

                const result = await response.json();
                const regions = Array.isArray(result)
                    ? result
                    : Array.isArray(result?.regions)
                      ? result.regions
                      : [];

                if (!cancelled) {
                    setStateRegions(
                        regions.map((region: LocationRegion) => ({
                            id: Number(region.id),
                            name: String(region.name),
                            code:
                                region.code == null
                                    ? null
                                    : String(region.code),
                        })),
                    );
                }
            } catch (error) {
                console.error('Failed to load state/regions:', error);

                if (!cancelled) {
                    setStateRegions([]);
                    setStateRegionsError(
                        'Unable to load states/regions.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setStateRegionsLoading(false);
                }
            }
        };

        void loadStateRegions();

        return () => {
            cancelled = true;
        };
    }, [selectedContractor?.country_id]);

    const isRegionField = (field: FormField) =>
        field.input_type === 'region' &&
        (field.source_type === 'manual' ||
            field.source_type === 'region');

    const getCountryName = () =>
        selectedContractor?.country?.name ?? '';

    const getRegionValue = (value: string | boolean | undefined) =>
        typeof value === 'string' ? value : '';

    const getRegionCode = (region: LocationRegion) =>
        region.code ? String(region.code) : String(region.id);

    /*
     * ---------------------------------------------------------
     * Form Field Changed
     * ---------------------------------------------------------
     */

    const handleFieldChange = (
        fieldId: number,
        value: string | boolean,
    ) => {
        setFieldValues((current) => ({
            ...current,
            [String(fieldId)]: value,
        }));

        setFieldErrors((current) => {
            const next = {
                ...current,
            };

            delete next[
                String(fieldId)
            ];

            return next;
        });

        setFormError(null);
    };

    /*
     * ---------------------------------------------------------
     * Validate Form Details
     * ---------------------------------------------------------
     */

    const validateFormDetails = (): boolean => {
        const errors: Record<
            string,
            string
        > = {};

        form_fields.forEach(
            (field) => {
                const value =
                    fieldValues[
                        String(
                            field.field_id,
                        )
                    ];

                const empty =
                    value === undefined ||
                    value === null ||
                    value === '' ||
                    (
                        typeof value ===
                            'string' &&
                        value.trim() === ''
                    );

                if (
                    field.is_required &&
                    empty
                ) {
                    errors[
                        String(
                            field.field_id,
                        )
                    ] =
                        `${field.label} is required.`;

                    return;
                }

                const rules =
                    field.validation_rules;

                if (
                    empty ||
                    !rules ||
                    typeof rules !==
                        'object'
                ) {
                    return;
                }

                if (
                    'maxLength' in rules &&
                    typeof value ===
                        'string' &&
                    value.length >
                        Number(
                            rules.maxLength,
                        )
                ) {
                    errors[
                        String(
                            field.field_id,
                        )
                    ] =
                        `${field.label} cannot exceed ${rules.maxLength} characters.`;
                }

                if (
                    'minLength' in rules &&
                    typeof value ===
                        'string' &&
                    value.length <
                        Number(
                            rules.minLength,
                        )
                ) {
                    errors[
                        String(
                            field.field_id,
                        )
                    ] =
                        `${field.label} must be at least ${rules.minLength} characters.`;
                }

                if (
                    'max' in rules &&
                    typeof value ===
                        'string' &&
                    value !== '' &&
                    !Number.isNaN(
                        Number(value),
                    ) &&
                    Number(value) >
                        Number(
                            rules.max,
                        )
                ) {
                    errors[
                        String(
                            field.field_id,
                        )
                    ] =
                        `${field.label} cannot be greater than ${rules.max}.`;
                }

                if (
                    'min' in rules &&
                    typeof value ===
                        'string' &&
                    value !== '' &&
                    !Number.isNaN(
                        Number(value),
                    ) &&
                    Number(value) <
                        Number(
                            rules.min,
                        )
                ) {
                    errors[
                        String(
                            field.field_id,
                        )
                    ] =
                        `${field.label} cannot be less than ${rules.min}.`;
                }
            },
        );

        setFieldErrors(errors);

        return (
            Object.keys(errors)
                .length === 0
        );
    };

    /*
     * ---------------------------------------------------------
     * Save Form Details
     * ---------------------------------------------------------
     */

    const handleSaveFormDetails = () => {
        if (!selectedCompany) {
            setFormError(
                'Company selection is required.',
            );

            return;
        }

        if (!selectedContractor) {
            setFormError(
                'Contractor selection is required.',
            );

            return;
        }

        if (loadingSelectedContractor) {
            return;
        }

        if (savingDetails) {
            return;
        }

        /*
         * Validate only the editable/saved form data immediately
         * before sending the request. In edit mode this same handler
         * updates the existing form because form_id is included.
         */
        const isValid = validateFormDetails();

        if (!isValid) {
            setFormError(
                'Please fix the highlighted fields before saving.',
            );

            return;
        }

        setSavingDetails(true);
        setFormError(null);

        const saveUrl = is_admin
            ? `/admin/tax-forms/create/${formDefinition.id}`
            : `/tax-forms/create/${formDefinition.id}`;

        const payload = {
            ...(is_admin && owner_user_id
                ? { user_id: owner_user_id }
                : {}),
            ...(form_id !== null && form_id !== undefined
                ? { form_id: Number(form_id) }
                : {}),
            company_id: Number(selectedCompany.id),
            contractor_id: Number(selectedContractor.id),
            field_values: fieldValues,
        };

        console.log(
            form_id
                ? 'Updating tax form:'
                : 'Creating tax form:',
            {
                url: saveUrl,
                payload,
            },
        );

        router.post(
            saveUrl,
            payload,
            {
                preserveScroll: true,

                onStart: () => {
                    setSavingDetails(true);
                    setFormError(null);
                },

                onSuccess: () => {
                    /*
                     * The backend redirects to the appropriate
                     * tax-form list after a successful create/update.
                     */
                    setSavingDetails(false);
                },

                onError: (errors) => {
                    console.error(
                        'Save/update tax form errors:',
                        errors,
                    );

                    const nextErrors: Record<
                        string,
                        string
                    > = {};

                    Object.entries(errors).forEach(
                        ([key, value]) => {
                            const match = key.match(
                                /field_values\.(\d+)/,
                            );

                            if (
                                match &&
                                typeof value === 'string'
                            ) {
                                nextErrors[match[1]] =
                                    value;
                            }
                        },
                    );

                    setFieldErrors(nextErrors);

                    const firstError =
                        Object.values(errors)[0];

                    if (typeof firstError === 'string') {
                        setFormError(firstError);
                    } else {
                        setFormError(
                            'Unable to save the tax form. Please check the highlighted fields and try again.',
                        );
                    }
                },

                onFinish: () => {
                    setSavingDetails(false);
                },
            },
        );
    };

    /*
     * ---------------------------------------------------------
     * Back
     * ---------------------------------------------------------
     */

    const handleBack = () => {
        if (
            submittingForm ||
            savingDetails ||
            loadingSelectedContractor
        ) {
            return;
        }

        if (step === 3) {
            setStep(2);

            return;
        }

        if (step === 2) {
            setStep(1);

            return;
        }

        if (is_admin) {
            router.visit(
                '/admin/dashboard',
            );

            return;
        }

        router.visit(
            '/dashboard',
        );
    };

    /*
     * ---------------------------------------------------------
     * Render
     * ---------------------------------------------------------
     */

    return (
        <div className="space-y-6 p-6">
            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {form_id ? 'Edit' : 'Create'}{' '}
                        {formDefinition.name}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {step === 1 &&
                            'Select a company to continue.'}

                        {step === 2 &&
                            'Select a contractor to continue.'}

                        {step === 3 &&
                            'Enter tax information for this form.'}
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={
                        handleBack
                    }
                    disabled={
                        submittingForm ||
                        savingDetails
                    }
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* =====================================================
                STEPPER
            ====================================================== */}

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        {/* STEP 1 */}

                        <div className="flex items-center gap-3">
                            <div
                                className={[
                                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium',
                                    step >= 1
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 text-muted-foreground',
                                ].join(
                                    ' ',
                                )}
                            >
                                1
                            </div>

                            <div>
                                <p
                                    className={[
                                        'text-sm font-medium',
                                        step >= 1
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    ].join(
                                        ' ',
                                    )}
                                >
                                    Company
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Select company
                                </p>
                            </div>
                        </div>

                        <div className="mx-6 h-px flex-1 bg-border" />

                        {/* STEP 2 */}

                        <div className="flex items-center gap-3">
                            <div
                                className={[
                                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium',
                                    step >= 2
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 text-muted-foreground',
                                ].join(
                                    ' ',
                                )}
                            >
                                2
                            </div>

                            <div>
                                <p
                                    className={[
                                        'text-sm font-medium',
                                        step >= 2
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    ].join(
                                        ' ',
                                    )}
                                >
                                    Contractor
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Select contractor
                                </p>
                            </div>
                        </div>

                        <div className="mx-6 h-px flex-1 bg-border" />

                        {/* STEP 3 */}

                        <div className="flex items-center gap-3">
                            <div
                                className={[
                                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium',
                                    step >= 3
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 text-muted-foreground',
                                ].join(
                                    ' ',
                                )}
                            >
                                3
                            </div>

                            <div>
                                <p
                                    className={[
                                        'text-sm font-medium',
                                        step >= 3
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    ].join(
                                        ' ',
                                    )}
                                >
                                    Form Details
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Enter tax information
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* =====================================================
                FORM ERROR
            ====================================================== */}

            {formError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {formError}
                </div>
            )}

            {/* =====================================================
                STEP 1 - COMPANY
            ====================================================== */}

            {step === 1 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Select Company
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Select the company for
                                    this tax form.
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handleAddNewCompany
                                }
                                disabled={
                                    submittingForm ||
                                    savingDetails
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Company
                            </Button>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-6 p-6">
                        {companyError && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                {
                                    companyError
                                }
                            </div>
                        )}

                        <CompanySelector
                            companies={
                                companies
                            }
                            selectedCompanyId={
                                selectedCompany?.id ??
                                null
                            }
                            onSelect={
                                handleCompanyChange
                            }
                            loading={
                                loadingCompanies
                            }
                        />

                        {selectedCompany && (
                            <CompanyDetails
                                company={
                                    selectedCompany
                                }
                            />
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                type="button"
                                onClick={
                                    handleCompanyContinue
                                }
                                disabled={
                                    loadingCompanies ||
                                    loadingContractors ||
                                    submittingForm ||
                                    savingDetails ||
                                    !selectedCompany
                                }
                            >
                                {loadingContractors
                                    ? 'Loading Contractors...'
                                    : 'Continue'}

                                {!loadingContractors && (
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* =====================================================
                STEP 2 - CONTRACTOR
            ====================================================== */}

            {step === 2 &&
                selectedCompany && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <UserRound className="h-5 w-5" />
                                        Select Contractor
                                    </CardTitle>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Select a contractor
                                        for{' '}
                                        <span className="font-medium text-foreground">
                                            {selectedCompany.business_entity_name ||
                                                `${selectedCompany.payer_first_name} ${selectedCompany.payer_last_name}`}
                                        </span>
                                        .
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={
                                        handleAddNewContractor
                                    }
                                    disabled={
                                        submittingForm ||
                                        savingDetails ||
                                        loadingSelectedContractor
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Contractor
                                </Button>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-6 p-6">
                            {contractorError && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                    {
                                        contractorError
                                    }
                                </div>
                            )}

                            <ContractorSelector
                                contractors={
                                    contractors
                                }
                                selectedContractorId={
                                    selectedContractor?.id ??
                                    null
                                }
                                onSelect={
                                    handleContractorChange
                                }
                                loading={
                                    loadingContractors
                                }
                            />

                            {selectedContractor && (
                                <ContractorDetails
                                    contractor={
                                        selectedContractor
                                    }
                                />
                            )}

                            <div className="flex items-center justify-between pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setStep(
                                            1,
                                        )
                                    }
                                    disabled={
                                        submittingForm ||
                                        savingDetails
                                    }
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>

                                <Button
                                    type="button"
                                    onClick={
                                        handleContractorContinue
                                    }
                                    disabled={
                                        loadingContractors ||
                                        submittingForm ||
                                        savingDetails ||
                                        !selectedContractor
                                    }
                                >
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

            {/* =====================================================
                STEP 3 - FORM DETAILS
            ====================================================== */}

            {step === 3 && (
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>
                                    Form Details
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {form_id
                                        ? 'Update the required tax information for this form.'
                                        : 'Enter the required tax information for this form.'}
                                </p>
                            </div>
                        </CardHeader>

                        <Separator />

                        <CardContent className="space-y-8 p-6">
                            {form_fields.length ===
                            0 ? (
                                <div className="rounded-md border border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
                                    No form fields are configured for this tax form.
                                </div>
                            ) : (
                                Object.entries(groupedFormFields).map(
                                    ([sectionName, sectionFields]) => (
                                        <details
                                            key={sectionName}
                                            open={openSections[sectionName] ?? true}
                                            onToggle={(event) => {
                                                const isOpen = event.currentTarget.open;
                                                setOpenSections((current) => ({
                                                    ...current,
                                                    [sectionName]: isOpen,
                                                }));
                                            }}
                                            className="rounded-lg border bg-card"
                                        >
                                            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
                                                <span className="flex items-center gap-2">
                                                    {openSections[sectionName] ? (
                                                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                                    )}
                                                    <span className="capitalize">
                                                        {sectionName}
                                                    </span>
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {sectionFields.length} fields
                                                </span>
                                            </summary>
                                            <div className="space-y-5 border-t px-4 py-5">
                                                {sectionFields.some(isRegionField) && (
                                                    <div className="rounded-md border bg-muted/40 px-3 py-3">
                                                        <div className="text-xs text-muted-foreground">
                                                            Country used for state/region options
                                                        </div>
                                                        <div className="mt-1 font-medium">
                                                            {getCountryName() || 'No country selected'}
                                                        </div>
                                                        {!selectedContractor?.country_id && (
                                                            <p className="mt-1 text-sm text-destructive">
                                                                Select a contractor with a country before selecting a state/region.
                                                            </p>
                                                        )}
                                                        {stateRegionsError && (
                                                            <p className="mt-1 text-sm text-destructive">
                                                                {stateRegionsError}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {sectionFields.map(
                                    (
                                        field,
                                    ) => {
                                        const value =
                                            fieldValues[
                                                String(
                                                    field.field_id,
                                                )
                                            ];

                                        const error =
                                            fieldErrors[
                                                String(
                                                    field.field_id,
                                                )
                                            ];

                                        const inputType =
                                            field.input_type;

                                        const isAutoFilled =
                                            isAutoFilledField(field);

                                        return (
                                            <div
                                                key={
                                                    field.id
                                                }
                                                className="space-y-2"
                                            >
                                                {inputType !==
                                                    'checkbox' && (
                                                    <label
                                                        htmlFor={`field-${field.field_id}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        {
                                                            field.label
                                                        }

                                                        {field.is_required && (
                                                            <span className="ml-1 text-destructive">
                                                                *
                                                            </span>
                                                        )}
                                                    </label>
                                                )}

                                                {isRegionField(field) ? (
                                                    <select
                                                        id={`field-${field.field_id}`}
                                                        value={getRegionValue(value)}
                                                        onChange={(event) =>
                                                            handleFieldChange(
                                                                field.field_id,
                                                                event.target.value,
                                                            )
                                                        }
                                                        disabled={
                                                            isAutoFilled ||
                                                            stateRegionsLoading ||
                                                            !selectedContractor?.country_id
                                                        }
                                                        className={[
                                                            'h-10 w-full rounded-md border border-input px-3 text-sm outline-none',
                                                            isAutoFilled
                                                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                                                : 'bg-background focus:ring-2 focus:ring-ring',
                                                        ].join(' ')}
                                                    >
                                                        <option value="">
                                                            {stateRegionsLoading
                                                                ? 'Loading states/regions...'
                                                                : 'Select state/region'}
                                                        </option>
                                                        {stateRegions.map((region) => (
                                                            <option
                                                                key={region.id}
                                                                value={getRegionCode(region)}
                                                            >
                                                                {region.name}
                                                                {region.code
                                                                    ? ` (${region.code})`
                                                                    : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : inputType ===
                                                'textarea' ? (
                                                    <textarea
                                                        id={`field-${field.field_id}`}
                                                        value={
                                                            typeof value ===
                                                            'string'
                                                                ? value
                                                                : ''
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleFieldChange(
                                                                field.field_id,
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        readOnly={
                                                            isAutoFilled
                                                        }
                                                        aria-readonly={
                                                            isAutoFilled
                                                        }
                                                        className={[
                                                            'min-h-24 w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring',
                                                            isAutoFilled
                                                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                                                : 'bg-background',
                                                        ].join(' ')}
                                                    />
                                                ) : inputType ===
                                                  'select' ? (
                                                    <select
                                                        id={`field-${field.field_id}`}
                                                        value={
                                                            typeof value ===
                                                            'string'
                                                                ? value
                                                                : ''
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleFieldChange(
                                                                field.field_id,
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        disabled={
                                                            isAutoFilled
                                                        }
                                                        className={[
                                                            'h-10 w-full rounded-md border border-input px-3 text-sm outline-none',
                                                            isAutoFilled
                                                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                                                : 'bg-background',
                                                        ].join(' ')}
                                                    >
                                                        <option value="">
                                                            Select{' '}
                                                            {
                                                                field.label
                                                            }
                                                        </option>

                                                        {Array.isArray(
                                                            field.options,
                                                        ) &&
                                                            field.options.map(
                                                                (
                                                                    option,
                                                                    index,
                                                                ) => {
                                                                    const optionValue =
                                                                        typeof option ===
                                                                            'object' &&
                                                                        option !==
                                                                            null
                                                                            ? String(
                                                                                  (
                                                                                      option as {
                                                                                          value?: unknown;
                                                                                          label?: unknown;
                                                                                      }
                                                                                  )
                                                                                      .value ??
                                                                                      '',
                                                                              )
                                                                            : String(
                                                                                  option,
                                                                              );

                                                                    const optionLabel =
                                                                        typeof option ===
                                                                            'object' &&
                                                                        option !==
                                                                            null
                                                                            ? String(
                                                                                  (
                                                                                      option as {
                                                                                          value?: unknown;
                                                                                          label?: unknown;
                                                                                      }
                                                                                  )
                                                                                      .label ??
                                                                                      optionValue,
                                                                              )
                                                                            : String(
                                                                                  option,
                                                                              );

                                                                    return (
                                                                        <option
                                                                            key={`${field.field_id}-${index}`}
                                                                            value={
                                                                                optionValue
                                                                            }
                                                                        >
                                                                            {
                                                                                optionLabel
                                                                            }
                                                                        </option>
                                                                    );
                                                                },
                                                            )}
                                                    </select>
                                                ) : inputType ===
                                                  'checkbox' ? (
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            id={`field-${field.field_id}`}
                                                            type="checkbox"
                                                            checked={
                                                                value ===
                                                                true
                                                            }
                                                            onChange={(
                                                                event,
                                                            ) =>
                                                                handleFieldChange(
                                                                    field.field_id,
                                                                    event
                                                                        .target
                                                                        .checked,
                                                                )
                                                            }
                                                            disabled={
                                                                isAutoFilled
                                                            }
                                                            aria-readonly={
                                                                isAutoFilled
                                                            }
                                                            className="h-4 w-4 rounded border-input"
                                                        />

                                                        <label
                                                            htmlFor={`field-${field.field_id}`}
                                                            className="text-sm font-medium"
                                                        >
                                                            {
                                                                field.label
                                                            }

                                                            {field.is_required && (
                                                                <span className="ml-1 text-destructive">
                                                                    *
                                                                </span>
                                                            )}
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <input
                                                        id={`field-${field.field_id}`}
                                                        type={
                                                            inputType ===
                                                            'number'
                                                                ? 'number'
                                                                : 'text'
                                                        }
                                                        value={
                                                            typeof value ===
                                                            'string'
                                                                ? value
                                                                : ''
                                                        }
                                                        onChange={(
                                                            event,
                                                        ) =>
                                                            handleFieldChange(
                                                                field.field_id,
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        readOnly={
                                                            isAutoFilled
                                                        }
                                                        aria-readonly={
                                                            isAutoFilled
                                                        }
                                                        className={[
                                                            'h-10 w-full rounded-md border border-input px-3 text-sm outline-none',
                                                            isAutoFilled
                                                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                                                : 'bg-background focus:ring-2 focus:ring-ring',
                                                        ].join(' ')}
                                                    />
                                                )}

                                                {isAutoFilled && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Auto-filled from selected{' '}
                                                        {field.source_type === 'company'
                                                            ? 'company'
                                                            : 'contractor'}{' '}
                                                        and read-only.
                                                    </p>
                                                )}

                                                {error && (
                                                    <p className="text-sm text-destructive">
                                                        {
                                                            error
                                                        }
                                                    </p>
                                                )}

                                            </div>
                                        );
                                    },
                                )}
                                            </div>
                                        </details>
                                    ),
                                )
                            )}

                            <div className="flex items-center justify-between border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setStep(
                                            2,
                                        )
                                    }
                                    disabled={
                                        savingDetails
                                    }
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>

                                <Button
                                    type="button"
                                    onClick={
                                        handleSaveFormDetails
                                    }
                                    disabled={
                                        savingDetails ||
                                        loadingSelectedContractor ||
                                        form_fields.length ===
                                            0
                                    }
                                >
                                    {savingDetails
                                        ? (form_id
                                            ? 'Updating...'
                                            : 'Saving...')
                                        : (form_id
                                            ? 'Save Changes'
                                            : 'Save & Complete')}

                                    {!savingDetails && (
                                        <Check className="ml-2 h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
        </div>
    );
}