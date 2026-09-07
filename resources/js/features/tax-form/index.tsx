import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

import { TaxFormList } from './components/tax-form-list';
import type { FormDefinition } from './types';

interface TaxFormsProps {
    definitions: FormDefinition[];
}

export function TaxForms({
    definitions,
}: TaxFormsProps) {
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
                            Manage tax form definitions and field configurations.
                        </p>
                    </div>
                </div>

                <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                    <TaxFormList
                        definitions={definitions}
                    />
                </div>
            </Main>
        </>
    );
}