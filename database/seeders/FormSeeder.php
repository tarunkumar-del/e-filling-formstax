<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FormSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | 1. FORM TYPES
        |--------------------------------------------------------------------------
        */

        $necTypeId = DB::table('form_types')->insertGetId([
            'code' => '1099-NEC',
            'name' => '1099-NEC',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $miscTypeId = DB::table('form_types')->insertGetId([
            'code' => '1099-MISC',
            'name' => '1099-MISC',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | 2. FORM DEFINITIONS
        |--------------------------------------------------------------------------
        */

        $necDefinitionId = DB::table('form_definitions')->insertGetId([
            'form_type_id' => $necTypeId,
            'tax_year' => 2025,
            'name' => '2025 Form 1099-NEC',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $miscDefinitionId = DB::table('form_definitions')->insertGetId([
            'form_type_id' => $miscTypeId,
            'tax_year' => 2025,
            'name' => '2025 Form 1099-MISC',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        /*
        |--------------------------------------------------------------------------
        | 3. REUSABLE MASTER FIELDS
        |--------------------------------------------------------------------------
        */

        $fields = [

            /*
            |--------------------------------------------------------------------------
            | COMPANY
            |--------------------------------------------------------------------------
            */

            [
                'field_key' => 'company_tax_id',
                'label' => 'Company Tax ID',
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'tax_id',
                'validation_rules' => [
                    'required' => true,
                    'maxLength' => 9,
                    'description' => 'Tax ID must be 9 numeric digits.',
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_first_name',
                'label' => "Company's first name",
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'payer_first_name',
                'validation_rules' => [
                    'maxLength' => 20,
                    'required_if' => [
                        'source_type' => 'company',
                        'source_key' => 'tax_id_type',
                        'value' => 'SSN',
                    ],
                    'allowedCharacters' => 'letters, single spaces, hyphens',
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_last_name',
                'label' => "Company's last name",
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'payer_last_name',
                'validation_rules' => [
                    'maxLength' => 20,
                    'required_if' => [
                        'source_type' => 'company',
                        'source_key' => 'tax_id_type',
                        'value' => 'SSN',
                    ],
                    'allowedCharacters' => 'letters, single spaces, hyphens',
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_business_name',
                'label' => "Company's business or entity name",
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'business_entity_name',
                'validation_rules' => [
                    'maxLength' => 40,
                    'required_if' => [
                        'source_type' => 'company',
                        'source_key' => 'tax_id_type',
                        'value' => 'EIN',
                    ],
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_address_1',
                'label' => 'Company street address 1',
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'address_1',
                'validation_rules' => [
                    'required' => true,
                    'minLength' => 1,
                    'maxLength' => 40,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_address_2',
                'label' => 'Company street address 2',
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'address_2',
                'validation_rules' => [
                    'maxLength' => 40,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_city',
                'label' => 'Company city or town',
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'city',
                'validation_rules' => [
                    'required' => true,
                    'minLength' => 1,
                    'maxLength' => 40,
                    'noSpecialCharacters' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_state',
                'label' => 'Company state or province',
                'input_type' => 'state',
                'source_type' => 'company',
                'source_key' => 'state',
                'validation_rules' => [
                    'required' => true,
                    'length' => 2,
                    'alpha' => true,
                ],
                'options' => null,
            ],

            /*
             * The source spreadsheets do not contain a separate company
             * country column, but the application Company Details UI does.
             * This field is therefore available for the dynamic form UI.
             */
            [
                'field_key' => 'company_country',
                'label' => 'Company country',
                'input_type' => 'country',
                'source_type' => 'company',
                'source_key' => 'country',
                'validation_rules' => [
                    'required' => true,
                    'length' => 2,
                    'alpha' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_postal_code',
                'label' => 'Company ZIP or foreign postal code',
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'zip_code',
                'validation_rules' => [
                    'required' => true,
                    'postalCode' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_phone',
                'label' => 'Company telephone no.',
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'phone',
                'validation_rules' => [
                    'required' => true,
                    'maxLength' => 15,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_email',
                'label' => 'Company email',
                'input_type' => 'email',
                'source_type' => 'company',
                'source_key' => 'email',
                'validation_rules' => [
                    'required' => true,
                    'maxLength' => 100,
                    'email' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_contact_name',
                'label' => "Company's contact name",
                'input_type' => 'text',
                'source_type' => 'company',
                'source_key' => 'payer_contact_name',
                'validation_rules' => [
                    'maxLength' => 35,
                    'allowedCharacters' => 'letters, numbers, spaces, hyphens, periods, apostrophes',
                ],
                'options' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | CONTRACTOR
            |--------------------------------------------------------------------------
            */

            [
                'field_key' => 'contractor_tax_id',
                'label' => 'Contractor Tax ID',
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'tax_id',
                'validation_rules' => [
                    'required' => true,
                    'maxLength' => 9,
                    'description' => 'Tax ID must be 9 numeric digits.',
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_first_name',
                'label' => "Contractor's first name",
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'first_name',
                'validation_rules' => [
                    'maxLength' => 40,
                    'required_if' => [
                        'source_type' => 'contractor',
                        'source_key' => 'tax_id_type',
                        'value' => 'SSN',
                    ],
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_middle_initial',
                'label' => "Contractor's middle initial",
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'middle_initial',
                'validation_rules' => [
                    'maxLength' => 1,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_last_name',
                'label' => "Contractor's last name",
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'last_name',
                'validation_rules' => [
                    'maxLength' => 40,
                    'required_if' => [
                        'source_type' => 'contractor',
                        'source_key' => 'tax_id_type',
                        'value' => 'SSN',
                    ],
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_suffix',
                'label' => "Contractor's suffix",
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'suffix',
                'validation_rules' => [
                    'maxLength' => 20,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_business_name',
                'label' => "Contractor's business or entity name",
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'business_name',
                'validation_rules' => [
                    'maxLength' => 40,
                    'required_if' => [
                        'source_type' => 'contractor',
                        'source_key' => 'tax_id_type',
                        'value' => 'EIN',
                    ],
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_address_1',
                'label' => 'Contractor street address 1',
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'address_1',
                'validation_rules' => [
                    'required' => true,
                    'minLength' => 1,
                    'maxLength' => 40,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_address_2',
                'label' => 'Contractor street address 2',
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'address_2',
                'validation_rules' => [
                    'maxLength' => 40,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_city',
                'label' => 'Contractor city or town',
                'input_type' => 'city',
                'source_type' => 'contractor',
                'source_key' => 'city_id',
                'validation_rules' => [
                    'required' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_state',
                'label' => 'Contractor state or province',
                'input_type' => 'region',
                'source_type' => 'contractor',
                'source_key' => 'region_id',
                'validation_rules' => [
                    'required' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_country',
                'label' => 'Contractor country',
                'input_type' => 'country',
                'source_type' => 'contractor',
                'source_key' => 'country_id',
                'validation_rules' => [
                    'required' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_postal_code',
                'label' => 'Contractor ZIP or foreign postal code',
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'postal_code',
                'validation_rules' => [
                    'required' => true,
                    'postalCode' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_phone',
                'label' => 'Contractor telephone no.',
                'input_type' => 'text',
                'source_type' => 'contractor',
                'source_key' => 'phone',
                'validation_rules' => [
                    'maxLength' => 15,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'contractor_email',
                'label' => 'Contractor email',
                'input_type' => 'email',
                'source_type' => 'contractor',
                'source_key' => 'email',
                'validation_rules' => [
                    'maxLength' => 100,
                    'email' => true,
                ],
                'options' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | 1099-NEC SPECIFIC
            |--------------------------------------------------------------------------
            */

            [
                'field_key' => 'nonemployee_compensation',
                'label' => '1 Nonemployee compensation',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'tip_amount',
                'label' => 'Tip amount',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'overtime_amount',
                'label' => 'Overtime amount',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'direct_sales_5000_more',
                'label' => '2 Company made direct sales totaling $5,000 or more of consumer products to contractor for resale',
                'input_type' => 'checkbox',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'boolean' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'excess_golden_parachute_payments',
                'label' => '3 Excess golden parachute payments',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | 1099-MISC SPECIFIC
            |--------------------------------------------------------------------------
            */

            [
                'field_key' => 'rents',
                'label' => '1 Rents',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'royalties',
                'label' => '2 Royalties',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'other_income',
                'label' => '3 Other income',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'fishing_boat_proceeds',
                'label' => '5 Fishing boat proceeds',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'medical_and_health_care_payments',
                'label' => '6 Medical and health care payments',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'substitute_payments',
                'label' => '8 Substitute payments in lieu of dividends or interest',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'crop_insurance_proceeds',
                'label' => '9 Crop insurance proceeds',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'gross_proceeds_paid_to_attorney',
                'label' => '10 Gross proceeds paid to an attorney',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'fish_purchased_for_resale',
                'label' => '11 Fish purchased for resale',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'section_409a_deferrals',
                'label' => '12 Section 409A deferrals',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'fatca_filing_requirement',
                'label' => '13 FATCA filing requirement',
                'input_type' => 'checkbox',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'boolean' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'nonqualified_deferred_compensation',
                'label' => '15 Nonqualified deferred compensation',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | COMMON STATE FIELDS
            |--------------------------------------------------------------------------
            */

            [
                'field_key' => 'state_filing_a',
                'label' => 'File directly with state',
                'input_type' => 'checkbox',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'boolean' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_tax_withheld_a',
                'label' => 'State tax withheld',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_a',
                'label' => 'State',
                'input_type' => 'region',
                'source_type' => 'region',
                'source_key' => 'code',
                'validation_rules' => [
                    'length' => 2,
                    'alpha' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_state_number_a',
                'label' => "Company's state no.",
                'input_type' => 'region',
                'source_type' => 'region',
                'source_key' => 'code',
                'validation_rules' => [
                    'length' => 2,
                    'alpha' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_income_a',
                'label' => 'State income',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_filing_b',
                'label' => 'File directly with state',
                'input_type' => 'checkbox',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'boolean' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_tax_withheld_b',
                'label' => 'State tax withheld',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_b',
                'label' => 'State',
                'input_type' => 'region',
                'source_type' => 'region',
                'source_key' => 'code',
                'validation_rules' => [
                    'length' => 2,
                    'alpha' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'company_state_number_b',
                'label' => "Company's state no.",
                'input_type' => 'region',
                'source_type' => 'region',
                'source_key' => 'code',
                'validation_rules' => [
                    'length' => 2,
                    'alpha' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'state_income_b',
                'label' => 'State income',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            /*
            |--------------------------------------------------------------------------
            | COMMON FINAL FIELDS
            |--------------------------------------------------------------------------
            */

            [
                'field_key' => 'federal_tax_withheld',
                'label' => 'Federal income tax withheld',
                'input_type' => 'number',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxDigits' => 12,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'account_number',
                'label' => 'Account number',
                'input_type' => 'text',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'maxLength' => 20,
                    'alphaNumeric' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'second_tax_id_notice',
                'label' => '2nd Tax ID notice',
                'input_type' => 'checkbox',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'boolean' => true,
                ],
                'options' => null,
            ],

            [
                'field_key' => 'corrected',
                'label' => 'Corrected',
                'input_type' => 'checkbox',
                'source_type' => 'manual',
                'source_key' => null,
                'validation_rules' => [
                    'boolean' => true,
                ],
                'options' => null,
            ],
        ];
        /*
        |--------------------------------------------------------------------------
        | 4. INSERT MASTER FIELDS
        |--------------------------------------------------------------------------
        */

        $fieldIds = [];

        foreach ($fields as $field) {
            $fieldData = [
                'label' => $field['label'],
                'input_type' => $field['input_type'],
                'source_type' => $field['source_type'],
                'source_key' => $field['source_key'] ?? null,

                // IMPORTANT:
                // Query Builder does not automatically cast PHP arrays
                // to JSON. PostgreSQL JSON columns need JSON strings here.
                'validation_rules' => isset($field['validation_rules'])
                    ? json_encode(
                        $field['validation_rules'],
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                    )
                    : null,

                'options' => isset($field['options'])
                    ? json_encode(
                        $field['options'],
                        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
                    )
                    : null,

                'is_active' => true,
                'updated_at' => now(),
            ];

            /*
             * updateOrInsert makes the seeder safe to run again.
             *
             * If the field already exists:
             *      update it
             *
             * If it does not exist:
             *      create it
             */
            DB::table('fields')->updateOrInsert(
                [
                    'field_key' => $field['field_key'],
                ],
                array_merge(
                    $fieldData,
                    [
                        'created_at' => now(),
                    ]
                )
            );

            $fieldIds[$field['field_key']] = (int) DB::table('fields')
                ->where('field_key', $field['field_key'])
                ->value('id');
        }

        /*
        |--------------------------------------------------------------------------
        | 5. 2025 NEC MAPPING
        |--------------------------------------------------------------------------
        */

        $necFields = [
            // Company
            'company_tax_id',
            'company_first_name',
            'company_last_name',
            'company_business_name',
            'company_address_1',
            'company_address_2',
            'company_city',
            'company_state',
            'company_postal_code',
            'company_phone',
            'company_email',
            'company_contact_name',

            // Application Company Details
            'company_country',

            // Contractor
            'contractor_tax_id',
            'contractor_first_name',
            'contractor_middle_initial',
            'contractor_last_name',
            'contractor_suffix',
            'contractor_business_name',
            'contractor_address_1',
            'contractor_address_2',
            'contractor_city',
            'contractor_state',
            'contractor_country',
            'contractor_postal_code',
            'contractor_phone',
            'contractor_email',

            // NEC
            'nonemployee_compensation',
            'tip_amount',
            'overtime_amount',
            'direct_sales_5000_more',
            'excess_golden_parachute_payments',
            'federal_tax_withheld',

            // State A
            'state_filing_a',
            'state_tax_withheld_a',
            'state_a',
            'company_state_number_a',
            'state_income_a',

            // State B
            'state_filing_b',
            'state_tax_withheld_b',
            'state_b',
            'company_state_number_b',
            'state_income_b',

            // Other
            'account_number',
            'second_tax_id_notice',
            'corrected',
        ];

        /*
        |--------------------------------------------------------------------------
        | 6. 2025 MISC MAPPING
        |--------------------------------------------------------------------------
        */

        $miscFields = [
            // Company
            'company_tax_id',
            'company_first_name',
            'company_last_name',
            'company_business_name',
            'company_address_1',
            'company_address_2',
            'company_city',
            'company_state',
            'company_postal_code',
            'company_phone',
            'company_email',
            'company_contact_name',

            // Application Company Details
            'company_country',

            // Contractor
            'contractor_tax_id',
            'contractor_first_name',
            'contractor_middle_initial',
            'contractor_last_name',
            'contractor_suffix',
            'contractor_business_name',
            'contractor_address_1',
            'contractor_address_2',
            'contractor_city',
            'contractor_state',
            'contractor_country',
            'contractor_postal_code',
            'contractor_phone',
            'contractor_email',

            // MISC
            'rents',
            'royalties',
            'other_income',
            'federal_tax_withheld',
            'tip_amount',
            'overtime_amount',
            'fishing_boat_proceeds',
            'medical_and_health_care_payments',
            'direct_sales_5000_more',
            'substitute_payments',
            'crop_insurance_proceeds',
            'gross_proceeds_paid_to_attorney',
            'fish_purchased_for_resale',
            'section_409a_deferrals',
            'fatca_filing_requirement',
            'nonqualified_deferred_compensation',

            // State A
            'state_filing_a',
            'state_tax_withheld_a',
            'state_a',
            'company_state_number_a',
            'state_income_a',

            // State B
            'state_filing_b',
            'state_tax_withheld_b',
            'state_b',
            'company_state_number_b',
            'state_income_b',

            // Other
            'account_number',
            'second_tax_id_notice',
            'corrected',
        ];

        /*
        |--------------------------------------------------------------------------
        | 7. CREATE FIELD MAPPINGS
        |--------------------------------------------------------------------------
        */

        $this->mapFields(
            $necDefinitionId,
            $necFields,
            $fieldIds
        );

        $this->mapFields(
            $miscDefinitionId,
            $miscFields,
            $fieldIds
        );
    }

    /**
     * Map reusable fields to a form definition.
     */
    private function mapFields(
        int $formDefinitionId,
        array $fieldKeys,
        array $fieldIds
    ): void {
        foreach ($fieldKeys as $index => $fieldKey) {
            if (!isset($fieldIds[$fieldKey])) {
                throw new \RuntimeException(
                    "Field [{$fieldKey}] was not found while mapping form definition [{$formDefinitionId}]."
                );
            }

            $field = $this->getFieldById(
                $fieldIds[$fieldKey]
            );

            $section = match ($field['source_type']) {
                'company' => 'company',
                'contractor' => 'contractor',
                'region' => 'state',
                default => 'form',
            };

            $rules = $field['validation_rules'] ?? [];

            DB::table('form_definition_fields')->updateOrInsert(
                [
                    'form_definition_id' => $formDefinitionId,
                    'field_id' => $fieldIds[$fieldKey],
                ],
                [
                    'is_required' => (bool) ($rules['required'] ?? false),
                    'sort_order' => ($index + 1) * 10,
                    'section' => $section,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }
    }

    /**
     * Get field data from the database.
     */
    private function getFieldById(int $fieldId): array
    {
        $field = DB::table('fields')
            ->where('id', $fieldId)
            ->first();

        if (!$field) {
            throw new \RuntimeException(
                "Field with ID [{$fieldId}] was not found."
            );
        }

        $validationRules = $field->validation_rules;

        if (is_string($validationRules)) {
            $validationRules = json_decode(
                $validationRules,
                true
            ) ?? [];
        }

        return [
            'source_type' => $field->source_type,
            'validation_rules' => is_array($validationRules)
                ? $validationRules
                : [],
        ];
    }
}