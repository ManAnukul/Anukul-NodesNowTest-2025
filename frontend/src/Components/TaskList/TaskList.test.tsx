import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TaskList from "./TaskList";
import axiosInstant from "../../lib/axios";
import TaskType from "../../Types/TaskType";
import { AxiosResponse } from "axios";

interface ApiResponse<T> {
  data: {
    data: T;
  };
}

vi.mock("../../lib/axios", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock("../taskCard/TaskCard", () => ({
  default: ({
    task,
    onAdd,
    onEdit,
    onDelete,
    onView,
    onStatusChange,
    errorMessage,
  }: {
    task: TaskType[];
    onAdd: () => void;
    onEdit: (task: TaskType) => void;
    onDelete: (task: TaskType) => void;
    onView: (task: TaskType) => void;
    onStatusChange: (task: TaskType) => void;
    errorMessage?: string;
  }) => (
    <div data-testid="task-card">
      <button data-testid="add-button" onClick={onAdd}>
        Add Task
      </button>
      {task.length === 0 ? (
        <div data-testid="no-task">Don't have any Task</div>
      ) : (
        task.map((t) => (
          <div key={t.id} data-testid={`${t.id}`}>
            <span>{t.title}</span>
            <button data-testid={`edit-${t.id}`} onClick={() => onEdit(t)}>
              Edit
            </button>
            <button data-testid={`delete-${t.id}`} onClick={() => onDelete(t)}>
              Delete
            </button>
            <button data-testid={`view-${t.id}`} onClick={() => onView(t)}>
              View
            </button>
            <button
              data-testid={`status-${t.id}`}
              onClick={() => onStatusChange(t)}
            >
              Change Status
            </button>
          </div>
        ))
      )}
      {errorMessage && <div data-testid="error-message">{errorMessage}</div>}
    </div>
  ),
}));

vi.mock("../Modals/AddTaskModal/AddTaskModal", () => ({
  default: ({
    isOpen,
    onClose,
    onAdd,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (task: {
      title: string;
      description: string;
      status: string;
    }) => void;
  }) =>
    isOpen && (
      <div data-testid="add-task-modal">
        <button data-testid="close-task-modal" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="submit-add-task"
          onClick={() =>
            onAdd({
              title: "New Task",
              description: "New Description",
              status: "pending",
            })
          }
        >
          Submit
        </button>
      </div>
    ),
}));

vi.mock("../Modals/EditTaskModal/EditTaskModal", () => ({
  default: ({
    isOpen,
    onClose,
    task,
    onEdit,
  }: {
    isOpen: boolean;
    onClose: () => void;
    task: TaskType | null;
    onEdit: (id: string, task: TaskType) => void;
  }) =>
    isOpen &&
    task && (
      <div data-testid="edit-modal">
        <button data-testid="close-edit-modal" onClick={onClose}>
          Close
        </button>
        <button
          data-testid="submit-edit-task"
          onClick={() => onEdit(task.id, { ...task, title: "Updated Task" })}
        >
          Submit
        </button>
      </div>
    ),
}));

vi.mock("../Modals/ConfirmDeleteModal/ConfirmDeleteModal", () => ({
  default: ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }) =>
    isOpen && (
      <div data-testid="delete-modal">
        <button data-testid="close-delete-modal" onClick={onClose}>
          Close
        </button>
        <button data-testid="confirm-delete" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    ),
}));

