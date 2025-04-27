import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import LoginPage from "./LoginPage";

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockNavigate = vi.fn();

describe("Login Page", () => {
  it("should load and display login page", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText("login-email")).toBeInTheDocument();
    expect(screen.getByLabelText("login-password")).toBeInTheDocument();
    expect(
      screen.getByText("Don't have an account? Create one")
    ).toBeInTheDocument();
  });
});
