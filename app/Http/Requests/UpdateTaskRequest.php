<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $taskParam = $this->route('task');
        $taskId = $taskParam instanceof \App\Models\Task ? $taskParam->id : $taskParam;

        return [
            'title'       => 'required|string|max:255|unique:tasks,title,' . $taskId,
            'description' => 'nullable|string',
            'status'      => 'required|in:to-do,in-progress,done',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'  => 'Task title is required.',
            'title.unique'    => 'A task with this title already exists.',
            'title.max'       => 'Task title may not be greater than 255 characters.',
            'status.required' => 'Task status is required.',
            'status.in'       => 'Task status must be one of: To Do, In Progress, or Done.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
