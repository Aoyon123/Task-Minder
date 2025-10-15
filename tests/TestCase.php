<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Task;
use Laravel\Sanctum\Sanctum;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function createUser($roleName = 'user')
    {
        $role = Role::firstOrCreate(['name' => $roleName]);

        return User::factory()->create(['role_id' => $role->id]);
    }

    protected function createTask($user, $attributes = [])
    {
        return Task::factory()->create(array_merge([
            'user_id' => $user->id,
        ], $attributes));
    }

    protected function actingAsUser($role = 'user')
    {
        $user = $this->createUser($role);
        Sanctum::actingAs($user, ['*']);
        return $user;
    }

    protected function actingAsAdmin()
    {
        return $this->actingAsUser('admin');
    }
}
