<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            [
                'email' => 'alex_omoto@efillingformstax.com',
            ],
            [
                'name' => 'alexOmoto',
                'password' => Hash::make('alex_omoto@123'),
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');

        $user = User::firstOrCreate(
            [
                'email' => 'tarunkumar01199711@gmail.com',
            ],
            [
                'name' => 'tarun',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]
        );
        $user->assignRole('user');
    }
}