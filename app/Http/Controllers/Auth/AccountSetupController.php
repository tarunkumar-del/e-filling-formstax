<?php

namespace App\Http\Controllers\Auth;

use App\Application\Identity\Commands\RegisterUser\RegisterUserHandler;
use App\Application\Identity\DTOs\RegisterUserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Support\Facades\Log;
use Throwable;

final class AccountSetupController extends Controller
{
    public function __construct(
        private RegisterUserHandler $handler,
    ) {
    }

    public function register(RegisterRequest $request)
    {
        try {
            $this->handler->handle(
                new RegisterUserData(
                    email: $request->validated('email'),
                )
            );

            return back()->with(
                'success',
                'We have sent a password setup link to your email.'
            );

        } catch (Throwable $exception) {
            Log::error('Account registration failed.', [
                'email' => $request->input('email'),
                'exception' => $exception,
            ]);

            return back()->withErrors([
                'email' => 'Unable to create your account right now.',
            ]);
        }
    }
}