import {
    Search,
    UserRound,
} from 'lucide-react';

import {
    useMemo,
    useState,
} from 'react';

import { Input } from '@/components/ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import type {
    CreateFormContractor,
} from '../../types';

interface ContractorSelectorProps {
    contractors: CreateFormContractor[];
    selectedContractorId: number | null;
    onSelect: (contractorId: number) => void;
    loading?: boolean;
}

export function ContractorSelector({
    contractors,
    selectedContractorId,
    onSelect,
    loading = false,
}: ContractorSelectorProps) {
    const [search, setSearch] = useState('');

    const filteredContractors = useMemo(() => {
        const value = search
            .trim()
            .toLowerCase();

        if (!value) {
            return contractors;
        }

        return contractors.filter(
            (contractor) => {
                const firstName =
                    contractor.first_name ?? '';

                const lastName =
                    contractor.last_name ?? '';

                const email =
                    contractor.email ?? '';

                const taxId =
                    contractor.tax_id ?? '';

                return (
                    firstName
                        .toLowerCase()
                        .includes(value) ||
                    lastName
                        .toLowerCase()
                        .includes(value) ||
                    email
                        .toLowerCase()
                        .includes(value) ||
                    taxId
                        .toLowerCase()
                        .includes(value)
                );
            },
        );
    }, [contractors, search]);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">
                Contractor
            </label>

            <Select
                value={
                    selectedContractorId
                        ? String(
                              selectedContractorId,
                          )
                        : ''
                }
                onValueChange={(value) =>
                    onSelect(Number(value))
                }
                disabled={loading}
            >
                <SelectTrigger className="w-full">
                    <SelectValue
                        placeholder={
                            loading
                                ? 'Loading contractors...'
                                : 'Select a contractor'
                        }
                    />
                </SelectTrigger>

                <SelectContent>
                    <div className="sticky top-0 z-10 border-b bg-popover p-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

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
                                onKeyDown={(
                                    event,
                                ) =>
                                    event.stopPropagation()
                                }
                                placeholder="Search contractors..."
                                className="h-9 pl-8"
                            />
                        </div>
                    </div>

                    {filteredContractors.length ===
                    0 ? (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                            <UserRound className="mx-auto mb-2 size-5" />

                            No contractors found.
                        </div>
                    ) : (
                        filteredContractors.map(
                            (contractor) => {
                                const name = `${contractor.first_name} ${contractor.last_name}`.trim();

                                return (
                                    <SelectItem
                                        key={
                                            contractor.id
                                        }
                                        value={String(
                                            contractor.id,
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {name ||
                                                    'Unnamed Contractor'}
                                            </span>

                                            <span className="text-xs text-muted-foreground">
                                                {contractor.email ||
                                                    contractor.tax_id}
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