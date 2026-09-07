<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\CountryCity;
use App\Models\CountryRegion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Get all countries.
     */
    public function countries(): JsonResponse
    {
        $countries = Country::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'code',
                'region_label',
                'postal_label',
            ]);

        return response()->json($countries);
    }

    /**
     * Get regions for a country.
     */
    public function regions(
        Request $request,
        Country $country
    ): JsonResponse {
        $regions = CountryRegion::query()
            ->where('country_id', $country->id)
            ->orderBy('name')
            ->get([
                'id',
                'country_id',
                'name',
                'code',
                'type',
            ]);

        return response()->json([
            'country' => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'region_label' => $country->region_label,
                'postal_label' => $country->postal_label,
            ],
            'regions' => $regions,
        ]);
    }

    /**
     * Get cities for a region.
     */
    public function cities(
        Request $request,
        CountryRegion $region
    ): JsonResponse {
        $cities = CountryCity::query()
            ->where('country_id', $region->country_id)
            ->where('region_id', $region->id)
            ->orderBy('name')
            ->get([
                'id',
                'country_id',
                'region_id',
                'name',
                'code',
            ]);

        return response()->json($cities);
    }
}