// src/grass.js
import { blake3 } from "https://esm.sh/hash-wasm@4.8.0";
async function grass() {
  const grassHash = await blake3("Grass!");
  console.log("Grass!", grassHash);
  return grassHash;
}

// src/index.js
function grassy() {
  console.log("dingus");
  return grass();
}
export {
  grassy
};
//# sourceMappingURL=raggedy.js.map
