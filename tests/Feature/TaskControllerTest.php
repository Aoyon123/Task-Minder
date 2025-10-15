<?php
namespace Tests\Feature;

use App\Jobs\TaskNotificationJob;
use App\Models\Role;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'admin']);
        Role::create(['name' => 'user']);

        Queue::fake();
    }

    #[Test]
    public function it_can_get_all_tasks_for_authenticated_user()
    {
        $user  = $this->actingAsUser();
        $tasks = Task::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'title', 'description', 'status', 'user_id', 'created_at', 'updated_at'],
                ],
            ])
            ->assertJsonCount(3, 'data')
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function it_can_filter_tasks_by_status()
    {
        $user = $this->actingAsUser();
        Task::factory()->create(['user_id' => $user->id, 'status' => 'to-do']);
        Task::factory()->create(['user_id' => $user->id, 'status' => 'done']);

        $response = $this->getJson('/api/tasks?status=done');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.status', 'done');
    }

    #[Test]
    public function it_uses_cache_for_task_retrieval()
    {
        $user = $this->actingAsUser();
        Task::factory()->count(2)->create(['user_id' => $user->id]);

        $this->getJson('/api/tasks');

        $cacheKey = "tasks_user_{$user->id}_status_all";
        $this->assertTrue(Cache::has($cacheKey));

        Task::query()->delete();
        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }
    #[Test]
    public function it_can_create_a_task()
    {
        $user     = $this->actingAsUser();
        $taskData = [
            'title'       => 'Test Task',
            'description' => 'Test Description',
            'status'      => 'to-do',
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Task created successfully.',
                'data'    => [
                    'title'       => 'Test Task',
                    'description' => 'Test Description',
                    'status'      => 'to-do',
                    'user_id'     => $user->id,
                ],
            ]);

        $this->assertDatabaseHas('tasks', [
            'title'   => 'Test Task',
            'user_id' => $user->id,
        ]);

        // Verify job was dispatched
        Queue::assertPushed(TaskNotificationJob::class, function ($job) {
            return $job->getTask()->title === 'Test Task' && $job->getAction() === 'created';
        });
    }
    #[Test]
    public function it_validates_task_creation_with_unique_title()
    {
        $user         = $this->actingAsUser();
        $existingTask = Task::factory()->create(['user_id' => $user->id]);

        $taskData = [
            'title'       => $existingTask->title,
            'description' => 'Test Description',
            'status'      => 'to-do',
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }
    #[Test]
    public function it_can_show_a_task()
    {
        $user = $this->actingAsUser();
        $task = $this->createTask($user);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data'    => [
                    'id'          => $task->id,
                    'title'       => $task->title,
                    'description' => $task->description,
                    'status'      => $task->status,
                ],
            ]);
    }
    #[Test]
    public function it_prevents_users_from_viewing_other_users_tasks()
    {
        $user1 = $this->actingAsUser();
        $user2 = $this->createUser();

        $task = $this->createTask($user2);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);
    }
    #[Test]
    public function admin_can_view_any_task()
    {
        $admin       = $this->actingAsAdmin();
        $regularUser = $this->createUser();

        $task = $this->createTask($regularUser);

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    #[Test]
    public function it_can_update_a_task()
    {
        $user = $this->actingAsUser();
        $task = $this->createTask($user, ['status' => 'to-do']);

        $updateData = [
            'title'       => 'Updated Task Title',
            'description' => 'Updated Description',
            'status'      => 'in-progress',
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Task updated successfully.',
                'data'    => [
                    'title'       => 'Updated Task Title',
                    'description' => 'Updated Description',
                    'status'      => 'in-progress',
                ],
            ]);

        $this->assertDatabaseHas('tasks', [
            'id'     => $task->id,
            'title'  => 'Updated Task Title',
            'status' => 'in-progress',
        ]);

        Queue::assertPushed(TaskNotificationJob::class, function ($job) {
            return $job->getAction() === 'updated';
        });
    }

    #[Test]
    public function it_dispatches_completed_notification_when_task_marked_done()
    {
        $user = $this->actingAsUser();
        $task = $this->createTask($user, ['status' => 'in-progress']);

        $updateData = [
            'title'       => $task->title,
            'description' => $task->description,
            'status'      => 'done',
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200);

        Queue::assertPushed(TaskNotificationJob::class, 2);
        Queue::assertPushed(TaskNotificationJob::class, function ($job) {
            return $job->getAction() === 'completed';
        });
    }
    #[Test]
    public function it_prevents_users_from_updating_other_users_tasks()
    {
        $user1 = $this->actingAsUser();
        $user2 = $this->createUser();

        $task = $this->createTask($user2);

        $updateData = [
            'title'       => 'Unauthorized Update',
            'description' => 'Should not work',
            'status'      => 'done',
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('tasks', [
            'id'    => $task->id,
            'title' => 'Unauthorized Update',
        ]);
    }
    #[Test]
    public function admin_can_update_any_task()
    {
        $admin       = $this->actingAsAdmin();
        $regularUser = $this->createUser();

        $task = $this->createTask($regularUser);

        $updateData = [
            'title'       => 'Admin Updated Title',
            'description' => 'Admin can update this',
            'status'      => 'done',
        ];

        $response = $this->putJson("/api/tasks/{$task->id}", $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('tasks', [
            'id'     => $task->id,
            'title'  => 'Admin Updated Title',
            'status' => 'done',
        ]);
    }
    #[Test]
    public function it_can_delete_a_task()
    {
        $user = $this->actingAsUser();
        $task = $this->createTask($user);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Task deleted successfully.',
            ]);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
    #[Test]
    public function it_prevents_users_from_deleting_other_users_tasks()
    {
        $user1 = $this->actingAsUser();
        $user2 = $this->createUser();

        $task = $this->createTask($user2);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('tasks', ['id' => $task->id]);
    }

    #[Test]
    public function admin_can_delete_any_task()
    {
        $admin       = $this->actingAsAdmin();
        $regularUser = $this->createUser();

        $task = $this->createTask($regularUser);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
    #[Test]
    public function it_clears_cache_on_task_operations()
    {
        $user = $this->actingAsUser();

        $this->getJson('/api/tasks');
        $cacheKey = "tasks_user_{$user->id}_status_all";
        $this->assertTrue(Cache::has($cacheKey));

        $taskData = [
            'title'       => 'New Task',
            'description' => 'Test Description',
            'status'      => 'to-do',
        ];

        $this->postJson('/api/tasks', $taskData);
        $this->assertFalse(Cache::has($cacheKey));

        $this->getJson('/api/tasks');
        $this->assertTrue(Cache::has($cacheKey));

        $task = Task::where('title', 'New Task')->first();
        $this->putJson("/api/tasks/{$task->id}", array_merge($taskData, ['status' => 'done']));
        $this->assertFalse(Cache::has($cacheKey));

        $this->getJson('/api/tasks');
        $this->assertTrue(Cache::has($cacheKey));

        $this->deleteJson("/api/tasks/{$task->id}");
        $this->assertFalse(Cache::has($cacheKey));
    }
    #[Test]
    public function it_validates_required_fields_for_task_creation()
    {
        $this->actingAsUser();

        $response = $this->postJson('/api/tasks', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'status']);
    }
    #[Test]
    public function it_validates_status_enum_values()
    {
        $this->actingAsUser();

        $taskData = [
            'title'       => 'Test Task',
            'description' => 'Test Description',
            'status'      => 'invalid-status',
        ];

        $response = $this->postJson('/api/tasks', $taskData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

}
