import { setWorldConstructor } from 'quickpickle';
import { PlaywrightWorld } from '@quickpickle/playwright';

// Set up Playwright world for browser testing
setWorldConstructor(PlaywrightWorld);
