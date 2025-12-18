import { Given, When, Then, AfterAll } from "quickpickle";
import { expect } from "@playwright/test";

import "@quickpickle/playwright/world";

// Background step
Given("I am on the TODO app homepage", async function (world) {
  // Start the dev server and navigate to the app
  await world.page.goto("http://localhost:3000");
  await world.page.waitForLoadState("networkidle");
});

Given("I am on the detail page for todo {int}", async function (world, id) {
  await world.page.goto(`http://localhost:3000/?id=1:Todo:${id}`);
  await world.page.waitForLoadState("networkidle");
});

Given("I wait {int} seconds", async function (world, seconds) {
  await world.page.waitForTimeout(seconds * 1000);
});

Then("I should see a todo detail", async function (world) {
  await expect(world.page.locator(".todo-detail-panel")).toBeVisible();
  await expect(world.page.locator(".todo-detail-panel")).not.toHaveText(
    "Loading..."
  );
});

// View empty todo list
Then("I should see {string}", async function (world, text) {
  await expect(world.page.getByText(text)).toBeVisible();
});

// Add a new todo
When("I enter {string} in the todo input", async function (world, todoText) {
  await world.page.fill(
    'input[placeholder="What needs to be done?"]',
    todoText
  );
});

When("I click the {string} button", async function (world, buttonText) {
  await world.page.click(`button:has-text("${buttonText}")`);
  // Wait for potential page reload
  await world.page.waitForLoadState("networkidle");
});

Then(
  "I should see {string} in the todo list",
  async function (world, todoText) {
    await expect(
      world.page.locator(".todo-text", { hasText: todoText }).first()
    ).toBeVisible();
  }
);

Then("the active count should be {int}", async function (world, count) {
  const statsText = await world.page
    .locator(".todo-stats span")
    .first()
    .textContent();
  expect(statsText).toContain(`${count} active`);
});

Then("the completed count should be {int}", async function (world, count) {
  const statsText = await world.page
    .locator(".todo-stats span")
    .last()
    .textContent();
  expect(statsText).toContain(`${count} completed`);
});

// Mark todo as complete
Given("I have added a todo {string}", async function (world, todoText) {
  await world.page.fill(
    'input[placeholder="What needs to be done?"]',
    todoText
  );
  await world.page.click('button:has-text("Add Todo")');
  await world.page.waitForLoadState("networkidle");
});

When(
  "I toggle the todo checkbox for {string}",
  async function (world, todoText) {
    const todoItem = world.page
      .locator(".todo-item", {
        has: world.page.locator(".todo-text", { hasText: todoText }),
      })
      .first();
    await todoItem.locator('input[type="checkbox"]').click();
    await world.page.waitForLoadState("networkidle");
  }
);

Then(
  "the todo {string} should be marked as completed",
  async function (world, todoText) {
    const todoItem = world.page
      .locator(".todo-item", {
        has: world.page.locator(".todo-text", { hasText: todoText }),
      })
      .first();
    await expect(todoItem).toHaveClass(/completed/);
  }
);

// Edit a todo
When("I double-click on the todo {string}", async function (world, todoText) {
  const todoTextElement = world.page
    .locator(".todo-text", { hasText: todoText })
    .first();
  await todoTextElement.dblclick();
});

When("I edit the todo to {string}", async function (world, newText) {
  const editInput = world.page.locator("input.todo-edit-input");
  await editInput.fill(newText);
});

When("I press Enter", async function (world) {
  await world.page.keyboard.press("Enter");
  await world.page.waitForLoadState("networkidle");
});

Then(
  "I should not see {string} in the todo list",
  async function (world, todoText) {
    // Wait for the element to be removed from the DOM
    await expect(
      world.page.locator(".todo-text", { hasText: todoText })
    ).toHaveCount(0);
  }
);

// Delete a todo
When(
  "I click the delete button for {string}",
  async function (world, todoText) {
    const todoItem = world.page
      .locator(".todo-item", {
        has: world.page.locator(".todo-text", { hasText: todoText }),
      })
      .first();
    const deleteButton = todoItem.locator("button.todo-action-button.delete");

    // Set up dialog handler before clicking
    world.page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });

    await deleteButton.click();
  }
);

When("I confirm the deletion", async function (world) {
  // The dialog was already triggered by clicking delete button
  // Just wait for the page reload after confirmation
  await world.page.waitForLoadState("networkidle");
});

// Add multiple todos
When("I add the following todos:", async function (world, dataTable) {
  const todos = dataTable.rows();
  for (const row of todos) {
    const todoText = row[0];
    await world.page.fill(
      'input[placeholder="What needs to be done?"]',
      todoText
    );
    await world.page.click('button:has-text("Add Todo")');
    await world.page.waitForLoadState("networkidle");
  }
});

Then("I should see {int} active todos", async function (world, count) {
  const statsText = await world.page
    .locator(".todo-stats span")
    .first()
    .textContent();
  expect(statsText).toContain(`${count} active`);
});

Then("I should not see {string} text", async function (world, text) {
  await expect(world.page.getByText(text)).not.toBeVisible();
});
