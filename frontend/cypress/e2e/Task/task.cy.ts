import { Interception } from "cypress/types/net-stubbing";

describe("Tasks Management Page", () => {
  // กรณีที่ยังไม่ได้ล็อกอิน
  context("When not authenticated", () => {
    it("should redirect to login page", () => {
      cy.visit("/");
      cy.url().should("include", "/login");
    });
  });

  // กรณีล็อกอินแล้ว
  context("When authenticated", () => {
    beforeEach(() => {
      cy.setCookie("access_token", "fake-jwt-token");

      cy.intercept("GET", "/users/me", {
        statusCode: 200,
        body: {
          data: {
            email: "testuser@example.com",
          },
        },
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

    it("should display navbar with task", () => {
      cy.get("nav").should("exist");
      cy.contains("Test Task 1").should("be.visible");
      cy.contains("Test Task 2").should("be.visible");
    });

    context("Add Task Modal", () => {
      beforeEach(() => {
        cy.setCookie("access_token", "fake-jwt-token");

        cy.intercept("GET", "/tasks", {
          statusCode: 200,
          body: { data: [] },
        }).as("getTasks");

        cy.visit("/");
        cy.wait("@getTasks");
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

      it("should add a new task when form is filled correctly with status pending", () => {
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

          // ✅ หา task จาก data-task-id ที่ได้มาจาก response
          cy.get(`[data-task-id="${newTaskId}"]`)
            .should("exist")
            .and("contain.text", "pending"); // ตรวจ status ด้วยก็ได้
        });
      });
    });

    it("should open and close task detail modal", () => {
      cy.contains("Test Task 1").click();
      cy.get("[data-cy=task-detail-modal]").should("be.visible");
      cy.get("[data-cy=close-detail-modal]").click();
      cy.get("[data-cy=task-detail-modal]").should("not.exist");
    });

    it("should open edit modal, edit task, and update list", () => {
      cy.intercept("PATCH", "/tasks/*", {
        statusCode: 200,
        body: { data: { title: "Updated Task 1" } },
      }).as("editTask");

      cy.get("[data-cy=edit-task-button]").first().click();
      cy.get("[data-cy=edit-task-modal]").should("be.visible");

      cy.get("[data-cy=edit-task-title-input]").clear().type("Updated Task 1");
      cy.get("[data-cy=submit-edit-task-button]").click();

      cy.wait("@editTask").then((interception:Interception) => {
        const updatedTaskTitle = interception.response.body.data.title;
        const taskId = interception.request.url.split("/").pop(); // เอา id จาก url patch

        cy.get(`[data-task-id="${taskId}"]`)
          .should("exist")
          .and("contain.text", updatedTaskTitle);
      });
    });

    it("should delete a task", () => {
      cy.intercept("DELETE", "/tasks/*", {
        statusCode: 200,
      }).as("deleteTask");

      // กดปุ่ม delete ของ task แรก
      cy.get("[data-cy=delete-task-button]").first().click();
      cy.get("[data-cy=confirm-delete]").click();

      cy.wait("@deleteTask").then((interception:Interception) => {
        const taskId = interception.request.url.split("/").pop();

        cy.get(`[data-task-id="${taskId}"]`).should("not.exist");
      });
    });

    it("should update task status (pending -> in_progress -> completed)", () => {
      cy.intercept("PATCH", "/tasks/*", (req) => {
        req.reply({
          statusCode: 200,
          body: {
            data: {
              status: req.body.status,
            },
          },
        });
      }).as("updateStatus");

      // กดเปลี่ยนสถานะครั้งแรก (pending -> in_progress)
      cy.get("[data-cy=status-change-button]").first().click();
      cy.wait("@updateStatus").then((interception:Interception) => {
        const updatedStatus = interception.response.body.data.status;
        const taskId = interception.request.url.split("/").pop();

        cy.get(`[data-task-id="${taskId}"]`)
          .should("exist")
          .and("contain.text", updatedStatus);
      });

      // กดเปลี่ยนสถานะครั้งสอง (in_progress -> completed)
      cy.get("[data-cy=status-change-button]").first().click();
      cy.wait("@updateStatus").then((interception:Interception) => {
        const updatedStatus = interception.response.body.data.status;
        const taskId = interception.request.url.split("/").pop();

        cy.get(`[data-task-id="${taskId}"]`)
          .should("exist")
          .and("contain.text", updatedStatus);
      });
    });

    it("should not change status if already completed", () => {
      // Mock completed task
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

      // ต้อง intercept PATCH ด้วยนะ ถึงแม้ไม่คิดว่าจะโดนเรียก
      cy.intercept("PATCH", "/tasks/*").as("updateStatus");

      cy.visit("/");
      cy.wait("@getCompletedTask");

      // กดปุ่มเปลี่ยนสถานะ
      cy.get("[data-cy=status-change-button]").first().click();

      // รอเผื่อว่ามี call หรือไม่
      cy.wait(500);

      // ตรวจสอบว่าไม่มี PATCH ถูกยิงเลย
      cy.get("@updateStatus.all").should("have.length", 0);
    });
  });
});
