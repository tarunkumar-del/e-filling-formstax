<?php

namespace App\Domain\Identity\Exceptions;

use RuntimeException;

final class InvalidCredentialsException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('The email or password is incorrect.');
    }
}