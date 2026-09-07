import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { ContractorDrawer } from './contractor-drawer';

import type { Contractor } from '../types';

interface ContractorTableProps {
    companyId: number;
    contractors: Contractor[];
    isAdmin?: boolean;
}

export function ContractorTable({
    companyId,
    contractors,
    isAdmin = false,
}: ContractorTableProps) {
    const [search, setSearch] = useState('');

    const [editingContractor, setEditingContractor] =
        useState<Contractor | null>(null);

    const [viewingContractor, setViewingContractor] =
        useState<Contractor | null>(null);

    const [drawerOpen, setDrawerOpen] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredContractors = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return contractors;
        }

        return contractors.filter((contractor) => {
            const fullName = [
                contractor.first_name,
                contractor.middle_initial,
                contractor.last_name,
                contractor.suffix,
            ]
                .filter(Boolean)
                .join(' ');

            const values = [
                fullName,

                contractor.first_name,
                contractor.middle_initial,
                contractor.last_name,
                contractor.suffix,

                contractor.business_entity_name,

                contractor.tax_id_type,
                contractor.tax_id,

                contractor.address_1,
                contractor.address_2,

                contractor.country?.name,
                contractor.country?.code,

                contractor.region?.name,
                contractor.region?.code,

                contractor.city?.name,
                contractor.city?.code,

                contractor.postal,
                contractor.phone,
                contractor.email,
            ];

            return values.some(
                (value) =>
                    value != null &&
                    String(value)
                        .toLowerCase()
                        .includes(query),
            );
        });
    }, [contractors, search]);

    /*
    |--------------------------------------------------------------------------
    | Edit Contractor
    |--------------------------------------------------------------------------
    */

    function openEdit(contractor: Contractor) {
        setViewingContractor(null);
        setEditingContractor(contractor);
        setDrawerOpen(true);
    }

    /*
    |--------------------------------------------------------------------------
    | View Contractor
    |--------------------------------------------------------------------------
    */

    function openView(contractor: Contractor) {
        setEditingContractor(null);
        setDrawerOpen(false);
        setViewingContractor(contractor);
    }

    /*
    |--------------------------------------------------------------------------
    | Edit Drawer
    |--------------------------------------------------------------------------
    */

    function handleDrawerChange(open: boolean) {
        setDrawerOpen(open);

        if (!open) {
            setEditingContractor(null);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Contractor Name
    |--------------------------------------------------------------------------
    */

    function getContractorName(
        contractor: Contractor,
    ): string {
        const name = [
            contractor.first_name,
            contractor.middle_initial,
            contractor.last_name,
            contractor.suffix,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            name ||
            contractor.business_entity_name ||
            'Unnamed Contractor'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Display Helper
    |--------------------------------------------------------------------------
    */

    function displayValue(
        value: string | number | null | undefined,
    ) {
        return value || '—';
    }

    return (
        <div className="space-y-4">
            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        Contractors
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Manage contractors associated with this
                        company.
                    </p>
                </div>

                <ContractorDrawer
                    companyId={companyId}
                    isAdmin={isAdmin}
                />
            </div>

            {/* =========================================================
                SEARCH
            ========================================================= */}

            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search contractors..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    className="max-w-sm"
                />

                {search && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearch('')}
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* =========================================================
                RESULT COUNT
            ========================================================= */}

            {contractors.length > 0 && (
                <p className="text-sm text-muted-foreground">
                    {search
                        ? `${filteredContractors.length} of ${contractors.length} contractors`
                        : `${contractors.length} contractor${
                              contractors.length === 1
                                  ? ''
                                  : 's'
                          }`}
                </p>
            )}

            {/* =========================================================
                EMPTY STATE
            ========================================================= */}

            {filteredContractors.length === 0 ? (
                <div className="rounded-lg border p-8 text-center">
                    <h4 className="font-medium">
                        {search
                            ? 'No contractors found'
                            : 'No contractors yet'}
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {search
                            ? 'Try changing your search.'
                            : 'Add a contractor to get started.'}
                    </p>
                </div>
            ) : (
                /* =====================================================
                   TABLE
                ===================================================== */

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left font-medium">
                                    Contractor
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Business / Entity
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Country
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Region
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    City
                                </th>

                                <th className="px-4 py-3 text-left font-medium">
                                    Email
                                </th>

                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredContractors.map(
                                (contractor) => (
                                    <tr
                                        key={contractor.id}
                                        className="border-b last:border-0 hover:bg-muted/30"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {getContractorName(
                                                contractor,
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {displayValue(
                                                contractor.business_entity_name,
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {displayValue(
                                                contractor.country
                                                    ?.name,
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {displayValue(
                                                contractor.region
                                                    ?.name,
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {displayValue(
                                                contractor.city
                                                    ?.name,
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {displayValue(
                                                contractor.email,
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openView(
                                                            contractor,
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEdit(
                                                            contractor,
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* =========================================================
                EDIT DRAWER
            ========================================================= */}

            <ContractorDrawer
                companyId={companyId}
                contractor={editingContractor}
                isAdmin={isAdmin}
                open={drawerOpen}
                onOpenChange={handleDrawerChange}
            />

            {/* =========================================================
                VIEW CONTRACTOR - CENTER MODAL
            ========================================================= */}

            <Dialog
                open={!!viewingContractor}
                onOpenChange={(open) => {
                    if (!open) {
                        setViewingContractor(null);
                    }
                }}
            >
                <DialogContent
                    className="
                        w-[calc(100%-2rem)]
                        max-w-4xl
                        h-[90vh]
                        max-h-[90vh]
                        overflow-hidden
                        p-0
                    "
                >
                    {viewingContractor && (
                        <div className="flex h-full min-h-0 flex-col">
                            {/* =============================================
                                FIXED HEADER
                            ============================================= */}

                            <DialogHeader className="shrink-0 border-b px-8 py-6">
                                <DialogTitle className="pr-10 text-xl">
                                    {getContractorName(
                                        viewingContractor,
                                    )}
                                </DialogTitle>

                                <DialogDescription className="text-sm">
                                    Contractor details
                                </DialogDescription>
                            </DialogHeader>

                            {/* =============================================
                                SCROLLABLE CONTENT

                                IMPORTANT:
                                Only this area scrolls.
                            ============================================= */}

                            <div className="min-h-0 flex-1 overflow-y-auto">
                                <div className="space-y-8 px-8 py-8">
                                    {/* =====================================
                                        TAX INFORMATION
                                    ===================================== */}

                                    <section className="space-y-5">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Tax Information
                                            </h3>

                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Contractor tax
                                                identification
                                                information.
                                            </p>
                                        </div>

                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <DetailItem
                                                label="Tax ID Type"
                                                value={
                                                    viewingContractor.tax_id_type
                                                }
                                            />

                                            <DetailItem
                                                label="Tax ID"
                                                value={
                                                    viewingContractor.tax_id
                                                }
                                            />
                                        </div>
                                    </section>

                                    {/* =====================================
                                        RECIPIENT INFORMATION
                                    ===================================== */}

                                    <section className="space-y-5 border-t pt-8">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Recipient Information
                                            </h3>
                                        </div>

                                        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                                            <DetailItem
                                                label="First Name"
                                                value={
                                                    viewingContractor.first_name
                                                }
                                            />

                                            <DetailItem
                                                label="Middle Initial"
                                                value={
                                                    viewingContractor.middle_initial
                                                }
                                            />

                                            <DetailItem
                                                label="Last Name"
                                                value={
                                                    viewingContractor.last_name
                                                }
                                            />

                                            <DetailItem
                                                label="Suffix"
                                                value={
                                                    viewingContractor.suffix
                                                }
                                            />

                                            <div className="sm:col-span-2">
                                                <DetailItem
                                                    label="Business or Entity Name"
                                                    value={
                                                        viewingContractor.business_entity_name
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* =====================================
                                        ADDRESS
                                    ===================================== */}

                                    <section className="space-y-5 border-t pt-8">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Address
                                            </h3>
                                        </div>

                                        <div className="space-y-7">
                                            <DetailItem
                                                label="Address 1"
                                                value={
                                                    viewingContractor.address_1
                                                }
                                            />

                                            <DetailItem
                                                label="Address 2"
                                                value={
                                                    viewingContractor.address_2
                                                }
                                            />

                                            <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                                                <DetailItem
                                                    label="Country"
                                                    value={
                                                        viewingContractor
                                                            .country
                                                            ?.name
                                                    }
                                                />

                                                <DetailItem
                                                    label="Region"
                                                    value={
                                                        viewingContractor
                                                            .region
                                                            ?.name
                                                    }
                                                />

                                                <DetailItem
                                                    label="City"
                                                    value={
                                                        viewingContractor
                                                            .city
                                                            ?.name
                                                    }
                                                />

                                                <DetailItem
                                                    label="Postal"
                                                    value={
                                                        viewingContractor.postal
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </section>

                                    {/* =====================================
                                        CONTACT INFORMATION
                                    ===================================== */}

                                    <section className="space-y-5 border-t pt-8">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                Contact Information
                                            </h3>
                                        </div>

                                        <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                                            <DetailItem
                                                label="Phone"
                                                value={
                                                    viewingContractor.phone
                                                }
                                            />

                                            <DetailItem
                                                label="Email"
                                                value={
                                                    viewingContractor.email
                                                }
                                            />
                                        </div>
                                    </section>

                                    {/* =====================================
                                        ACTIONS
                                    ===================================== */}

                                    <div className="flex justify-end border-t pt-7">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                openEdit(
                                                    viewingContractor,
                                                )
                                            }
                                        >
                                            Edit Contractor
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Detail Item
|--------------------------------------------------------------------------
*/

interface DetailItemProps {
    label: string;
    value: string | number | null | undefined;
}

function DetailItem({
    label,
    value,
}: DetailItemProps) {
    return (
        <div className="min-w-0 space-y-1.5">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="break-words text-base font-medium">
                {value || '—'}
            </p>
        </div>
    );
}