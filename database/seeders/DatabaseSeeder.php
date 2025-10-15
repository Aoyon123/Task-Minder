<?php
namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {

        $adminRole = Role::create(['name' => 'admin']);
        $userRole  = Role::create(['name' => 'user']);

        // Create admin user
        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id'  => $adminRole->id,
        ]);

        User::create([
            'name'     => 'Regular User',
            'email'    => 'user@example.com',
            'password' => Hash::make('password'),
            'role_id'  => $userRole->id,
        ]);

        // Create some tasks
        \App\Models\Task::factory(10)->create();
    }
}
