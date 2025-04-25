import TaskType from "../../Types/TaskType";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskType | null;
}

function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[500px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>
        {task ? (
          <div>
            <p>
              <strong>Title:</strong> {task.title}
            </p>
            <p>
              <strong>Description:</strong> {task.description}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
          </div>
        ) : (
          <div className="text-center text-gray-500">Don't have any Task</div>
        )}
      </div>
    </div>
  );
}

export default TaskDetailModal;
