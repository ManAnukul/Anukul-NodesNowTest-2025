import { useEffect, useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import AddTaskModal from "../Modals/AddTaskModal";
import EditTaskModal from "../Modals/EditTaskModal";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal";
import TaskType from "../../Types/TaskType";
import TaskDetailModal from "../TaskDetail/TaskDetailModal";
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstant.get("/tasks");
        setTasks(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
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

  // Edit Task (PATCH)
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

  // Delete Task (DELETE)
  const handleDelete = async (id: string) => {
    try {
      await axiosInstant.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update Task Status Handler with API call
  const handleStatusChange = (task: TaskType) => {
    let newStatus: string | null = null;

    // กำหนดสถานะใหม่ตามสถานะปัจจุบัน
    if (task.status === "pending") {
      newStatus = "in_progress";
    } else if (task.status === "in_progress") {
      newStatus = "completed";
    } else {
      // หากสถานะเป็น "completed" หรือไม่สามารถเปลี่ยนแปลงสถานะได้
      console.log("Status change not allowed for completed tasks");
      return; // ไม่ทำการเปลี่ยนแปลง
    }

    // ส่งคำขอ API เพื่ออัพเดตสถานะ
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

  // Modal Open Handlers
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
        onStatusChange={handleStatusChange} // ส่งฟังก์ชันการเปลี่ยนสถานะ
      />

      {/* Add Task Modal */}
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

      {/* Edit Task Modal */}
      {taskToEdit && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={taskToEdit}
          onEdit={handleEdit}
        />
      )}

      {/* Confirm Delete Modal */}
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
