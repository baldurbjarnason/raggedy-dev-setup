import { grassy } from "../src/index.js";

const { assert } = chai;

describe("Array", function () {
	describe("#indexOf()", function () {
		it("should return -1 when the value is not present", async function () {
			await grassy();
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});
