<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Auth path defined
use App\Http\Controllers\Auth\{AccountSetupController, SetPasswordController, ForgotPasswordController, ResetPasswordController, SignInController};

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContractorController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Admin\TaxForm\FormConfigurationController;
use App\Http\Controllers\Admin\TaxForm\FormDefinitionController;
/*
|--------------------------------------------------------------------------
| Location Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])
    ->prefix('locations')
    ->name('locations.')
    ->group(function () {
        Route::get('/countries', [
            LocationController::class,
            'countries',
        ])->name('countries');

        Route::get('/countries/{country}/regions', [
            LocationController::class,
            'regions',
        ])->name('regions');

        Route::get('/regions/{region}/cities', [
            LocationController::class,
            'cities',
        ])->name('cities');
    });


// Auth routes
Route::middleware('guest')->group(function () {

    //sign-in module
    Route::get('/sign-in', function () {
        return Inertia::render('auth/sign-in');
    })->name('login');//sign-in route to render the sign-in page

    Route::post('/sign-in', [
        SignInController::class,
        'store',
    ])->name('auth.sign-in.submit');//login route to handle the form submission


    //sign-up module
    Route::get('/sign-up', function () {
        return Inertia::render('auth/sign-up');
    })->name('auth.sign-up'); //sign-up route to render the sign-up page

    Route::post('/register', [
        AccountSetupController::class,
        'register',
    ])->name('register'); //sign-up route to handle the form submission


    //set-password module 
    Route::get('/set-password/{token}', [
        SetPasswordController::class,
        'create',
    ])->name('auth.set-password'); //set-password route to render the set-password page

    Route::post('/set-password/{token}', [
        SetPasswordController::class,
        'store',
    ])->name('auth.set-password.submit');//set-password route to handle the form submission


    //forgot-password module 
    Route::get('/forgot-password', function () {
        return Inertia::render('auth/forgot-password');
    })->name('auth.forgot-password');//forgot-password route to render the forgot-password page

    Route::post('/forgot-password', [
        ForgotPasswordController::class,
        'store',
    ])->name('auth.forgot-password.submit');//forgot-password route to handle the form submission


    //reset-password module
    Route::get('/reset-password/{token}', [
        ResetPasswordController::class,
        'create',
    ])->name('auth.reset-password');//reset-password route to render the reset-password page

    Route::post('/reset-password/{token}', [
        ResetPasswordController::class,
        'store',
    ])->name('auth.reset-password.submit');//reset-password route to handle the form submission

});

// Authenticated routes
// Dashboard
Route::middleware(['auth', 'role:user'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('auth')
        ->name('dashboard');
    // Normal user
    Route::prefix('companies')
        ->name('companies.')
        ->middleware('permission:manage companies')
        ->group(function () {

            Route::get('/', [
                CompanyController::class,
                'index',
            ])->name('index');

            Route::get('/{company}', [
                CompanyController::class,
                'show',
            ])->name('show');

            Route::post('/', [
                CompanyController::class,
                'store',
            ])->name('store');

            Route::put('/{company}', [
                CompanyController::class,
                'update',
            ])->name('update');
        });


    // Users
    Route::get('/users', function () {
        return Inertia::render('authenticated/users');
    })->name('users.index');

    // Tasks
    Route::get('/tasks', function () {
        return Inertia::render('authenticated/tasks');
    })->name('tasks.index');

    // Apps
    Route::get('/apps', function () {
        return Inertia::render('authenticated/apps');
    })->name('apps.index');

    // Chats
    Route::get('/chats', function () {
        return Inertia::render('authenticated/chats');
    })->name('chats.index');

    Route::get('/help-center', function () {
        return Inertia::render('authenticated/help-center');
    })->name('help-center');

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('authenticated/settings');
        })->name('index');

        Route::get('/profile', function () {
            return Inertia::render('authenticated/settings/profile');
        })->name('profile');

        Route::get('/account', function () {
            return Inertia::render('authenticated/settings/account');
        })->name('account');

        Route::get('/appearance', function () {
            return Inertia::render('authenticated/settings/appearance');
        })->name('appearance');

        Route::get('/notifications', function () {
            return Inertia::render('authenticated/settings/notifications');
        })->name('notifications');

        Route::get('/display', function () {
            return Inertia::render('authenticated/settings/display');
        })->name('display');
        Route::get('/help-center', function () {
            return Inertia::render('authenticated/settings/display');
        })->name('display');
    });

    // Error pages
    Route::prefix('errors')->name('error.')->group(function () {
        Route::get('forbidden', function () {
            return Inertia::render('errors/forbidden');
        })->name('forbidden');

        Route::get('unauthorized', function () {
            return Inertia::render('errors/unauthorized');
        })->name('unauthorized');

        Route::get('maintenance-error', function () {
            return Inertia::render('errors/maintenance');
        })->name('maintenance');

        Route::get('internal-server-error', function () {
            return Inertia::render('errors/internal-server');
        })->name('maintenance');

        // Fallback for 404
        Route::fallback(function () {
            return Inertia::render('not-found');
        });
    });
});

Route::post('/logout', function (Request $request) {
    Auth::logout();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect()->route('login');
})->middleware('auth')->name('logout');

/*
|--------------------------------------------------------------------------
| User Contractor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:user'])
    ->prefix('companies/{company}/contractors')
    ->name('companies.contractors.')
    ->group(function () {
        Route::get('/', [
            ContractorController::class,
            'index',
        ])->name('index');

        Route::post('/', [
            ContractorController::class,
            'store',
        ])->name('store');

        Route::get('/{contractor}', [
            ContractorController::class,
            'show',
        ])->name('show');

        Route::put('/{contractor}', [
            ContractorController::class,
            'update',
        ])->name('update');

        Route::delete('/{contractor}', [
            ContractorController::class,
            'destroy',
        ])->name('destroy');
    });


/*
|--------------------------------------------------------------------------
| Admin Contractor Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin/companies/{company}/contractors')
    ->name('admin.companies.contractors.')
    ->group(function () {
        Route::get('/', [
            ContractorController::class,
            'index',
        ])->name('index');

        Route::post('/', [
            ContractorController::class,
            'store',
        ])->name('store');

        Route::get('/{contractor}', [
            ContractorController::class,
            'show',
        ])->name('show');

        Route::put('/{contractor}', [
            ContractorController::class,
            'update',
        ])->name('update');

        Route::delete('/{contractor}', [
            ContractorController::class,
            'destroy',
        ])->name('destroy');
    });


// Admin
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get(
            '/dashboard',
            [DashboardController::class, 'admin']
        )->name('dashboard');

        Route::get(
            '/users',
            [UserController::class, 'index']
        )->name('users.index');

        Route::post(
            '/users',
            [UserController::class, 'store']
        )->name('users.store');

        Route::put(
            '/users/{user}',
            [UserController::class, 'update']
        )->name('users.update');

        Route::delete(
            '/users/{user}',
            [UserController::class, 'destroy']
        )->name('users.destroy');

        Route::get(
            '/{formDefinitionId}/configuration',
            [FormConfigurationController::class, 'index']
        )->name('configuration.index');

        Route::put(
            '/{formDefinitionId}/configuration/{formDefinitionFieldId}',
            [FormConfigurationController::class, 'update']
        )->name('configuration.update');

        Route::prefix('tax-forms')
            ->name('tax-forms.')
            ->group(function () {
                Route::get(
                    '/',
                    [FormDefinitionController::class, 'index']
                )->name('index');
                Route::get(
                    '/{formDefinitionId}/configuration',
                    [FormConfigurationController::class, 'index']
                )->name('configuration.index');

                Route::put(
                    '/{formDefinitionId}/configuration/{formDefinitionFieldId}',
                    [FormConfigurationController::class, 'update']
                )->name('configuration.update');
            });

    });


// Admin Companies
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin/companies')
    ->name('admin.companies.')
    ->group(function () {

        Route::get('/', [
            CompanyController::class,
            'index',
        ])->name('index');

        Route::get('/{company}', [
            CompanyController::class,
            'show',
        ])->name('show');

        Route::post('/', [
            CompanyController::class,
            'store',
        ])->name('store');

        Route::put('/{company}', [
            CompanyController::class,
            'update',
        ])->name('update');
    });
