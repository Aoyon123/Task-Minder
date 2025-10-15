import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function TaskModal({ task, onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("to-do");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
            setStatus(task.status?.toLowerCase().replace(" ", "-") || "to-do");
        } else {
            setTitle("");
            setDescription("");
            setStatus("to-do");
        }
    }, [task]);

    const handleSave = async () => {
        setErrors({});
        if (!title.trim()) {
            setErrors({ title: ["Title is required."] });
            return;
        }

        setLoading(true);
        try {
            let response;
            if (task) {
                response = await axios.put(`/tasks/${task.id}`, {
                    title,
                    description,
                    status,
                });
                toast.info("Task updated successfully!");
            } else {
                response = await axios.post("/tasks", {
                    title,
                    description,
                    status,
                });
                toast.success("Task created successfully!");
            }

            onSave(response.data.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Failed to save task:", error);
                toast.error("Failed to save task");
            }
        } finally {
            setLoading(false);
        }
    };

    const getFirstError = (field) => {
        return errors[field] ? errors[field][0] : null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 p-6 space-y-4 shadow-lg">
                <h2 className="text-xl font-semibold">
                    {task ? "Edit Task" : "New Task"}
                </h2>

                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            getFirstError("title")
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {getFirstError("title") && (
                        <p className="text-red-500 text-sm mt-1">
                            {getFirstError("title")}
                        </p>
                    )}
                </div>

                <div>
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            getFirstError("description")
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    ></textarea>
                    {getFirstError("description") && (
                        <p className="text-red-500 text-sm mt-1">
                            {getFirstError("description")}
                        </p>
                    )}
                </div>

                <div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            getFirstError("status")
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                    >
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    {getFirstError("status") && (
                        <p className="text-red-500 text-sm mt-1">
                            {getFirstError("status")}
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-200"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskModal;
