<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',

        // Tax information
        'tax_id_type',
        'tax_id',

        // Payer information
        'payer_first_name',
        'payer_last_name',
        'business_entity_name',

        // Address
        'address_1',
        'address_2',
        'country',
        'city',
        'state',
        'zip_code',

        // Contact
        'phone',
        'email',
        'payer_contact_name',
    ];

    /**
     * Company owner / creator
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contractors(): HasMany
    {
        return $this->hasMany(Contractor::class, 'company_id');
    }
}