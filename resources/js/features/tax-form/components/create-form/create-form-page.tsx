import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
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
} from '../../types';

interface CreateFormPagePropsWithContext extends CreateFormPageProps {
    owner_user_id?: number;
    is_admin?: boolean;
}

export default function CreateFormPage({
    formDefinition,
    companies: initialCompanies = [],
    owner_user_id,
    is_admin = false,
}: CreateFormPagePropsWithContext) {
    const [step, setStep] = useState<1 | 2>(1);

    const [companies, setCompanies] =
        useState<CreateFormCompany[]>(initialCompanies);

    const [selectedCompany, setSelectedCompany] =
        useState<CreateFormCompany | null>(null);

    const [contractors, setContractors] =
        useState<CreateFormContractor[]>([]);

    const [selectedContractor, setSelectedContractor] =
        useState<CreateFormContractor | null>(null);

    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [loadingContractors, setLoadingContractors] = useState(false);

    const [companyError, setCompanyError] =
        useState<string | null>(null);

    const [contractorError, setContractorError] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | URL RETURN CONTEXT
    |--------------------------------------------------------------------------
    |
    | We keep the current tax-form URL so that when the user creates
    | a new Company or Contractor, the existing create page can return
    | back here.
    |
    */

    const getCurrentTaxFormUrl = () => {
        return `${window.location.pathname}${window.location.search}`;
    };

    /*
    |--------------------------------------------------------------------------
    | Load Companies
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadCompanies();

        const params = new URLSearchParams(window.location.search);

        const companyId = params.get('company_id');

        if (companyId) {
            const parsedCompanyId = Number(companyId);

            const company = initialCompanies.find(
                (item) => item.id === parsedCompanyId,
            );

            if (company) {
                setSelectedCompany(company);

                loadContractors(parsedCompanyId);
                setStep(2);
            }
        }
    }, [owner_user_id, is_admin]);

    const loadCompanies = async () => {
        setLoadingCompanies(true);
        setCompanyError(null);

        try {
            const params = new URLSearchParams();

            if (is_admin && owner_user_id) {
                params.set(
                    'user_id',
                    String(owner_user_id),
                );
            }

            const query = params.toString();

            const response = await fetch(
                `/tax-forms/create/companies${
                    query ? `?${query}` : ''
                }`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(
                    'Unable to load companies.',
                );
            }

            const data = await response.json();

            setCompanies(data.companies ?? []);

            /*
            |--------------------------------------------------------------------------
            | Auto-select newly created Company
            |--------------------------------------------------------------------------
            */

            const paramsFromUrl =
                new URLSearchParams(
                    window.location.search,
                );

            const companyId =
                paramsFromUrl.get('company_id');

            if (companyId) {
                const parsedCompanyId =
                    Number(companyId);

                const newCompany = (
                    data.companies ?? []
                ).find(
                    (company: CreateFormCompany) =>
                        company.id === parsedCompanyId,
                );

                if (newCompany) {
                    setSelectedCompany(newCompany);

                    await loadContractors(
                        parsedCompanyId,
                    );

                    setStep(2);
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
    |--------------------------------------------------------------------------
    | Company Changed
    |--------------------------------------------------------------------------
    */

    const handleCompanyChange = (
        company: CreateFormCompany | null,
    ) => {
        setSelectedCompany(company);

        setSelectedContractor(null);
        setContractors([]);

        setContractorError(null);
        setCompanyError(null);

        setStep(1);
    };

    /*
    |--------------------------------------------------------------------------
    | Load Contractors
    |--------------------------------------------------------------------------
    */

    const loadContractors = async (
        companyId: number,
    ) => {
        setLoadingContractors(true);
        setContractorError(null);

        try {
            const params = new URLSearchParams();

            params.set(
                'company_id',
                String(companyId),
            );

            if (is_admin && owner_user_id) {
                params.set(
                    'user_id',
                    String(owner_user_id),
                );
            }

            const response = await fetch(
                `/tax-forms/create/contractors?${params.toString()}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(
                    'Unable to load contractors.',
                );
            }

            const data = await response.json();

            setContractors(
                data.contractors ?? [],
            );

            /*
            |--------------------------------------------------------------------------
            | Auto-select newly created Contractor
            |--------------------------------------------------------------------------
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

                const newContractor = (
                    data.contractors ?? []
                ).find(
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

                    setStep(2);
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
    |--------------------------------------------------------------------------
    | Company Continue
    |--------------------------------------------------------------------------
    */

    const handleCompanyContinue = async () => {
        if (!selectedCompany) {
            setCompanyError(
                'Please select a company first.',
            );

            return;
        }

        setSelectedContractor(null);

        await loadContractors(
            selectedCompany.id,
        );

        setStep(2);
    };

    /*
    |--------------------------------------------------------------------------
    | Contractor Changed
    |--------------------------------------------------------------------------
    */

    const handleContractorChange = (
        contractor: CreateFormContractor | null,
    ) => {
        setSelectedContractor(contractor);

        setContractorError(null);
    };

    /*
    |--------------------------------------------------------------------------
    | Contractor Continue
    |--------------------------------------------------------------------------
    */

    const handleContractorContinue = () => {
        if (!selectedCompany) {
            return;
        }

        if (!selectedContractor) {
            setContractorError(
                'Please select a contractor first.',
            );

            return;
        }

        console.log('Tax form selection:', {
            formDefinitionId:
                formDefinition.id,

            userId: owner_user_id,

            companyId:
                selectedCompany.id,

            contractorId:
                selectedContractor.id,
        });

        /*
        |--------------------------------------------------------------------------
        | Next Step
        |--------------------------------------------------------------------------
        |
        | Dynamic tax form fields will be implemented here.
        |
        */
    };

    /*
    |--------------------------------------------------------------------------
    | Add New Company
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Existing Company create flow lives under /companies.
    |
    | We pass the current tax-form URL so the Company page can return
    | to this exact form after creating the Company.
    |
    */

    const handleAddNewCompany = () => {
        const returnTo =
            getCurrentTaxFormUrl();

        const params =
            new URLSearchParams();

        params.set(
            'return_to',
            returnTo,
        );

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        |
        | Admin is creating the Company on behalf of the
        | selected simple user.
        |
        */

        if (is_admin && owner_user_id) {
            params.set(
                'user_id',
                String(owner_user_id),
            );
        }

        router.visit(
            `/companies?${params.toString()}`,
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Add New Contractor
    |--------------------------------------------------------------------------
    |
    | Contractor is nested under Company in the existing application.
    |
    | Normal user:
    | /companies/{company}/contractors
    |
    | Admin:
    | /admin/companies/{company}/contractors
    |
    */

    const handleAddNewContractor = () => {
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
        |--------------------------------------------------------------------------
        | Admin Contractor URL
        |--------------------------------------------------------------------------
        */

        if (is_admin) {
            router.visit(
                `/admin/companies/${selectedCompany.id}/contractors?${params.toString()}`,
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Normal User Contractor URL
        |--------------------------------------------------------------------------
        */

        router.visit(
            `/companies/${selectedCompany.id}/contractors?${params.toString()}`,
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Back
    |--------------------------------------------------------------------------
    */

    const handleBack = () => {
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

    return (
        <div className="space-y-6 p-6">
            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create {formDefinition.name}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Select a company and contractor
                        to continue.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            </div>

            {/* =========================================================
                STEPPER
            ========================================================= */}

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center">
                        {/* COMPANY */}

                        <div className="flex items-center gap-3">
                            <div
                                className={[
                                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium',
                                    'border-primary bg-primary text-primary-foreground',
                                ].join(' ')}
                            >
                                1
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Company
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Select company
                                </p>
                            </div>
                        </div>

                        <div className="mx-6 h-px flex-1 bg-border" />

                        {/* CONTRACTOR */}

                        <div className="flex items-center gap-3">
                            <div
                                className={[
                                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium',
                                    step === 2
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted-foreground/30 text-muted-foreground',
                                ].join(' ')}
                            >
                                2
                            </div>

                            <div>
                                <p
                                    className={[
                                        'text-sm font-medium',
                                        step === 2
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    ].join(' ')}
                                >
                                    Contractor
                                </p>

                                <p className="text-xs text-muted-foreground">
                                    Select contractor
                                </p>
                            </div>
                        </div>

                        <div className="mx-6 h-px flex-1 bg-border" />

                        {/* FORM DETAILS */}

                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-muted-foreground/30 text-sm font-medium text-muted-foreground">
                                3
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
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

            {/* =========================================================
                COMPANY STEP
            ========================================================= */}

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
                                {companyError}
                            </div>
                        )}

                        <CompanySelector
                            companies={companies}
                            value={selectedCompany}
                            onChange={
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

            {/* =========================================================
                CONTRACTOR STEP
            ========================================================= */}

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
                                    {contractorError}
                                </div>
                            )}

                            <ContractorSelector
                                contractors={
                                    contractors
                                }
                                value={
                                    selectedContractor
                                }
                                onChange={
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
                                        setStep(1)
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
        </div>
    );
}