import { Given, Then } from 'quickpickle';
import { expect } from '@playwright/test';

Given('I navigate to {string}', async function(world, url) {
  await world.page.goto(url);
  await world.page.waitForLoadState('networkidle');
});

Then('I should see the page title', async function(world) {
  const title = await world.page.locator('h1').textContent();
  expect(title).toBeTruthy();
});
