<?php
namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        return [
            'user_id'     => User::factory(),
            'title'       => $this->faker->sentence(4),
            'description' => $this->faker->paragraph,
            'status'      => $this->faker->randomElement(['to-do', 'in-progress', 'done']),
        ];
    }

    public function todo()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'to-do',
            ];
        });
    }

    public function inProgress()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'in-progress',
            ];
        });
    }

    public function done()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'done',
            ];
        });
    }
}
