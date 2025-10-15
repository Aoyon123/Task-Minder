import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";

function Dashboard({ user, onLogout }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [activeMenu, setActiveMenu] = useState("Tasks");
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);

    const fetchTasks = async () => {
        try {
            const url = filterStatus
                ? `/tasks?status=${filterStatus}`
                : "/tasks";
            const response = await axios.get(url);
            setTasks(response.data.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowModal(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };
    const handleDeleteTask = async (taskId) => {
        // if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            const response = await axios.delete(`/tasks/${taskId}`);
            toast.warn("Task deleted successfully!");
            await fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const handleTaskSaved = async () => {
        setShowModal(false);
        await fetchTasks(); // ✅ re-fetch tasks to ensure data matches backend
    };

    const getTasksByStatus = (status) => {
        if (filterStatus && filterStatus !== status) return [];
        return tasks.filter((task) => task.status === status);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
                <div className="text-xl text-white">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
            <div className="flex h-[calc(100vh-2rem)] max-w-[1600px] mx-auto">
                <Sidebar
                    user={user}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                    onLogout={onLogout}
                />

                <div className="flex-1 flex flex-col bg-gray-50 rounded-2xl ml-4 overflow-hidden shadow-xl">
                    <header className="bg-white px-8 py-5 border-b border-gray-100 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <svg
                                        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">All</option>
                                    <option value="to-do">To Do</option>
                                    <option value="in-progress">
                                        In Progress
                                    </option>
                                    <option value="done">Done</option>
                                </select>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                    <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleCreateTask}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center text-sm font-medium"
                                >
                                    New task
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-8 overflow-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                            Tasks
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <TaskColumn
                                title="To do"
                                status="to-do"
                                tasks={getTasksByStatus("to-do")}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                user={user}
                            />
                            <TaskColumn
                                title="In progress"
                                status="in-progress"
                                tasks={getTasksByStatus("in-progress")}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                user={user}
                            />
                            <TaskColumn
                                title="Done"
                                status="done"
                                tasks={getTasksByStatus("done")}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                user={user}
                            />
                        </div>
                    </main>
                </div>
            </div>

            {showModal && (
                <TaskModal
                    task={editingTask}
                    onClose={() => setShowModal(false)}
                    onSave={handleTaskSaved}
                />
            )}
        </div>
    );
}

export default Dashboard;
