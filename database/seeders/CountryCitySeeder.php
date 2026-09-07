<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\CountryCity;
use App\Models\CountryRegion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use JsonMachine\Items;
use RuntimeException;

class CountryCitySeeder extends Seeder
{
    private const COUNTRIES_SOURCE_URL =
        'https://github.com/dr5hn/countries-states-cities-database/raw/master/json/countries.json';

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    | cities.json is no longer available directly in the repository.
    | The current dataset is distributed as a GitHub Release asset.
    |
    */

    private const CITIES_SOURCE_URL =
        'https://github.com/dr5hn/countries-states-cities-database/releases/latest/download/json-cities.json.gz';

    private const DOWNLOAD_PATH =
        'app/import/cities.json.gz';

    private const EXTRACTED_PATH =
        'app/import/cities.json';

    public function run(): void
    {
        $this->command->info('Preparing cities dataset...');

        /*
        |--------------------------------------------------------------------------
        | Load source countries
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
        | Build local country map
        |--------------------------------------------------------------------------
        |
        | We match by country NAME.
        |
        | Your custom country codes are NOT changed.
        |
        */

        $localCountries = Country::query()
            ->get([
                'id',
                'name',
            ]);

        $localCountryByName = [];

        foreach ($localCountries as $country) {
            $localCountryByName[
                $this->normalize($country->name)
            ] = $country;
        }

        /*
        |--------------------------------------------------------------------------
        | Source country ID -> Local country ID
        |--------------------------------------------------------------------------
        */

        $sourceCountryToLocalCountry = [];

        foreach ($sourceCountries as $sourceCountry) {
            $sourceCountryId = $sourceCountry['id'] ?? null;
            $sourceCountryName = $sourceCountry['name'] ?? null;

            if (
                ! $sourceCountryId ||
                ! $sourceCountryName
            ) {
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
        | Load existing local regions
        |--------------------------------------------------------------------------
        */

        $regions = CountryRegion::query()
            ->get([
                'id',
                'country_id',
                'name',
                'code',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Region lookup by country + name
        |--------------------------------------------------------------------------
        */

        $regionByCountryAndName = [];

        foreach ($regions as $region) {
            $key = $this->regionKey(
                $region->country_id,
                $region->name
            );

            $regionByCountryAndName[$key] = $region;
        }

        /*
        |--------------------------------------------------------------------------
        | Region lookup by country + code
        |--------------------------------------------------------------------------
        */

        $regionByCountryAndCode = [];

        foreach ($regions as $region) {
            if (! $region->code) {
                continue;
            }

            $key = $this->regionCodeKey(
                $region->country_id,
                $region->code
            );

            $regionByCountryAndCode[$key] = $region;
        }

        /*
        |--------------------------------------------------------------------------
        | Prepare download directory
        |--------------------------------------------------------------------------
        */

        $directory = storage_path('app/import');

        if (! is_dir($directory)) {
            mkdir(
                $directory,
                0755,
                true
            );
        }

        $compressedPath = storage_path(
            self::DOWNLOAD_PATH
        );

        $citiesPath = storage_path(
            self::EXTRACTED_PATH
        );

        /*
        |--------------------------------------------------------------------------
        | Download compressed cities dataset
        |--------------------------------------------------------------------------
        */

        $this->command->info(
            'Downloading cities dataset...'
        );

        $response = Http::timeout(900)
            ->retry(3, 3000)
            ->sink($compressedPath)
            ->get(self::CITIES_SOURCE_URL);

        if ($response->failed()) {
            throw new RuntimeException(
                'Unable to download cities dataset. HTTP status: '
                . $response->status()
            );
        }

        if (! file_exists($compressedPath)) {
            throw new RuntimeException(
                'Cities dataset download failed.'
            );
        }

        $this->command->info(
            'Cities dataset downloaded.'
        );

        /*
        |--------------------------------------------------------------------------
        | Extract gzip
        |--------------------------------------------------------------------------
        */

        $this->command->info(
            'Extracting cities dataset...'
        );

        $input = gzopen(
            $compressedPath,
            'rb'
        );

        if ($input === false) {
            throw new RuntimeException(
                'Unable to open compressed cities dataset.'
            );
        }

        $output = fopen(
            $citiesPath,
            'wb'
        );

        if ($output === false) {
            gzclose($input);

            throw new RuntimeException(
                'Unable to create extracted cities dataset.'
            );
        }

        while (! gzeof($input)) {
            $chunk = gzread(
                $input,
                1024 * 1024
            );

            if ($chunk === false) {
                fclose($output);
                gzclose($input);

                throw new RuntimeException(
                    'Error while extracting cities dataset.'
                );
            }

            fwrite(
                $output,
                $chunk
            );
        }

        fclose($output);
        gzclose($input);

        /*
        |--------------------------------------------------------------------------
        | Remove compressed file
        |--------------------------------------------------------------------------
        */

        @unlink($compressedPath);

        $this->command->info(
            'Cities dataset extracted.'
        );

        /*
        |--------------------------------------------------------------------------
        | Stream cities JSON
        |--------------------------------------------------------------------------
        */

        $this->command->info(
            'Importing cities into database...'
        );

        $cities = Items::fromFile(
            $citiesPath
        );

        $inserted = 0;
        $skipped = 0;

        $batch = [];

        foreach ($cities as $city) {
            $sourceCountryId =
                $city->country_id ?? null;

            $sourceStateId =
                $city->state_id ?? null;

            $cityName =
                $city->name ?? null;

            $stateName =
                $city->state_name ?? null;

            $stateCode =
                $city->state_code ?? null;

            /*
            |--------------------------------------------------------------------------
            | Validate city record
            |--------------------------------------------------------------------------
            */

            if (
                ! $sourceCountryId ||
                ! $sourceStateId ||
                ! $cityName
            ) {
                $skipped++;

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Resolve local country
            |--------------------------------------------------------------------------
            */

            $localCountryId =
                $sourceCountryToLocalCountry[
                    $sourceCountryId
                ] ?? null;

            if (! $localCountryId) {
                $skipped++;

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Resolve local region
            |--------------------------------------------------------------------------
            */

            $region = null;

            /*
            | First try state/region name.
            */

            if ($stateName) {
                $region =
                    $regionByCountryAndName[
                        $this->regionKey(
                            $localCountryId,
                            $stateName
                        )
                    ] ?? null;
            }

            /*
            | Fallback to state/region code.
            */

            if (! $region && $stateCode) {
                $region =
                    $regionByCountryAndCode[
                        $this->regionCodeKey(
                            $localCountryId,
                            $stateCode
                        )
                    ] ?? null;
            }

            /*
            |--------------------------------------------------------------------------
            | Region not found
            |--------------------------------------------------------------------------
            */

            if (! $region) {
                $skipped++;

                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Prepare city record
            |--------------------------------------------------------------------------
            */

            $batch[] = [
                'country_id' => $localCountryId,
                'region_id' => $region->id,
                'name' => $cityName,
                'code' => null,
            ];

            /*
            |--------------------------------------------------------------------------
            | Insert in batches
            |--------------------------------------------------------------------------
            */

            if (count($batch) >= 1000) {
                $this->insertBatch($batch);

                $inserted += count($batch);

                $batch = [];

                $this->command->info(
                    "Imported {$inserted} cities..."
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Insert remaining records
        |--------------------------------------------------------------------------
        */

        if ($batch !== []) {
            $this->insertBatch($batch);

            $inserted += count($batch);
        }

        /*
        |--------------------------------------------------------------------------
        | Remove extracted dataset
        |--------------------------------------------------------------------------
        */

        @unlink($citiesPath);

        /*
        |--------------------------------------------------------------------------
        | Final output
        |--------------------------------------------------------------------------
        */

        $this->command->newLine();

        $this->command->info(
            "Country cities imported: {$inserted}"
        );

        $this->command->warn(
            "Skipped records: {$skipped}"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Insert city batch
    |--------------------------------------------------------------------------
    */

    private function insertBatch(array $batch): void
    {
        $unique = [];

        foreach ($batch as $row) {
            $key = implode('|', [
                $row['country_id'],
                $row['region_id'],
                $this->normalize($row['name']),
            ]);

            $unique[$key] = $row;
        }

        if ($unique === []) {
            return;
        }

        CountryCity::query()->upsert(
            array_values($unique),
            [
                'country_id',
                'region_id',
                'name',
            ],
            [
                'code',
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Region name key
    |--------------------------------------------------------------------------
    */

    private function regionKey(
        int|string $countryId,
        string $regionName
    ): string {
        return $countryId
            . '|'
            . $this->normalize($regionName);
    }

    /*
    |--------------------------------------------------------------------------
    | Region code key
    |--------------------------------------------------------------------------
    */

    private function regionCodeKey(
        int|string $countryId,
        string $regionCode
    ): string {
        return $countryId
            . '|'
            . mb_strtolower(
                trim($regionCode)
            );
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize text
    |--------------------------------------------------------------------------
    */

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