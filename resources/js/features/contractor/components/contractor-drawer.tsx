import { useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';

import { ContractorForm } from './contractor-form';

import type { Contractor } from '../types';

interface ContractorDrawerProps {
    companyId: number;
    contractor?: Contractor | null;
    isAdmin?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ContractorDrawer({
    companyId,
    contractor = null,
    isAdmin = false,
    open: controlledOpen,
    onOpenChange,
}: ContractorDrawerProps) {
    const [internalOpen, setInternalOpen] =
        useState(false);

    const isControlled =
        controlledOpen !== undefined;

    const open = isControlled
        ? controlledOpen
        : internalOpen;

    function setOpen(value: boolean) {
        if (!isControlled) {
            setInternalOpen(value);
        }

        onOpenChange?.(value);
    }

    const isEditing = Boolean(contractor);

    return (
        <>
            {!isControlled && (
                <Button
                    type="button"
                    onClick={() => setOpen(true)}
                >
                    Add Contractor
                </Button>
            )}

            <Sheet
                open={open}
                onOpenChange={setOpen}
            >
                <SheetContent
                    side="right"
                    className="w-full overflow-y-auto sm:max-w-2xl"
                >
                    <SheetHeader>
                        <SheetTitle>
                            {isEditing
                                ? 'Edit Contractor'
                                : 'Add Contractor'}
                        </SheetTitle>

                        <SheetDescription>
                            {isEditing
                                ? 'Update contractor information.'
                                : 'Enter the contractor information below.'}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4 pb-6">
                        <ContractorForm
                            companyId={companyId}
                            contractor={contractor}
                            isAdmin={isAdmin}
                            onSuccess={() =>
                                setOpen(false)
                            }
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}