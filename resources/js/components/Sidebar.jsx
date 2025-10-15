import React from "react";

function Sidebar({ user, activeMenu, setActiveMenu, onLogout }) {
    const menus = ["Dashboard", "Projects", "Tasks", "Calendar"];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    TM
                </div>
                <span className="font-semibold text-lg text-gray-900">
                    TaskMinder
                </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menus.map((menu) => (
                    <button
                        key={menu}
                        onClick={() => setActiveMenu(menu)}
                        className={`w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-50 transition duration-200 ${
                            activeMenu === menu
                                ? "bg-indigo-100 font-medium text-indigo-600"
                                : "text-gray-700"
                        }`}
                    >
                        {menu}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
