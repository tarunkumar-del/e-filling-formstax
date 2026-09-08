<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormFieldValue extends Model
{
    protected $table = 'form_field_values';

    protected $fillable = [
        'form_id',
        'field_id',
        'value',
    ];

    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }
}