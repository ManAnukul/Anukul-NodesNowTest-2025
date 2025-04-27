import TaskType from "../../Types/TaskType";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskType | null;
}

function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-sm" data-cy="task-detail-modal" data-testid="task-detail-modal">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[500px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            data-cy="close-detail-modal"
            data-testid="close-detail-modal"
          >
            X
          </button>
        </div>
        {task ? (
          <div>
            <p data-cy="task-detail-title" data-testid="task-detail-title">
              <strong>Title:</strong> {task.title}
            </p>
            <p data-cy="task-detail-description" data-testid="task-detail-description">
              <strong>Description:</strong> {task.description}
            </p>
            <p data-cy="task-detail-status" data-testid="task-detail-status">
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
