<?php
namespace App\Jobs;

use App\Mail\TaskNotificationMail;
use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TaskNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $task;
    protected $action;

    public function __construct(Task $task, string $action)
    {
        $this->task   = $task;
        $this->action = $action;
    }
    public function getAction(): string
    {
        return $this->action;
    }

    public function getTask(): Task
    {
        return $this->task;
    }

    public function handle()
    {
        $user = $this->task->user;

        if (! $user) {
            Log::error('NO USER FOUND FOR TASK!');
            return;
        }

        if ($user->email) {
            Log::info('Sending email to: ' . $user->email);

            try {
                Mail::to($user->email)->send(new TaskNotificationMail($this->task, $this->action));
                Log::info('EMAIL SENT SUCCESSFULLY!');
            } catch (\Exception $e) {
                Log::error('EMAIL FAILED: ' . $e->getMessage());
                throw $e;
            }
        } else {
            Log::warning('No email address');
        }
    }
}
