import type { Interception } from "cypress/types/net-stubbing";

describe("Login - Email and Password Validation (Formik + Yup)", () => {
  context("Email Validation", () => {
    it("should login unsuccessfully because email is empty", () => {
      cy.visit("/login");

      cy.get('input[name="email"]').clear();
      cy.get('input[name="password"]').type("Aa123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-email"]')
        .should("be.visible")
        .and("contain.text", "Email is required");

      cy.url().should("include", "/login");
    });

    it("should show error when email is only whitespace", () => {
      cy.visit("/login");

      cy.get('input[name="email"]').type("     ");
      cy.get('input[name="password"]').type("Aa123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-email"]')
        .should("be.visible")
        .and("contain.text", "Email is required");

      cy.url().should("include", "/login");
    });

    it("should trim whitespace around the email if any", () => {
      cy.visit("/login");

      cy.get('input[name="email"]').type("  tast@example.com  ");
      cy.get('input[name="password"]').type("Aa123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-email"]').should("not.exist");
    });

    const invalidEmails = [
      "invalid-email-format",
      "plainaddress",
      "@missingusername.com",
      "username@.com",
      "username@com",
      "username@com.",
      "test@invalid@domain.com",
    ];

    invalidEmails.forEach((email) => {
      it(`should show error for invalid email: "${email}"`, () => {
        cy.visit("/login");

        cy.get('input[name="email"]').clear().type(email);
        cy.get('input[name="password"]').type("Aa123456789_");
        cy.get('button[type="submit"]').click();

        cy.get('[aria-label="error-email"]')
          .should("be.visible")
          .and("contain.text", "Invalid email format");

        cy.url().should("include", "/login");
      });
    });
  });

  context("Password Validation", () => {
    it("should show error when password is empty", () => {
      cy.visit("/login");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').clear();
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and("contain.text", "Password is required");

      cy.url().should("include", "/login");
    });
  });

  context(
    "Login API Integration (Mock API -Success & Case - Error Cases)",
    () => {
      it("should Login successfully with valid email and password (200 Login success)", () => {
        const randomEmail = `test${Date.now()}@mail.com`;
        const validPassword = "Aa123456789_";

        cy.intercept("POST", "/auth/login", {
          statusCode: 200,
          body: {
            message: "Login successfully",
            data: { id: "fake-id-1234", email: randomEmail },
          },
        }).as("Login");

        cy.visit("/login");
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait("@Login").then((intercept: Interception) => {
          expect(intercept.response.statusCode).to.eq(200);
          expect(intercept.response.body.message).to.eq("Login successfully");
        });

        cy.get('[aria-label="error-email"]').should("not.exist");
        cy.get('[aria-label="error-password"]').should("not.exist");
        cy.get('[aria-label="error_of_login"]').should("not.exist");

        cy.url().should("include", "/");
      });

      it("should show loading spinner and disable button while waiting for login response", () => {
        const randomEmail = `test${Date.now()}@mail.com`;
        const validPassword = "Aa123456789_";

        cy.intercept(
          {
            method: "POST",
            url: "/auth/login",
          },
          (req) => {
            req.reply((res) => {
              res.delay = 2000;
              res.send({
                statusCode: 200,
                body: {
                  message: "Login successfully",
                  data: { id: "fake-id-1234", email: randomEmail },
                },
              });
            });
          }
        ).as("LoginWithDelay");

        cy.visit("/login");

        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type(validPassword);

        cy.get('button[type="submit"]').as("submitButton").click();

        cy.get("@submitButton").should("be.disabled");

        cy.get("@submitButton").find("svg.animate-spin").should("be.visible");

        cy.get("@submitButton").should("contain.text", "Logging in...");

        cy.wait("@LoginWithDelay");
        cy.url().should("include", "/");
      });

      it("should show error message when login fails (401 Unauthorized)", () => {
        const invalidEmail = `wrong${Date.now()}@mail.com`;
        const invalidPassword = "WrongPassword123_";

        cy.intercept("POST", "/auth/login", {
          statusCode: 401,
          body: {
            message: "Email not found or password is incorrect",
          },
        }).as("LoginFail");

        cy.visit("/login");

        cy.get('input[name="email"]').type(invalidEmail);
        cy.get('input[name="password"]').type(invalidPassword);
        cy.get('button[type="submit"]').click();

        cy.wait("@LoginFail").then((intercept: Interception) => {
          expect(intercept.response.statusCode).to.eq(401);
          expect(intercept.response.body.message).to.eq(
            "Email not found or password is incorrect"
          );
        });

        cy.get('[aria-label="error_of_login"]')
          .should("be.visible")
          .and("contain.text", "Email not found or password is incorrect");

        cy.url().should("include", "/login");
      });

      it("should handle server error (500 Internal Server Error)", () => {
        cy.intercept("POST", "/users", {
          statusCode: 500,
          body: {
            message: "Something went wrong",
          },
        }).as("CreateUser");

        cy.visit("/register");
        cy.get('input[name="email"]').type(`test${Date.now()}@mail.com`);
        cy.get('input[name="password"]').type("Aa123456789_");
        cy.get('button[type="submit"]').click();

        cy.wait("@CreateUser");
        cy.get('[aria-label="error_of_register"]')
          .should("be.visible")
          .and("contain.text", "Something went wrong");

        cy.url().should("include", "/register");
      });
    }
  );
});
