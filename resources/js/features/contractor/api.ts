import type {
    Country,
    CountryCity,
    CountryRegion,
} from './types';

export async function fetchCountries(): Promise<Country[]> {
    const response = await fetch('/locations/countries', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error('Unable to load countries.');
    }

    return response.json();
}

export async function fetchRegions(
    countryId: number
): Promise<CountryRegion[]> {
    const response = await fetch(
        `/locations/countries/${countryId}/regions`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin',
        }
    );

    if (!response.ok) {
        throw new Error('Unable to load regions.');
    }

    const data = await response.json();

    return data.regions;
}

export async function fetchCities(
    regionId: number
): Promise<CountryCity[]> {
    const response = await fetch(
        `/locations/regions/${regionId}/cities`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'same-origin',
        }
    );

    if (!response.ok) {
        throw new Error('Unable to load cities.');
    }

    return response.json();
}