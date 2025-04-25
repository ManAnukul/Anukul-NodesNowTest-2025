import TaskType from "./TaskType";

export default interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskType | null;
}