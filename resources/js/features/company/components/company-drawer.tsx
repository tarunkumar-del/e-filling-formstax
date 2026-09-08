import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { type Company } from '@/features/company/types';
import { CompanyForm } from './company-form';

interface CompanyDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    company?: Company;

    storeUrl: string;
    updateBaseUrl: string;

    returnTo?: string | null;
    ownerUserId?: number | string | null;
}

export function CompanyDrawer({
    open,
    onOpenChange,
    company,
    storeUrl,
    updateBaseUrl,
    returnTo = null,
    ownerUserId = null,
}: CompanyDrawerProps) {
    if (!open) {
        return null;
    }

    const isEdit = !!company;

    const updateUrl =
        isEdit && company
            ? `${updateBaseUrl}/${company.id}`
            : undefined;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                onClick={() => onOpenChange(false)}
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l bg-background shadow-2xl">
                <div className="flex items-center justify-between px-6 py-5">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                            {isEdit
                                ? 'Edit Company'
                                : 'Add New Company'}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            {isEdit
                                ? 'Update company information.'
                                : 'Add a new company to your account.'}
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                <Separator />

                <div className="flex-1 overflow-y-auto">
                    <CompanyForm
                        company={company}
                        storeUrl={storeUrl}
                        updateUrl={updateUrl}
                        returnTo={returnTo}
                        ownerUserId={ownerUserId}
                        onSuccess={() => onOpenChange(false)}
                    />
                </div>
            </aside>
        </div>
    );
}