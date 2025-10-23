import { Given, When, Then } from 'quickpickle';
import { expect } from 'vitest';

// Background step
Given('I am on the TODO app homepage', async function() {
  // Start the dev server and navigate to the app
  await this.page.goto('http://localhost:3000');
  await this.page.waitForLoadState('networkidle');
});

// View empty todo list
Then('I should see {string}', async function(text) {
  await expect(this.page.getByText(text)).toBeVisible();
});

// Add a new todo
When('I enter {string} in the todo input', async function(todoText) {
  await this.page.fill('input[placeholder="What needs to be done?"]', todoText);
});

When('I click the {string} button', async function(buttonText) {
  await this.page.click(`button:has-text("${buttonText}")`);
  // Wait for potential page reload
  await this.page.waitForLoadState('networkidle');
});

Then('I should see {string} in the todo list', async function(todoText) {
  await expect(this.page.locator('.todo-text', { hasText: todoText })).toBeVisible();
});

Then('the active count should be {int}', async function(count) {
  const statsText = await this.page.locator('.todo-stats span').first().textContent();
  expect(statsText).toContain(`${count} active`);
});

Then('the completed count should be {int}', async function(count) {
  const statsText = await this.page.locator('.todo-stats span').last().textContent();
  expect(statsText).toContain(`${count} completed`);
});

// Mark todo as complete
Given('I have added a todo {string}', async function(todoText) {
  await this.page.fill('input[placeholder="What needs to be done?"]', todoText);
  await this.page.click('button:has-text("Add Todo")');
  await this.page.waitForLoadState('networkidle');
});

When('I toggle the todo checkbox for {string}', async function(todoText) {
  const todoItem = this.page.locator('.todo-item', { has: this.page.locator('.todo-text', { hasText: todoText }) });
  await todoItem.locator('input[type="checkbox"]').click();
  await this.page.waitForLoadState('networkidle');
});

Then('the todo {string} should be marked as completed', async function(todoText) {
  const todoItem = this.page.locator('.todo-item', { has: this.page.locator('.todo-text', { hasText: todoText }) });
  await expect(todoItem).toHaveClass(/completed/);
});

// Edit a todo
When('I double-click on the todo {string}', async function(todoText) {
  const todoTextElement = this.page.locator('.todo-text', { hasText: todoText });
  await todoTextElement.dblclick();
});

When('I edit the todo to {string}', async function(newText) {
  const editInput = this.page.locator('input.todo-edit-input');
  await editInput.fill(newText);
});

When('I press Enter', async function() {
  await this.page.keyboard.press('Enter');
  await this.page.waitForLoadState('networkidle');
});

Then('I should not see {string} in the todo list', async function(todoText) {
  await expect(this.page.locator('.todo-text', { hasText: todoText })).not.toBeVisible();
});

// Delete a todo
When('I click the delete button for {string}', async function(todoText) {
  const todoItem = this.page.locator('.todo-item', { has: this.page.locator('.todo-text', { hasText: todoText }) });
  const deleteButton = todoItem.locator('button.todo-action-button.delete');
  await deleteButton.click();
});

When('I confirm the deletion', async function() {
  // Handle the browser's confirm dialog
  this.page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
  });
  await this.page.waitForLoadState('networkidle');
});

// Add multiple todos
When('I add the following todos:', async function(dataTable) {
  const todos = dataTable.rows();
  for (const row of todos) {
    const todoText = row[0];
    await this.page.fill('input[placeholder="What needs to be done?"]', todoText);
    await this.page.click('button:has-text("Add Todo")');
    await this.page.waitForLoadState('networkidle');
  }
});

Then('I should see {int} active todos', async function(count) {
  const statsText = await this.page.locator('.todo-stats span').first().textContent();
  expect(statsText).toContain(`${count} active`);
});
