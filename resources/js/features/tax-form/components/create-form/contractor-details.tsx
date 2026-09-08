import { UserRound } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import type {
    CreateFormContractor,
} from '../../types';

interface ContractorDetailsProps {
    contractor: CreateFormContractor;
}

export function ContractorDetails({
    contractor,
}: ContractorDetailsProps) {
    const name =
        `${contractor.first_name} ${contractor.last_name}`.trim();

    return (
        <div className="rounded-xl border bg-muted/20">
            <div className="flex items-center gap-3 p-5">
                <div className="flex size-9 items-center justify-center rounded-lg border bg-background">
                    <UserRound className="size-4 text-muted-foreground" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold">
                        Contractor Details
                    </h3>

                    <p className="text-xs text-muted-foreground">
                        Selected contractor information
                    </p>
                </div>
            </div>

            <Separator />

            <div className="grid gap-5 p-5 sm:grid-cols-2">
                <Detail
                    label="Name"
                    value={name}
                />

                <Detail
                    label="Tax ID"
                    value={
                        contractor.tax_id
                    }
                />

                <Detail
                    label="Email"
                    value={
                        contractor.email
                    }
                />

                <Detail
                    label="Phone"
                    value={
                        contractor.phone
                    }
                />

                <Detail
                    label="Address"
                    value={[
                        contractor.address_1,
                        contractor.address_2,
                        contractor.postal_code,
                    ]
                        .filter(Boolean)
                        .join(', ')}
                />
            </div>
        </div>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value:
        | string
        | null
        | undefined;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
                {label}
            </p>

            <p className="text-sm">
                {value || '—'}
            </p>
        </div>
    );
}