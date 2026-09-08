import {
    Building2,
    ChevronDown,
    Loader2,
    Search,
} from 'lucide-react';

import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type { CreateFormCompany } from '../../types';

interface CompanySelectorProps {
    companies: CreateFormCompany[];
    selectedCompanyId: number | null;
    onSelect: (companyId: number) => void;
    loading?: boolean;
}

export function CompanySelector({
    companies,
    selectedCompanyId,
    onSelect,
    loading = false,
}: CompanySelectorProps) {
    const [search, setSearch] = useState('');

    const filteredCompanies = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return companies;
        }

        return companies.filter((company) => {
            const businessName =
                company.business_entity_name ?? '';

            const contactName =
                company.payer_contact_name ?? '';

            const email =
                company.email ?? '';

            const taxId =
                company.tax_id ?? '';

            return (
                businessName
                    .toLowerCase()
                    .includes(value) ||
                contactName
                    .toLowerCase()
                    .includes(value) ||
                email
                    .toLowerCase()
                    .includes(value) ||
                taxId
                    .toLowerCase()
                    .includes(value)
            );
        });
    }, [companies, search]);

    if (loading) {
        return (
            <div className="flex h-10 items-center justify-center rounded-md border">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                Company
            </label>

            <Select
                value={
                    selectedCompanyId
                        ? String(selectedCompanyId)
                        : ''
                }
                onValueChange={(value) =>
                    onSelect(Number(value))
                }
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                </SelectTrigger>

                <SelectContent>
                    <div className="sticky top-0 z-10 border-b bg-popover p-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value,
                                    )
                                }
                                onKeyDown={(event) =>
                                    event.stopPropagation()
                                }
                                placeholder="Search companies..."
                                className="h-9 pl-8"
                            />
                        </div>
                    </div>

                    {filteredCompanies.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                            <Building2 className="mx-auto mb-2 size-5" />

                            No companies found.
                        </div>
                    ) : (
                        filteredCompanies.map(
                            (company) => {
                                const name =
                                    company.business_entity_name ||
                                    `${company.payer_first_name} ${company.payer_last_name}`;

                                return (
                                    <SelectItem
                                        key={company.id}
                                        value={String(
                                            company.id,
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {name}
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                {company.email}
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            },
                        )
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}