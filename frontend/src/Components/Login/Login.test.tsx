import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Login from "./Login";
import axiosInstant from "../../lib/axios";

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("login-email")).toBeInTheDocument();
    expect(screen.getByLabelText("login-password")).toBeInTheDocument();
    expect(
      screen.getByText("Don't have an account? Create one")
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty form submission", async () => {
    render(<Login />);

    const submitButton = screen.getByLabelText("submit-login-loading-spinner");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("login-email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  it("validates email domain correctly", async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("login-email");
    fireEvent.change(emailInput, { target: { value: "test@example" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    vi.mocked(axiosInstant.post).mockResolvedValueOnce({ status: 200 });

    render(<Login />);

    const emailInput = screen.getByLabelText("login-email");
    const passwordInput = screen.getByLabelText("login-password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123_" } });

    const submitButton = screen.getByLabelText("submit-login-loading-spinner");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstant.post).toHaveBeenCalledWith(
        "/auth/login",
        { email: "test@example.com", password: "password123_" },
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows loading state during authentication", async () => {
    vi.mocked(axiosInstant.post).mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ status: 200 });
        }, 100);
      });
    });

    render(<Login />);

    const emailInput = screen.getByLabelText("login-email");
    const passwordInput = screen.getByLabelText("login-password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123_" } });

    const submitButton = screen.getByLabelText("submit-login-loading-spinner");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Logging in...")).toBeInTheDocument();
    });
    expect(
      screen.getByLabelText("submit-login-loading-spinner")
    ).toHaveAttribute("disabled");

    await waitFor(() => {
      expect(axiosInstant.post).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles API error response when email and password is incorrect", async () => {
    const errorMessage = "Email not found or password is incorrect";

    vi.mocked(axiosInstant.post).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        statusCode: 401,
        data: { message: errorMessage },
      },
    });

    render(<Login />);

    const emailInput = screen.getByLabelText("login-email");
    const passwordInput = screen.getByLabelText("login-password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });

    const submitButton = screen.getByLabelText("submit-login-loading-spinner");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorAlert = screen.getByRole("alert", { name: "error_of_login" });
      expect(errorAlert).toBeInTheDocument();
      expect(
        screen.getByText("Email not found or password is incorrect")
      ).toBeInTheDocument();
    });
  });

  it("handles unknown error during login", async () => {
    vi.mocked(axiosInstant.post).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<Login />);

    const emailInput = screen.getByLabelText("login-email");
    const passwordInput = screen.getByLabelText("login-password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByLabelText("submit-login-loading-spinner");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText("An unknown error occurred.")
      ).toBeInTheDocument();
    });
  });

  it("redirects to register page when clicking register link", () => {
    render(<Login />);

    const registerLink = screen.getByText("Don't have an account? Create one");
    fireEvent.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
