import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import RegisterPage from "./Register";

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockNavigate = vi.fn();

describe("Register Page", () => {
  it("should load and display register page", () => {
    render(<RegisterPage />);

    expect(
      screen.getByRole("heading", { name: /Register/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("register-email")).toBeInTheDocument();
    expect(screen.getByLabelText("register-password")).toBeInTheDocument();
    expect(
      screen.getByLabelText("submit-register-loading-spinner")
    ).toBeInTheDocument();
  });
});
