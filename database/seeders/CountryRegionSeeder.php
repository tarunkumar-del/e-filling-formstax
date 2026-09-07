<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\CountryRegion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CountryRegionSeeder extends Seeder
{
    private const COUNTRIES_SOURCE_URL =
        'https://github.com/dr5hn/countries-states-cities-database/raw/master/json/countries.json';

    private const STATES_SOURCE_URL =
        'https://github.com/dr5hn/countries-states-cities-database/raw/master/json/states.json';

    public function run(): void
    {
        $this->command->info('Downloading country/state dataset...');

        /*
        |--------------------------------------------------------------------------
        | Download source countries
        |--------------------------------------------------------------------------
        */

        $countriesResponse = Http::timeout(120)
            ->retry(3, 1000)
            ->get(self::COUNTRIES_SOURCE_URL);

        if ($countriesResponse->failed()) {
            throw new RuntimeException(
                'Unable to download countries dataset.'
            );
        }

        $sourceCountries = $countriesResponse->json();

        if (! is_array($sourceCountries)) {
            throw new RuntimeException(
                'Invalid countries dataset received.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Download source states
        |--------------------------------------------------------------------------
        */

        $statesResponse = Http::timeout(120)
            ->retry(3, 1000)
            ->get(self::STATES_SOURCE_URL);

        if ($statesResponse->failed()) {
            throw new RuntimeException(
                'Unable to download states dataset.'
            );
        }

        $sourceStates = $statesResponse->json();

        if (! is_array($sourceStates)) {
            throw new RuntimeException(
                'Invalid states dataset received.'
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Build local country map by name
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | We intentionally do NOT use the source ISO/code to update
        | your countries table because your application has custom codes.
        |
        */

        $localCountries = Country::query()
            ->get(['id', 'name']);

        $localCountryByName = [];

        foreach ($localCountries as $country) {
            $localCountryByName[
                $this->normalize($country->name)
            ] = $country;
        }

        /*
        |--------------------------------------------------------------------------
        | Map source country ID -> local country ID
        |--------------------------------------------------------------------------
        */

        $sourceCountryToLocalCountry = [];

        foreach ($sourceCountries as $sourceCountry) {
            $sourceCountryId = $sourceCountry['id'] ?? null;
            $sourceCountryName = $sourceCountry['name'] ?? null;

            if (! $sourceCountryId || ! $sourceCountryName) {
                continue;
            }

            $localCountry = $localCountryByName[
                $this->normalize($sourceCountryName)
            ] ?? null;

            if (! $localCountry) {
                continue;
            }

            $sourceCountryToLocalCountry[$sourceCountryId] =
                $localCountry->id;
        }

        /*
        |--------------------------------------------------------------------------
        | Import regions
        |--------------------------------------------------------------------------
        */

        $inserted = 0;
        $skipped = 0;

        DB::transaction(function () use (
            $sourceStates,
            $sourceCountryToLocalCountry,
            &$inserted,
            &$skipped
        ) {
            foreach ($sourceStates as $state) {
                $sourceCountryId = $state['country_id'] ?? null;
                $stateName = $state['name'] ?? null;

                if (! $sourceCountryId || ! $stateName) {
                    $skipped++;
                    continue;
                }

                $localCountryId =
                    $sourceCountryToLocalCountry[$sourceCountryId] ?? null;

                if (! $localCountryId) {
                    $skipped++;
                    continue;
                }

                CountryRegion::updateOrCreate(
                    [
                        'country_id' => $localCountryId,
                        'name' => $stateName,
                    ],
                    [
                        'code' => $state['state_code']
                            ?? $state['iso2']
                            ?? null,

                        'type' => $state['type'] ?? null,
                    ]
                );

                $inserted++;

                if ($inserted % 500 === 0) {
                    $this->command->info(
                        "Processed {$inserted} regions..."
                    );
                }
            }
        });

        $this->command->newLine();

        $this->command->info(
            "Country regions imported: {$inserted}"
        );

        $this->command->warn(
            "Skipped records: {$skipped}"
        );
    }

    private function normalize(string $value): string
    {
        return mb_strtolower(
            trim(
                preg_replace(
                    '/\s+/',
                    ' ',
                    $value
                )
            )
        );
    }
}