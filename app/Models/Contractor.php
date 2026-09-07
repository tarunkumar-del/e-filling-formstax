<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contractor extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'company_id',

        'tax_id_type',
        'tax_id',

        'first_name',
        'middle_initial',
        'last_name',
        'suffix',
        'business_entity_name',

        'address_1',
        'address_2',

        'country_id',
        'region_id',
        'city_id',
        'postal',

        'phone',
        'email',
    ];

    protected $casts = [
        'company_id' => 'integer',
        'country_id' => 'integer',
        'region_id' => 'integer',
        'city_id' => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(
            CountryRegion::class,
            'region_id'
        );
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(
            CountryCity::class,
            'city_id'
        );
    }
}