import TaskType from "./TaskType";

export default interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: TaskType;
    onEdit: (id: string, updatedTask: TaskType) => void;
  }
  
  