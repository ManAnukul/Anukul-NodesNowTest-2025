import TaskType from "./TaskType"
export default interface TaskCardProps {
  task: TaskType[];
  onAdd: () => void;
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
  onView: (task: TaskType) => void;
  onStatusChange: (task: TaskType) => void;
}
