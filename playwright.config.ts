import { defineConfig } from '@playwright/test';

// Boots the Vite dev server itself; no external preview needed.
export default defineConfig({
    testDir: './e2e-tests',
    workers: 1,
    fullyParallel: false,
    reporter: [['json', { outputFile: 'test-results/results.json' }], ['list']],
    use: {
        baseURL: 'http://localhost:4300',
        channel: 'chrome',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'bunx vite --port 4300 --strictPort',
        url: 'http://localhost:4300',
        reuseExistingServer: true,
    },
});
