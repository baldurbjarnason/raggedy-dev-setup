import { test as base } from "@playwright/test";
import * as fs from "node:fs/promises";
import * as url from "node:url";
export { expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

// This new "test" can be used in multiple test files, and each of them will get the fixtures.
// You need to use the import map to properly load modules and this means that you need to either use HTTP dependencies or rebase the vendored import map (like tasks/serve does)
export const test = base.extend({
	pageWithCoverage: async ({ page, browserName }, use) => {
		if (browserName === "chromium") {
			await page.coverage.startJSCoverage();
		}
		await use(page);

		if (browserName === "chromium") {
			const coverage = await page.coverage.stopJSCoverage();
			await fs.mkdir("coverage", { recursive: true });
			let result = [];
			await fs.mkdir("coverage/tmp", { recursive: true });
			for (let index = 0; index < coverage.length; index++) {
				const cov = coverage[index];
				const curl = new URL(cov.url);
				if (
					curl.hostname === "localhost" && curl.pathname !== "/" &&
					!curl.pathname.startsWith("/vendor/") &&
					!curl.pathname.startsWith("/.test/")
				) {
					const path = curl.pathname.replace("/", "");
					cov.url = url.pathToFileURL(path);
					result = result.concat(cov);
				}
			}
			const uuid = randomUUID();
			await fs.writeFile(
				`coverage/tmp/${uuid}.json`,
				JSON.stringify({ result }),
			);
		}
	},
});
