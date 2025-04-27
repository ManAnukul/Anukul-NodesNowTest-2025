import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddTaskModal from "./AddTaskModal";

describe("AddTaskModal", () => {
  const onClose = vi.fn();
  const onAdd = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the modal when isOpen is true", () => {
    render(<AddTaskModal isOpen={true} onClose={onClose} onAdd={onAdd} />);
    expect(screen.getByLabelText("add-task-modal")).toBeInTheDocument();
    expect(screen.getByText("Add New Task")).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    render(<AddTaskModal isOpen={false} onClose={onClose} onAdd={onAdd} />);
    expect(screen.queryByLabelText("add-task-modal")).toBeNull();
  });

  it("should show validation error if title is empty and form is submitted", async () => {
    render(<AddTaskModal isOpen={true} onClose={onClose} onAdd={onAdd} />);

    fireEvent.click(screen.getByLabelText("submit-add-task"));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    expect(onAdd).not.toHaveBeenCalled();
  });

  it("should call onAdd and onClose with valid data", async () => {
    render(<AddTaskModal isOpen={true} onClose={onClose} onAdd={onAdd} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "This is a task description" },
    });

    fireEvent.click(screen.getByLabelText("submit-add-task"));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith({
        title: "New Task",
        description: "This is a task description",
        status: "pending",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should reset form when reopen modal after cancel", async () => {
    const { rerender } = render(
      <AddTaskModal isOpen={true} onClose={onClose} onAdd={onAdd} />
    );

    const titleInput = screen.getByLabelText("Title");

    fireEvent.change(titleInput, { target: { value: "Some Title" } });
    expect(titleInput).toHaveValue("Some Title");
    
    fireEvent.click(screen.getByLabelText("close-add-task-modal"));
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });

    rerender(<AddTaskModal isOpen={true} onClose={onClose} onAdd={onAdd} />);

    expect(screen.getByLabelText("Title")).toHaveValue("");
  });
});
