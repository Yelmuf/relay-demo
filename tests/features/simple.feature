Feature: Simple Test
  Basic test to verify the quickpickle setup

  Scenario: Homepage loads
    Given I navigate to "http://localhost:3000"
    Then I should see the page title
