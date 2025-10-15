import React from "react";

function TaskColumn({ title, tasks, onEdit, onDelete, user }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="space-y-4 flex-1 overflow-y-auto">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">
                                {task.title}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onEdit(task)}
                                    className="text-indigo-500 hover:text-indigo-700"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => onDelete(task.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                            {task.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden">
                                <img
                                    src={
                                        task.assignee?.avatar ||
                                        `https://i.pravatar.cc/150?u=${task.assignee?.name}`
                                    }
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-gray-500 text-sm">
                                {task.assignee?.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TaskColumn;
