import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the modal when isOpen is true", () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText("Delete Task")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this task?")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("cancel-delete")).toBeInTheDocument();
    expect(screen.getByLabelText("confirm-delete")).toBeInTheDocument();
  });

  it("should not render the modal when isOpen is false", () => {
    render(
      <ConfirmDeleteModal
        isOpen={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.queryByText("Delete Task")).toBeNull();
  });

  it("should call onClose when Cancel button is clicked", () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByLabelText("cancel-delete"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("should call onConfirm when Delete button is clicked", () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByLabelText("confirm-delete"));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });
});
