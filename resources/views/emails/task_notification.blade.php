@component('mail::message')
    # Task {{ ucfirst($action) }}

    Hello **{{ $task->user->name }}**,

    Your task has been **{{ $action }}**.

    ## Task Details

    **Title:** {{ $task->title }}

    **Description:** {{ $task->description ?? 'No description provided' }}

    **Status:** {{ ucfirst($task->status) }}

    @component('mail::button', ['url' => config('app.url')])
        View Task
    @endcomponent

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
