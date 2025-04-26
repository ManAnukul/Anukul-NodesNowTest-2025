import { CheckCircle, Pencil, Plus, Trash2 } from "lucide-react";
import TaskCardProps from "../../Types/TaskCardProps";

function TaskCard({
  task,
  onEdit,
  onDelete,
  onAdd,
  onView,
  onStatusChange,
}: TaskCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-[80%] h-[80vh] border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Task List</h2>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            onClick={onAdd}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
        <table className="min-w-full table-auto text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {task.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  Don't have any Task
                </td>
              </tr>
            ) : (
              task.map((tasks) => (
                <tr key={tasks.id} className="border-b" data-cy="task-item" data-task-id={tasks.id}>
                  <td className="px-4 py-2 font-medium">
                    <button
                      onClick={() => onView(tasks)}
                      className="text-blue-600 hover:text-blue-800 transition max-w-xs truncate"
                    >
                      {tasks.title}
                    </button>
                  </td>
                  <td className="px-4 py-2 max-w-xs truncate">
                    {tasks.description}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        tasks.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : tasks.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tasks.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex justify-start gap-3">
                    <button
                      className="text-green-600 hover:text-green-800 transition"
                      data-cy="status-change-button"
                      onClick={() => onStatusChange(tasks)}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 transition"
                      onClick={() => onEdit(tasks)}
                      aria-label="edit-task-button"
                      data-cy="edit-task-button"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      data-cy="delete-task-button"
                      onClick={() => onDelete(tasks)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskCard;
