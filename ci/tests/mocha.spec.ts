import { expect, test } from "@playwright/test";

test("Mocha tests pass", async ({ page }) => {
	await page.goto("/");
	const results = await page.waitForFunction(() => {
		if (window._testResults) {
			return window._testResults;
		}
	});
	const json = await results.jsonValue();
	// Expect a title "to contain" a substring.
	await expect(json.failure).toBeFalsy();
});
