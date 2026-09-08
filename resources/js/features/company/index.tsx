import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { type Company } from './types';
import { CompanyDrawer } from './components/company-drawer';
import { CompanyTable } from './components/company-table';

interface CompanyFeatureProps {
    companies: Company[];
    storeUrl: string;
    updateBaseUrl: string;
    viewBaseUrl: string;
    returnTo?: string | null;
    ownerUserId?: number | string | null;
}

export function CompanyFeature({
    companies,
    storeUrl,
    updateBaseUrl,
    viewBaseUrl,
    returnTo = null,
    ownerUserId = null,
}: CompanyFeatureProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [selectedCompany, setSelectedCompany] =
        useState<Company | undefined>();

    const handleAdd = () => {
        setSelectedCompany(undefined);
        setDrawerOpen(true);
    };

    const handleEdit = (company: Company) => {
        setSelectedCompany(company);
        setDrawerOpen(true);
    };

    const handleViewUrl = (company: Company) => {
        return `${viewBaseUrl}/${company.id}`;
    };

    const handleDrawerChange = (open: boolean) => {
        setDrawerOpen(open);

        if (!open) {
            setSelectedCompany(undefined);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Companies
                    </h2>

                    <p className="text-muted-foreground">
                        Manage your companies here.
                    </p>
                </div>

                <Button onClick={handleAdd}>
                    <Plus className="mr-2 size-4" />
                    Add Company
                </Button>
            </div>

            <div className="rounded-xl border bg-card">
                <CompanyTable
                    companies={companies ?? []}
                    onEdit={handleEdit}
                    viewUrl={handleViewUrl}
                />
            </div>

            <CompanyDrawer
                open={drawerOpen}
                onOpenChange={handleDrawerChange}
                company={selectedCompany}
                storeUrl={storeUrl}
                updateBaseUrl={updateBaseUrl}
                returnTo={returnTo}
                ownerUserId={ownerUserId}
            />
        </div>
    );
}