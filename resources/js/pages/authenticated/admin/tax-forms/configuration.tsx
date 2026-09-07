import { TaxFormConfiguration } from '@/features/tax-form/components/tax-form-configuration';
import type { FormField } from '@/features/tax-form/types';

interface TaxFormConfigurationPageProps {
    formDefinitionId: number;
    fields: FormField[];
}

export default function TaxFormConfigurationPage({
    formDefinitionId,
    fields,
}: TaxFormConfigurationPageProps) {
    return (
        <TaxFormConfiguration
            formDefinitionId={formDefinitionId}
            fields={fields}
        />
    );
}