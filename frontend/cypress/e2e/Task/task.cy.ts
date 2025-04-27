import { Interception } from "cypress/types/net-stubbing";

describe("Tasks Management Page", () => {
  context("Authentication", () => {
    context("When not authenticated", () => {
      it("should redirect to login page when API returns 401", () => {
        cy.intercept("GET", "/tasks", { statusCode: 401 }).as(
          "Authentication required"
        );

        cy.visit("/");
        cy.wait("@Authentication required");

        cy.url().should("include", "/login");
      });
    });

    context("Real Login and Logout", () => {
      it("should login, save JWT in cookie, logout, and verify backend response", () => {
        const randomEmail = "test@gmail.com";
        const validPassword = "Aa123456789_";

        cy.request({
          method: "POST",
          url: "http://localhost:3000/auth/login",
          body: { email: randomEmail, password: validPassword },
        }).then(
          (
            response: Cypress.Response<{
              message: string;
              access_token?: string;
            }>
          ) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq("Login successful");
            cy.getCookie("access_token").should("exist");
          }
        );

        cy.visit("/");
        cy.url().should("include", "/");

        cy.intercept("POST", "/auth/logout").as("Logout");

        cy.get("[data-cy=dropdown-logout-button]").click();
        cy.get("[data-cy=logout-button]").click();

        cy.url().should("include", "/login");

        cy.wait("@Logout").then((intercept: Interception) => {
          expect(intercept.response.statusCode).to.eq(200);
          expect(intercept.response.body.message).to.eq("Logout successful");
        });

        cy.getCookie("access_token").should("not.exist");
      });
    });
  });

  context("When authenticated", () => {
    beforeEach(() => {
      cy.setCookie("access_token", "fake-jwt-token");

      cy.intercept("GET", "/users/me", {
        statusCode: 200,
        body: { data: { email: "testuser@example.com" } },
      }).as("getMe");

      cy.intercept("GET", "/tasks", {
        statusCode: 200,
        body: {
          data: [
            {
              id: "1",
              title: "Test Task 1",
              description: "Desc 1",
              status: "pending",
            },
            {
              id: "2",
              title: "Test Task 2",
              description: "Desc 2",
              status: "in_progress",
            },
          ],
        },
      }).as("getTasks");

      cy.visit("/");
      cy.wait("@getMe");
      cy.wait("@getTasks");
    });

    context("Navbar", () => {
      it("should display the navbar", () => {
        cy.get("nav").should("exist");
      });
    });

    context("Task List", () => {
      it("should display tasks from the API response", () => {
        cy.get("[data-cy=task-list]").within(() => {
          cy.get("[data-task-id='1']").should("contain.text", "Test Task 1");
          cy.get("[data-task-id='2']").should("contain.text", "Test Task 2");
        });
      });

      it("should display the correct number of tasks", () => {
        cy.get("[data-cy=task-list]").within(() => {
          cy.get("[data-task-id]").should("have.length", 2);
        });
      });
    });

    context("Add Task", () => {
      context("Empty list initially", () => {
        beforeEach(() => {
          cy.intercept("GET", "/tasks", {
            statusCode: 200,
            body: { data: [] },
          }).as("getEmptyTasks");
          cy.visit("/");
          cy.wait("@getEmptyTasks");
        });

        it("should open the add task modal", () => {
          cy.contains("Add Task").click();
          cy.get("[data-cy=add-task-modal]").should("be.visible");
        });

        it("should close the add task modal by clicking cancel", () => {
          cy.contains("Add Task").click();
          cy.get("[data-cy=add-task-modal]").should("be.visible");
          cy.get("button[data-cy=close-add-task-modal]").click();
          cy.get("[data-cy=add-task-modal]").should("not.exist");
        });

        it("should show validation error when submitting empty form", () => {
          cy.contains("Add Task").click();
          cy.get("[data-cy=submit-add-task]").click();
          cy.contains("Title is required").should("be.visible");
        });

        it("should add a new task when form is filled correctly", () => {
          cy.intercept("POST", "/tasks", {
            statusCode: 201,
            body: {
              data: {
                id: "123",
                title: "Test New Task",
                description: "Test Description",
                status: "pending",
              },
            },
          }).as("createTask");

          cy.contains("Add Task").click();
          cy.get("[data-cy=add-task-title]").type("Test New Task");
          cy.get("[data-cy=add-task-description]").type("Test Description");
          cy.get("[data-cy=submit-add-task]").click();

          cy.wait("@createTask").then((interception: Interception) => {
            const newTaskId = interception.response.body.data.id;
            cy.get(`[data-task-id="${newTaskId}"]`)
              .should("exist")
              .and("contain.text", "pending");
          });
        });
      });
    });

    context("Task Detail", () => {
      it("should open and close task detail modal with correct data", () => {
        cy.contains("Test Task 1").click();
        cy.get("[data-cy=task-detail-modal]").should("be.visible");

        cy.get("[data-cy=task-detail-title]").should(
          "contain.text",
          "Test Task 1"
        );

        cy.get("[data-cy=task-detail-description]").should(
          "contain.text",
          "Desc 1"
        );

        cy.get("[data-cy=task-detail-status]").should(
          "contain.text",
          "pending"
        );

        cy.get("[data-cy=close-detail-modal]").click();
        cy.get("[data-cy=task-detail-modal]").should("not.exist");
      });
    });

    context("Edit Task", () => {
      it("should open edit modal, edit task, and update list", () => {
        cy.intercept("PATCH", "/tasks/*", {
          statusCode: 200,
          body: { data: { title: "Updated Task 1" } },
        }).as("editTask");

        cy.get("[data-cy=edit-task-button]").first().click();
        cy.get("[data-cy=edit-task-modal]").should("be.visible");
        cy.get("[data-cy=edit-task-title-input]")
          .clear()
          .type("Updated Task 1");
        cy.get("[data-cy=submit-edit-task-button]").click();

        cy.wait("@editTask").then((interception: Interception) => {
          const updatedTitle = interception.response.body.data.title;
          const taskId = interception.request.url.split("/").pop();

          cy.get(`[data-task-id="${taskId}"]`)
            .should("exist")
            .and("contain.text", updatedTitle);
        });
      });
    });

    context("Delete Task", () => {
      it("should delete a task", () => {
        cy.intercept("DELETE", "/tasks/*", { statusCode: 200 }).as(
          "deleteTask"
        );

        cy.get("[data-cy=delete-task-button]").first().click();
        cy.get("[data-cy=confirm-delete]").click();

        cy.wait("@deleteTask").then((interception: Interception) => {
          const taskId = interception.request.url.split("/").pop();
          cy.get(`[data-task-id="${taskId}"]`).should("not.exist");
        });
      });
    });

    context("Task Status Update", () => {
      it("should update task status (pending -> in_progress -> completed)", () => {
        cy.intercept("PATCH", "/tasks/*", (req) => {
          req.reply({
            statusCode: 200,
            body: { data: { status: req.body.status } },
          });
        }).as("updateStatus");

        cy.get("[data-cy=status-change-button]").first().click();
        cy.wait("@updateStatus");

        cy.get("[data-cy=status-change-button]").first().click();
        cy.wait("@updateStatus");
      });

      it("should not change status if already completed", () => {
        cy.intercept("GET", "/tasks", {
          statusCode: 200,
          body: {
            data: [
              {
                id: "3",
                title: "Completed Task",
                description: "Already done",
                status: "completed",
              },
            ],
          },
        }).as("getCompletedTask");

        cy.intercept("PATCH", "/tasks/*").as("updateStatus");

        cy.visit("/");
        cy.wait("@getCompletedTask");

        cy.get("[data-cy=status-change-button]").first().click();
        cy.wait(500);

        cy.get("@updateStatus.all").should("have.length", 0);
      });
    });

    context("Empty and Error States", () => {
      it("should show empty state message when no tasks", () => {
        cy.intercept("GET", "/tasks", {
          statusCode: 200,
          body: { data: [] },
        }).as("emptyTasks");
        cy.visit("/");
        cy.wait("@emptyTasks");
        cy.contains("Don't have any Task").should("be.visible");
      });

      it("should show error message when tasks fetch fails", () => {
        cy.intercept("GET", "/tasks", { statusCode: 500 }).as("failTasks");
        cy.visit("/");
        cy.wait("@failTasks");
        cy.contains("Failed to load tasks. Please try again.").should(
          "be.visible"
        );
      });
    });

    context("Logout", () => {
      it("should logout and redirect to login page", () => {
        cy.intercept("POST", "/auth/logout", { statusCode: 200 }).as(
          "logoutRequest"
        );

        cy.get("[data-cy=dropdown-logout-button]").click();
        cy.get("[data-cy=logout-button]").click();

        cy.wait("@logoutRequest");
        cy.clearCookies();
        cy.getCookie("access_token").should("not.exist");
        cy.url().should("include", "/login");
      });
    });
  });
});
