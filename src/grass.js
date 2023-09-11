import { blake3 } from "https://esm.sh/hash-wasm@4.9.0";
export async function grass() {
	const grassHash = await blake3("Grass!");
	console.log("Grass!", grassHash);
	return grassHash;
}
