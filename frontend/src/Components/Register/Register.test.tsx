import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Register from "./Register";
import userEvent from "@testing-library/user-event";
import axiosInstant from "../../lib/axios";

vi.mock("../../lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render register form", () => {
    render(<Register />);
    expect(
      screen.getByRole("heading", { name: /Register/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("register-email")).toBeInTheDocument();
    expect(screen.getByLabelText("register-password")).toBeInTheDocument();
    expect(
      screen.getByLabelText("submit-register-loading-spinner")
    ).toBeInTheDocument();
  });

  it("should show validation errors if fields are empty", async () => {
    render(<Register />);

    fireEvent.submit(screen.getByTestId("submit-register-loading-spinner"));

    expect(await screen.findByLabelText("error-email")).toHaveTextContent(
      "Email is required"
    );
    expect(await screen.findByLabelText("error-password")).toHaveTextContent(
      "Password is required"
    );
  });

  it("should show validation error for invalid email and password format", async () => {
    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "123" },
    });

    fireEvent.submit(screen.getByTestId("submit-register-loading-spinner"));

    expect(await screen.findByLabelText("error-email")).toHaveTextContent(
      "Invalid email format"
    );
    expect(await screen.findByLabelText("error-password")).toHaveTextContent(
      "Password must be at least 8 characters"
    );
  });

  it("should register successfully and navigate to login", async () => {
    const mockPost = axiosInstant.post as unknown as ReturnType<typeof vi.fn>;
    mockPost.mockResolvedValueOnce({ status: 201 });

    render(<Register />);

    fireEvent.change(screen.getByLabelText("register-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("register-password"), {
      target: { value: "Test1234!" },
    });

    const submitButton = screen.getByLabelText(
      "submit-register-loading-spinner"
    );
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/users", {
        email: "test@example.com",
        password: "Test1234!",
      });
    });
  });

  it("should show error if registration fails with axios error", async () => {
    const mockPost = axiosInstant.post as unknown as ReturnType<typeof vi.fn>;
    mockPost.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: "Email already exists" } },
    });

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "exist@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "Test1234!" },
    });

    fireEvent.submit(screen.getByLabelText("submit-register-loading-spinner"));

    expect(
      await screen.findByRole("alert", { name: "error_of_register" })
    ).toHaveTextContent("Email already exists");
  });

  it("should show unknown error if non-axios error occurs", async () => {
    const mockPost = axiosInstant.post as unknown as ReturnType<typeof vi.fn>;
    mockPost.mockRejectedValueOnce(new Error("Something went wrong"));

    render(<Register />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "Test1234!" },
    });

    fireEvent.submit(screen.getByLabelText("submit-register-loading-spinner"));

    expect(
      await screen.findByRole("alert", { name: "error_of_register" })
    ).toHaveTextContent("An unknown error occurred.");
  });

  it("should navigate to login page when click 'Already have an account? Login'", async () => {
    render(<Register />);

    const loginButton = screen.getByLabelText("have-account-on-register");
    await userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should disable button and show loader when loading", async () => {
    const mockPost = vi.fn(() => new Promise(() => {}));
    (axiosInstant.post as unknown as typeof mockPost) = mockPost;

    render(<Register />);

    fireEvent.change(screen.getByLabelText("register-email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText("register-password"), {
      target: { value: "Test1234!" },
    });

    const submitButton = screen.getByTestId("submit-register-loading-spinner");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(screen.getByText(/Registering in/i)).toBeInTheDocument();
    expect(submitButton.querySelector("svg")).toBeInTheDocument();
  });
});
