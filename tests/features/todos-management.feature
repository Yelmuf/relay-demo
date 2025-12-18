Feature: TODOs Management
  As a user
  I want to manage my todos
  So that I can keep track of tasks

  Background:
    Given I am on the TODO app homepage

  Scenario: Add a new todo
    When I enter "Learn TypeScript" in the todo input
    And I click the "Add Todo" button
    Then I should see "Learn TypeScript" in the todo list

  Scenario: Mark a todo as complete
    Given I have added a todo "Complete assignment"
    When I toggle the todo checkbox for "Complete assignment"
    Then the todo "Complete assignment" should be marked as completed

  Scenario: Edit a todo
    Given I have added a todo "Initial task text"
    When I double-click on the todo "Initial task text"
    And I edit the todo to "Updated task text"
    And I press Enter
    Then I should see "Updated task text" in the todo list

  Scenario: Delete a todo
    Given I have added a todo "Task to be deleted"
    When I click the delete button for "Task to be deleted"
    And I confirm the deletion
    Then I should not see "Task to be deleted" in the todo list
