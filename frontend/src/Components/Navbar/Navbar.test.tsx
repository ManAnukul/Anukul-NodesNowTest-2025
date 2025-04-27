import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";
import { expect, vi } from "vitest";
import axiosInstant from "../../lib/axios";

vi.mock("../../lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => {
  const actual =
    vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login button when user is not authenticated", async () => {
    vi.mocked(axiosInstant.get).mockRejectedValueOnce(
      new Error("Not logged in")
    );

    render(<Navbar />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("renders user email when user is authenticated", async () => {
    vi.mocked(axiosInstant.get).mockResolvedValueOnce({
      status: 200,
      data: { data: { email: "test@example.com" } },
    });

    render(<Navbar />);

    expect(await screen.findByText("test@example.com")).toBeInTheDocument();
  });

  it("opens and closes dropdown menu", async () => {
    vi.mocked(axiosInstant.get).mockResolvedValueOnce({
      status: 200,
      data: { data: { email: "test@example.com" } },
    });

    render(<Navbar />);

    const dropdownButton = await screen.findByLabelText(
      "dropdown-logout-button"
    );
    fireEvent.click(dropdownButton);

    expect(screen.getByLabelText("logout-button")).toBeInTheDocument();

    fireEvent.mouseDown(document);

    await waitFor(() => {
      expect(screen.queryByLabelText("logout-button")).not.toBeInTheDocument();
    });
  });

  it("calls logout API and navigates to login page", async () => {
    vi.mocked(axiosInstant.get).mockResolvedValueOnce({
      status: 200,
      data: { data: { email: "test@example.com" } },
    });

    vi.mocked(axiosInstant.post).mockResolvedValueOnce({
      status: 200,
      data: {},
    });

    render(<Navbar />);

    const dropdownButton = await screen.findByLabelText(
      "dropdown-logout-button"
    );
    fireEvent.click(dropdownButton);

    const logoutButton = await screen.findByLabelText("logout-button");
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(axiosInstant.post).toHaveBeenCalledWith(
        "/auth/logout",
        {},
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
