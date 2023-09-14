import { blake3 } from "hash-wasm";
export async function grass() {
	const grassHash = await blake3("Grass!");
	console.log("Grass!", grassHash);
	return grassHash;
}
