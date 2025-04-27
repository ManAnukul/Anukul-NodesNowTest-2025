// TaskDetailModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import TaskDetailModal from "./TaskDetailModal";
import { describe, it, expect, vi } from "vitest";
import type TaskType from "../../Types/TaskType";

describe("TaskDetailModal", () => {
  const mockTask: TaskType = {
    id: "1",
    title: "Test Task",
    description: "This is a test task",
    status: "Pending",
  };

  it("should not render anything when isOpen is false", () => {
    const { queryByTestId } = render(
      <TaskDetailModal isOpen={false} onClose={() => {}} task={mockTask} />
    );
    expect(queryByTestId("task-detail-modal")).not.toBeInTheDocument();
  });

  it("should render task details correctly when task is provided", () => {
    render(
      <TaskDetailModal isOpen={true} onClose={() => {}} task={mockTask} />
    );

    expect(screen.getByTestId("task-detail-modal")).toBeInTheDocument();
    expect(screen.getByTestId("task-detail-title")).toHaveTextContent(
      "Title: Test Task"
    );
    expect(screen.getByTestId("task-detail-description")).toHaveTextContent(
      "Description: This is a test task"
    );
    expect(screen.getByTestId("task-detail-status")).toHaveTextContent(
      "Status: Pending"
    );
  });

  it("should render fallback message when task is null", () => {
    render(<TaskDetailModal isOpen={true} onClose={() => {}} task={null} />);

    expect(screen.getByText("Don't have any Task")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<TaskDetailModal isOpen={true} onClose={onClose} task={mockTask} />);

    const closeButton = screen.getByTestId("close-detail-modal");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
