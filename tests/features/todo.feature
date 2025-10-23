Feature: TODO Management
  As a user
  I want to manage my todos
  So that I can keep track of tasks

  Background:
    Given I am on the TODO app homepage

  Scenario: View empty todo list
    Then I should see "No todos yet. Add one above!"

  Scenario: Add a new todo
    When I enter "Buy groceries" in the todo input
    And I click the "Add Todo" button
    Then I should see "Buy groceries" in the todo list
    And the active count should be 1

  Scenario: Mark a todo as complete
    Given I have added a todo "Finish project"
    When I toggle the todo checkbox for "Finish project"
    Then the todo "Finish project" should be marked as completed
    And the completed count should be 1
    And the active count should be 0

  Scenario: Edit a todo
    Given I have added a todo "Write documentation"
    When I double-click on the todo "Write documentation"
    And I edit the todo to "Write comprehensive documentation"
    And I press Enter
    Then I should see "Write comprehensive documentation" in the todo list
    And I should not see "Write documentation" in the todo list

  Scenario: Delete a todo
    Given I have added a todo "Delete me"
    When I click the delete button for "Delete me"
    And I confirm the deletion
    Then I should not see "Delete me" in the todo list

  Scenario: Add multiple todos
    When I add the following todos:
      | Task                |
      | Buy milk           |
      | Walk the dog       |
      | Read a book        |
    Then I should see 3 active todos
    And I should see "Buy milk" in the todo list
    And I should see "Walk the dog" in the todo list
    And I should see "Read a book" in the todo list
