import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

import { CreatedTaxFormList } from '@/features/tax-form/components/created-tax-form-list';

export interface CreatedTaxForm {
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

interface TaxFormsPageProps {
    forms: CreatedTaxForm[];
    isAdmin: boolean;
}

export default function TaxFormsPage({
    forms,
}: TaxFormsPageProps) {
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
                <div className="mb-2 flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Tax Forms
                        </h2>

                        <p className="text-muted-foreground">
                            View and manage your created tax forms.
                        </p>
                    </div>
                </div>

                <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                    <CreatedTaxFormList
                        forms={forms}
                        isAdmin={false}
                    />
                </div>
            </Main>
        </>
    );
}