import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditTaskModal from "./EditTaskModal";
import "@testing-library/jest-dom";

const mockTask = {
  id: "1",
  title: "Existing Task",
  description: "Existing description",
  status: "pending",
};

describe("EditTaskModal", () => {
  const onClose = vi.fn();
  const onEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render modal with task data when open", () => {
    render(
      <EditTaskModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    expect(screen.getByLabelText("edit-task-title-input")).toHaveValue(
      "Existing Task"
    );
    expect(
      screen.getByDisplayValue("Existing description")
    ).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(
      <EditTaskModal
        isOpen={false}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    expect(screen.queryByTestId("edit-task-modal")).not.toBeInTheDocument();
  });

  it("should show validation error if title is empty", async () => {
    render(
      <EditTaskModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    const titleInput = screen.getByLabelText("edit-task-title-input");

    fireEvent.change(titleInput, { target: { value: "Changed" } });
    fireEvent.change(titleInput, { target: { value: "" } });
    fireEvent.blur(titleInput);

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("submit-edit-task-button")).toBeDisabled();
  });

  it("should call onEdit and onClose with updated task when form is submitted", async () => {
    render(
      <EditTaskModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    fireEvent.change(screen.getByLabelText("edit-task-title-input"), {
      target: { value: "Updated Task Title" },
    });

    fireEvent.click(screen.getByLabelText("submit-edit-task-button"));

    await waitFor(() => {
      expect(onEdit).toHaveBeenCalledWith("1", {
        id: "1",
        title: "Updated Task Title",
        description: "Existing description",
        status: "pending",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should reset form and call onClose when cancel is clicked", async () => {
    const { rerender } = render(
      <EditTaskModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    fireEvent.change(screen.getByLabelText("edit-task-title-input"), {
      target: { value: "Temporary change" },
    });

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    expect(onEdit).not.toHaveBeenCalled();

    rerender(
      <EditTaskModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    expect(
      (screen.getByLabelText("edit-task-title-input") as HTMLInputElement).value
    ).toBe(mockTask.title);
  });

  it("should disable Save button if form is not dirty", () => {
    render(
      <EditTaskModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        task={mockTask}
      />
    );

    const saveButton = screen.getByLabelText("submit-edit-task-button");
    expect(saveButton).toBeDisabled();
  });
});
