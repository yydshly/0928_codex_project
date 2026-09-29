// Local Windows build compatibility: use the same sherpa-onnx version via
// its supported shared-library feature; avoid a newer static MSVC ABI.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const upstream=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../upstream');
for(const relative of ['desktop/src-tauri/Cargo.toml','crates/buzz-voice/Cargo.toml']){
  const file=path.join(upstream,relative);
  const before=fs.readFileSync(file,'utf8');
  const old='sherpa-onnx = "1.12"';
  const next='sherpa-onnx = { version = "1.12", default-features = false, features = ["shared"] }';
  if(before.includes(next)) continue;
  if(!before.includes(old)) throw new Error(`Unsupported source: ${relative}`);
  fs.writeFileSync(file,before.replace(old,next));
}
console.log('Windows speech dependency switched to supported shared linking.');
