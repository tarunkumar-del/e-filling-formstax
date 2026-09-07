import { TaxForms } from '@/features/tax-form';

import type { FormDefinition } from '@/features/tax-form/types';

interface TaxFormsPageProps {
    definitions: FormDefinition[];
}

export default function TaxFormsPage({
    definitions,
}: TaxFormsPageProps) {
    return (
        <TaxForms
            definitions={definitions}
        />
    );
}