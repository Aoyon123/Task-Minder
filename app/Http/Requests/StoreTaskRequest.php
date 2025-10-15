<?php
namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreTaskRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $taskId = $this->route('task') ? $this->route('task')->id : null;

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
            'title.unique'    => 'Title already exists.',
            'title.max'       => 'Task title may not be greater than 255 characters.',
            'status.required' => 'Task status is required.',
            'status.in'       => 'Task status must be one of: To do, In progress, or Done.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
