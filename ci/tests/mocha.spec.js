import { expect, test } from "../pageWithCoverage.js";

test("Mocha Test Suite", async ({ pageWithCoverage: page }) => {
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
