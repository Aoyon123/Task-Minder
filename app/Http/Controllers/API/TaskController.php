<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Jobs\TaskNotificationJob;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $status = $request->query('status');
        $cacheKey = "tasks_user_{$user->id}_status_" . ($status ?? 'all');

        $tasks = Cache::remember($cacheKey, 600, function () use ($user, $status) {
            $query = Task::with(['user:id,name,email'])->forUser($user);
            if ($status) {
                $query->status($status);
            }
            return $query->latest()->get();
        });

        return response()->json([
            'success' => true,
            'data'    => $tasks,
        ]);
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = Task::create([
            'user_id'     => $request->user()->id,
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->status ?? 'to-do',
        ]);

        $task->load('user');
        $this->clearTaskCache($request->user()->id);

        TaskNotificationJob::dispatch($task, 'created');

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data'    => $task,
        ], 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        Gate::authorize('view', $task);
        $task->load('user');

        return response()->json([
            'success' => true,
            'data'    => $task,
        ]);
    }

    public function update(UpdateTaskRequest $request, $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);
        Gate::authorize('update', $task);
        $previousStatus = $task->status;

        $task->update($request->validated());
        $this->clearTaskCache($task->user_id);

        if ($request->user()->id !== $task->user_id) {
            $this->clearTaskCache($request->user()->id);
        }

        TaskNotificationJob::dispatch($task, 'updated');

        if ($previousStatus !== 'done' && $task->status === 'done') {
            TaskNotificationJob::dispatch($task, 'completed');
        }

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data'    => $task->load('user'),
        ]);
    }

    public function destroy(Request $request, $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);
        Gate::authorize('delete', $task);

        $userId = $task->user_id;
        $task->delete();

        $this->clearTaskCache($userId);

        if ($request->user()->id !== $userId) {
            $this->clearTaskCache($request->user()->id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
        ]);
    }

    private function clearTaskCache(int $userId): void
    {
        $statuses = ['all', 'to-do', 'in-progress', 'done'];
        foreach ($statuses as $status) {
            Cache::forget("tasks_user_{$userId}_status_{$status}");
        }
    }
}
