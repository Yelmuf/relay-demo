Feature: Concurrent Queries

  Scenario: Opening directly to a todo detail page breaks the list
    Given I am on the detail page for todo 1
    And I wait 5 seconds
    Then I should see a todo detail
    And I should see "Learn React 19" in the todo list
    And I should not see "Oops - error thrown through router" text