vi.mock("../taskDetail/TaskDetailModal", () => ({
  default: ({
    isOpen,
    onClose,
    task,
  }: {
    isOpen: boolean;
    onClose: () => void;
    task: TaskType | null;
  }) =>
    isOpen &&
    task && (
      <div data-testid="detail-modal">
        <span data-testid="detail-title">{task.title}</span>
        <button data-testid="close-detail-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ),
}));

describe("TaskList Component", () => {
  const mockTasks: TaskType[] = [
    {
      id: "1",
      title: "Task 1",
      description: "Description 1",
      status: "pending",
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description 2",
      status: "in_progress",
    },
    {
      id: "3",
      title: "Task 3",
      description: "Description 3",
      status: "completed",
    },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    (axiosInstant.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: mockTasks },
    } as ApiResponse<TaskType[]>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render TaskCard with tasks", async () => {
    render(<TaskList />);

    await waitFor(() => {
      expect(axiosInstant.get).toHaveBeenCalledWith("/tasks");
      expect(screen.getByTestId("task-card")).toBeInTheDocument();
      expect(screen.getByTestId("1")).toBeInTheDocument();
      expect(screen.getByTestId("2")).toBeInTheDocument();
      expect(screen.getByTestId("3")).toBeInTheDocument();
    });
  });

  it("should show error message when fetching tasks fails", async () => {
    (axiosInstant.get as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error")
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByTestId("error-message").textContent).toBe(
        "Failed to load tasks. Please try again."
      );
    });
  });

  it("should open and close add task modal", async () => {
    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("add-button"));
    expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-task-modal"));
    expect(screen.queryByTestId("add-task-modal")).not.toBeInTheDocument();
  });

  it("should add a new task", async () => {
    const newTask: TaskType = {
      id: "4",
      title: "New Task",
      description: "New Description",
      status: "pending",
    };
    (axiosInstant.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: newTask },
    } as ApiResponse<TaskType>);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("add-button"));
    fireEvent.click(screen.getByTestId("submit-add-task"));

    await waitFor(() => {
      expect(axiosInstant.post).toHaveBeenCalledWith("/tasks", {
        title: "New Task",
        description: "New Description",
        status: "pending",
      });
    });
  });

  it("should handle add task error", async () => {
    console.error = vi.fn();
    (axiosInstant.post as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Add failed")
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("add-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("add-button"));
    fireEvent.click(screen.getByTestId("submit-add-task"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error adding task:",
        expect.any(Error)
      );
    });
  });

  it("should open and close edit task modal", async () => {
    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("edit-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-1"));
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-edit-modal"));
    expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
  });

  it("should edit a task", async () => {
    const updatedTask: TaskType = {
      id: "1",
      title: "Updated Task",
      description: "Description 1",
      status: "pending",
    };
    (axiosInstant.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { data: updatedTask },
    } as ApiResponse<TaskType>);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("edit-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-1"));
    fireEvent.click(screen.getByTestId("submit-edit-task"));

    await waitFor(() => {
      expect(axiosInstant.patch).toHaveBeenCalledWith(
        "/tasks/1",
        expect.any(Object)
      );
    });
  });

  it("should handle edit task error", async () => {
    console.error = vi.fn();
    (axiosInstant.patch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Update failed")
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("edit-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-1"));
    fireEvent.click(screen.getByTestId("submit-edit-task"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error updating task:",
        expect.any(Error)
      );
    });
  });

  it("should open and close delete confirmation modal", async () => {
    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("delete-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete-1"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-delete-modal"));
    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  it("should delete a task", async () => {
    (axiosInstant.delete as ReturnType<typeof vi.fn>).mockResolvedValue(
      {} as AxiosResponse
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("delete-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete-1"));
    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(axiosInstant.delete).toHaveBeenCalledWith("/tasks/1");
    });
  });

  it("should handle delete task error", async () => {
    console.error = vi.fn();
    (axiosInstant.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Delete failed")
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("delete-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete-1"));
    fireEvent.click(screen.getByTestId("confirm-delete"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error deleting task:",
        expect.any(Error)
      );
    });
  });

  it("should open and close task detail modal", async () => {
    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("view-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-1"));
    expect(screen.getByTestId("detail-modal")).toBeInTheDocument();
    expect(screen.getByTestId("detail-title").textContent).toBe("Task 1");

    fireEvent.click(screen.getByTestId("close-detail-modal"));
    expect(screen.queryByTestId("detail-modal")).not.toBeInTheDocument();
  });

  it("should change task status from pending to in_progress", async () => {
    (axiosInstant.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        data: {
          id: "1",
          title: "Task 1",
          description: "Description 1",
          status: "in_progress",
        },
      },
    } as ApiResponse<TaskType>);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("status-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("status-1"));

    await waitFor(() => {
      expect(axiosInstant.patch).toHaveBeenCalledWith("/tasks/1", {
        status: "in_progress",
      });
    });
  });

  it("should change task status from in_progress to completed", async () => {
    (axiosInstant.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: {
        data: {
          id: "2",
          title: "Task 2",
          description: "Description 2",
          status: "completed",
        },
      },
    } as ApiResponse<TaskType>);

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("status-2")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("status-2"));

    await waitFor(() => {
      expect(axiosInstant.patch).toHaveBeenCalledWith("/tasks/2", {
        status: "completed",
      });
    });
  });

  it("should not change status for completed tasks", async () => {
    console.log = vi.fn();

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("status-3")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("status-3"));

    expect(console.log).toHaveBeenCalledWith(
      "Status change not allowed for completed tasks"
    );
    expect(axiosInstant.patch).not.toHaveBeenCalled();
  });

  it("should handle status update error", async () => {
    console.error = vi.fn();
    (axiosInstant.patch as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Status update failed")
    );

    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByTestId("status-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("status-1"));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error updating task status:",
        expect.any(Error)
      );
    });
  });

  it("should show empty state when there are no tasks", async () => {
    (axiosInstant.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { data: [] },
    });

    render(<TaskList />);

    const emptyState = await screen.findByTestId("no-task");
    expect(emptyState).toBeInTheDocument();
  });
});
