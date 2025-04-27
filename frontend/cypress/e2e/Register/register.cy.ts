import type { Interception } from "cypress/types/net-stubbing";

describe("Register - Email and Password Validation (Formik + Yup)", () => {
  context("Email Validation", () => {
    it("should register successfully with valid email", () => {
      const validEmail = `test${Date.now()}@example.com`;
      const validPassword = "Aa123456789_";

      cy.intercept("POST", "/users", {
        statusCode: 201,
        body: {
          message: "User created successfully",
          data: { id: "fake-id-1234", email: validEmail },
        },
      }).as("CreateUser");

      cy.visit("/register");

      cy.get('input[name="email"]').type(validEmail);
      cy.get('input[name="password"]').type(validPassword);
      cy.get('button[type="submit"]').click();

      cy.wait("@CreateUser").then((intercept: Interception) => {
        expect(intercept.response.statusCode).to.eq(201);
        expect(intercept.response.body.message).to.eq(
          "User created successfully"
        );
      });

      cy.get('[aria-label="error-email"]').should("not.exist");
      cy.get('[aria-label="error-password"]').should("not.exist");

      cy.url().should("include", "/login");
    });

    it("should register unsuccessfully because email is empty", () => {
      cy.visit("/register");

      cy.get('input[name="email"]').clear();
      cy.get('input[name="password"]').type("Aa123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-email"]')
        .should("be.visible")
        .and("contain.text", "Email is required");

      cy.url().should("include", "/register");
    });

    it("should show error when email is only whitespace", () => {
      cy.visit("/register");

      cy.get('input[name="email"]').type("     ");
      cy.get('input[name="password"]').type("Aa123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-email"]')
        .should("be.visible")
        .and("contain.text", "Email is required");

      cy.url().should("include", "/register");
    });

    it("should trim whitespace around the email if any", () => {
      cy.visit("/register");

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
        cy.visit("/register");

        cy.get('input[name="email"]').clear().type(email);
        cy.get('input[name="password"]').type("Aa123456789_");
        cy.get('button[type="submit"]').click();

        cy.get('[aria-label="error-email"]')
          .should("be.visible")
          .and("contain.text", "Invalid email format");

        cy.url().should("include", "/register");
      });
    });
  });

  context("Password Validation", () => {
    it("should register successfully with valid password (8 characters)", () => {
      const randomEmail = `test${Date.now()}@mail.com`;
      const validPassword8 = "Aa1_2345";

      cy.intercept("POST", "/users", {
        statusCode: 201,
        body: {
          message: "User created successfully",
          data: { id: "fake-id-1234", email: randomEmail },
        },
      }).as("CreateUser");

      cy.visit("/register");
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type(validPassword8);
      cy.get('button[type="submit"]').click();

      cy.wait("@CreateUser").then((intercept: Interception) => {
        expect(intercept.response.statusCode).to.eq(201);
      });

      cy.get('[aria-label="error-password"]').should("not.exist");
      cy.url().should("include", "/login");
    });

    it("should register successfully with valid password (20 characters)", () => {
      const randomEmail = `test${Date.now()}@mail.com`;
      const validPassword20 = "Aa1_" + "aA1_" + "aA1_" + "aA1_"+ "aA1_";

      cy.intercept("POST", "/users", {
        statusCode: 201,
        body: {
          message: "User created successfully",
          data: { id: "fake-id-1234", email: randomEmail },
        },
      }).as("CreateUser");

      cy.visit("/register");
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type(validPassword20);
      cy.get('button[type="submit"]').click();

      cy.wait("@CreateUser").then((intercept: Interception) => {
        expect(intercept.response.statusCode).to.eq(201);
      });

      cy.get('[aria-label="error-password"]').should("not.exist");
      cy.url().should("include", "/login");
    });

    it("should show error when password missing uppercase", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').type("a123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and(
          "contain.text",
          "Password must include at least one uppercase letter"
        );

      cy.url().should("include", "/register");
    });

    it("should show error when password missing lowercase", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').type("A123456789_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and(
          "contain.text",
          "Password must include at least one lowercase letter"
        );

      cy.url().should("include", "/register");
    });

    it("should show error when password missing number", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').type("Aakfnaofknafop_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and("contain.text", "Password must include at least one number");
    });

    it("should show error when password missing special character", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').type("Aa123456789");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and(
          "contain.text",
          "Password must include at least one special character"
        );

      cy.url().should("include", "/register");
    });

    it("should show error when password is too short", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').type("Aa1_");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and("contain.text", "Password must be at least 8 characters");

      cy.url().should("include", "/register");
    });

    it("should show error when password is too long", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').type("Aa123456789_".repeat(10), {
        timeout: 10000,
      });
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]', { timeout: 10000 })
        .should("be.visible")
        .and("contain.text", "Password cannot be longer than 20 characters");

      cy.url().should("include", "/register");
    });

    it("should show error when password is empty", () => {
      cy.visit("/register");
      cy.get('input[name="email"]').type("aaaa@gmail.com");
      cy.get('input[name="password"]').clear();
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and("contain.text", "Password is required");

      cy.url().should("include", "/register");
    });

    it("should show error when password is whitespace only", () => {
      const randomEmail = `test${Date.now()}@mail.com`;

      cy.visit("/register");
      cy.get('input[name="email"]').type(randomEmail);
      cy.get('input[name="password"]').type("        ");
      cy.get('button[type="submit"]').click();

      cy.get('[aria-label="error-password"]')
        .should("be.visible")
        .and("contain.text", "Password cannot be empty or whitespace only");

      cy.url().should("include", "/register");
    });
  });

  context("Register API Integration (Mock API -Success Case & - Error Cases)",() => {
      it("should register successfully with valid email and password", () => {
        const randomEmail = `test${Date.now()}@mail.com`;
        const validPassword = "Aa123456789_";

        cy.intercept("POST", "/users", {
          statusCode: 201,
          body: {
            message: "User created successfully",
            data: { id: "fake-id-1234", email: randomEmail },
          },
        }).as("CreateUser");

        cy.visit("/register");
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait("@CreateUser").then((intercept: Interception) => {
          expect(intercept.response.statusCode).to.eq(201);
          expect(intercept.response.body.message).to.eq(
            "User created successfully"
          );
        });

        cy.get('[aria-label="error-email"]').should("not.exist");
        cy.get('[aria-label="error-password"]').should("not.exist");
        cy.get('[aria-label="error_of_register"]').should("not.exist");

        cy.url().should("include", "/login");
      });

      it("should show error if email is already taken (400 Bad Request)", () => {
        const randomEmail = `test${Date.now()}@mail.com`;

        cy.intercept("POST", "/users", {
          statusCode: 400,
          body: {
            message: "Email is already in use",
          },
        }).as("CreateUser");

        cy.visit("/register");
        cy.get('input[name="email"]').type(randomEmail);
        cy.get('input[name="password"]').type("Aa123456789_");
        cy.get('button[type="submit"]').click();

        cy.wait("@CreateUser");
        cy.get('[aria-label="error_of_register"]')
          .should("be.visible")
          .and("contain.text", "Email is already in use");

        cy.url().should("include", "/register");
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
