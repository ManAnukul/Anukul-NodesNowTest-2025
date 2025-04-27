import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import TasksManagementPage from "./TasksManagementPage";
import axiosInstant from "../../lib/axios";

vi.mock("../../lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockNavigate = vi.fn();

describe("Register Page", () => {
  it("should load and display register page when user is not authenticated", async () => {
    vi.mocked(axiosInstant.get).mockRejectedValueOnce(
      new Error("Not logged in")
    );
    render(<TasksManagementPage />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("should load and display register page when user is authenticated", async () => {
    vi.mocked(axiosInstant.get).mockResolvedValueOnce({
      status: 200,
      data: { data: { email: "test@example.com" } },
    });
    render(<TasksManagementPage />);

    expect(await screen.findByText("test@example.com")).toBeInTheDocument();
  });
});
