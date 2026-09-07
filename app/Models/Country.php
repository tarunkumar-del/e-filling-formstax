<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Country extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
    ];

    public function contractors(): HasMany
    {
        return $this->hasMany(Contractor::class);
    }

    public function regions(): HasMany
    {
        return $this->hasMany(CountryRegion::class);
    }

    public function cities(): HasMany
    {
        return $this->hasMany(CountryCity::class);
    }
}