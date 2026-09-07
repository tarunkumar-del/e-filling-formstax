<?php

namespace App\Domain\Identity\Exceptions;

use RuntimeException;

final class InvalidAccountSetupTokenException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct(
            'This password setup link is invalid or has expired.'
        );
    }
}