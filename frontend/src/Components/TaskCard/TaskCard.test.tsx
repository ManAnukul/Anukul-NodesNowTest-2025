import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard"; // ปรับ path ตามโปรเจคของคุณ
import TaskCardPropsExtended from "../../Types/TaskCardProps";

const mockTasks = [
  {
    id: "1",
    title: "Test Task 1",
    description: "Description for task 1",
    status: "pending",
  },
  {
    id: "2",
    title: "Test Task 2",
    description: "Description for task 2",
    status: "completed",
  },
];

describe("TaskCard", () => {
  const onAdd = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onView = vi.fn();
  const onStatusChange = vi.fn();

  const defaultProps: TaskCardPropsExtended = {
    task: mockTasks,
    onAdd,
    onEdit,
    onDelete,
    onView,
    onStatusChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task list correctly", () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText("Task List")).toBeInTheDocument();
    expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
  });

  it("calls onAdd when 'Add Task' button is clicked", () => {
    render(<TaskCard {...defaultProps} />);

    const addButton = screen.getByTestId("add-button");
    fireEvent.click(addButton);

    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it("calls onView when task title is clicked", () => {
    render(<TaskCard {...defaultProps} />);

    const taskButton = screen.getByText("Test Task 1");
    fireEvent.click(taskButton);

    expect(onView).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("calls onStatusChange when status button is clicked", () => {
    render(<TaskCard {...defaultProps} />);

    const statusButtons = screen.getAllByTestId("status-change-button");
    fireEvent.click(statusButtons[0]);

    expect(onStatusChange).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("calls onEdit when edit button is clicked", () => {
    render(<TaskCard {...defaultProps} />);

    const editButtons = screen.getAllByTestId("edit-task-button");
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(<TaskCard {...defaultProps} />);

    const deleteButtons = screen.getAllByTestId("delete-task-button");
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(mockTasks[0]);
  });

  it("displays error message when errorMessage prop is provided", () => {
    render(
      <TaskCard
        {...defaultProps}
        errorMessage="Failed to fetch tasks"
        task={[]}
      />
    );

    expect(screen.getByText("Failed to fetch tasks")).toBeInTheDocument();
  });

  it("displays 'Don't have any Task' when no tasks and no error", () => {
    render(<TaskCard {...defaultProps} task={[]} />);

    expect(screen.getByText("Don't have any Task")).toBeInTheDocument();
  });
});
