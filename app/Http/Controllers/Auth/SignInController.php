<?php

namespace App\Http\Controllers\Auth;

use App\Application\Identity\Commands\SignIn\SignInHandler;
use App\Application\Identity\DTOs\SignInData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SignInRequest;
use App\Domain\Identity\Exceptions\InvalidCredentialsException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class SignInController extends Controller
{
    public function __construct(
        private SignInHandler $handler,
    ) {}

    /**
     * Show Sign In page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/sign-in');
    }

    /**
     * Authenticate user.
     */
    public function store(
        SignInRequest $request
    ): RedirectResponse {
        try {
            $user = $this->handler->handle(
                new SignInData(
                    email: $request->validated('email'),
                    password: $request->validated('password'),
                    redirect: $request->validated('redirect'),
                )
            );

            // Login user
            Auth::login($user);

            // Prevent session fixation
            $request->session()->regenerate();

            /*
             * Role-based dashboard redirect.
             *
             * Admin  → /admin/dashboard
             * User   → /
             */
            if ($user->hasRole('admin')) {
                return redirect()->route('admin.dashboard');
            }

            return redirect()->route('dashboard');

        } catch (InvalidCredentialsException) {
            return back()->withErrors([
                'email' => 'The email or password is incorrect.',
            ]);
        }
    }
}