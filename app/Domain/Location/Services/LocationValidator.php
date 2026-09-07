<?php

namespace App\Domain\Location\Services;

use App\Models\Country;
use App\Models\CountryCity;
use App\Models\CountryRegion;
use Illuminate\Validation\ValidationException;

class LocationValidator
{
    /**
     * Validate country, region and city relationship.
     */
    public function validate(
        int $countryId,
        ?int $regionId,
        ?int $cityId
    ): void {
        $countryExists = Country::query()
            ->whereKey($countryId)
            ->exists();

        if (! $countryExists) {
            throw ValidationException::withMessages([
                'country_id' => 'The selected country is invalid.',
            ]);
        }

        if ($regionId === null) {
            if ($cityId !== null) {
                throw ValidationException::withMessages([
                    'city_id' => 'A region is required when a city is selected.',
                ]);
            }

            return;
        }

        $region = CountryRegion::query()
            ->whereKey($regionId)
            ->first();

        if (! $region) {
            throw ValidationException::withMessages([
                'region_id' => 'The selected region is invalid.',
            ]);
        }

        if ($region->country_id !== $countryId) {
            throw ValidationException::withMessages([
                'region_id' => 'The selected region does not belong to the selected country.',
            ]);
        }

        if ($cityId === null) {
            return;
        }

        $city = CountryCity::query()
            ->whereKey($cityId)
            ->first();

        if (! $city) {
            throw ValidationException::withMessages([
                'city_id' => 'The selected city is invalid.',
            ]);
        }

        if (
            $city->country_id !== $countryId ||
            $city->region_id !== $regionId
        ) {
            throw ValidationException::withMessages([
                'city_id' => 'The selected city does not belong to the selected region.',
            ]);
        }
    }
}