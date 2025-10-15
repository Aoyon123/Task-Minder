<?php

namespace App\Mail;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class TaskNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $task;
    public $action;

    public function __construct(Task $task, string $action) {
        $this->task = $task;
        $this->action = $action;
    }

    public function build() {
        return $this->subject("Task {$this->action}: {$this->task->title}")
                    ->markdown('emails.task_notification');
    }
}
