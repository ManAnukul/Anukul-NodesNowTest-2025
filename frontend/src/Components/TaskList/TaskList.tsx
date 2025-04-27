import { useEffect, useState } from "react";
import TaskCard from "../taskCard/TaskCard";
import AddTaskModal from "../Modals/AddTaskModal/AddTaskModal";
import EditTaskModal from "../Modals/EditTaskModal/EditTaskModal";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal/ConfirmDeleteModal";
import TaskType from "../../Types/TaskType";
import TaskDetailModal from "../taskDetail/TaskDetailModal";
import axiosInstant from "../../lib/axios";

function TaskList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskType | null>(null);
  const [taskToView, setTaskToView] = useState<TaskType | null>(null);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstant.get("/tasks");
        setTasks(response.data.data);
        setFetchError(false);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setFetchError(true);
      }
    };

    fetchTasks();
  }, []);

  const handleAdd = async (newTask: {
    title: string;
    description: string;
    status: string;
  }) => {
    try {
      const res = await axiosInstant.post("/tasks", newTask);
      const createdTask = res.data.data;
      setTasks((prev) => [...prev, createdTask]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = async (id: string, updatedTask: TaskType) => {
    try {
      const res = await axiosInstant.patch(`/tasks/${id}`, updatedTask);
      const updated = res.data.data;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updated } : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstant.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = (task: TaskType) => {
    let newStatus: string | null = null;

    if (task.status === "pending") {
      newStatus = "in_progress";
    } else if (task.status === "in_progress") {
      newStatus = "completed";
    } else {
      console.log("Status change not allowed for completed tasks");
      return;
    }

    if (newStatus) {
      axiosInstant
        .patch(`/tasks/${task.id}`, { status: newStatus })
        .then(() => {
          setTasks(
            tasks.map((t) =>
              t.id === task.id ? { ...t, status: newStatus } : t
            )
          );
        })
        .catch((error) => {
          console.error("Error updating task status:", error);
        });
    }
  };

  const openEditModal = (task: TaskType) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (task: TaskType) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const openDetailModal = (task: TaskType) => {
    setTaskToView(task);
    setIsDetailModalOpen(true);
  };

  return (
    <div>
      <TaskCard
        task={tasks}
        onAdd={() => setIsAddModalOpen(true)}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onView={openDetailModal}
        onStatusChange={handleStatusChange}
        errorMessage={
          fetchError ? "Failed to load tasks. Please try again." : undefined
        }
      />

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={taskToView}
      />

      {taskToEdit && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={taskToEdit}
          onEdit={handleEdit}
        />
      )}

      {taskToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDelete(taskToDelete.id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
