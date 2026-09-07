<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CountryCity extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'region_id',
        'name',
        'code',
    ];

    protected $casts = [
        'country_id' => 'integer',
        'region_id' => 'integer',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function region(): BelongsTo
    {
        return $this->belongsTo(CountryRegion::class, 'region_id');
    }
}