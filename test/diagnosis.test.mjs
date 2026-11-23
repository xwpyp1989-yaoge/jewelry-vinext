import test from "node:test";
import assert from "node:assert/strict";
import { diagnose, presets } from "../app/diagnosis.mjs";

test("unknown material remains unverified", () => {
  const result = diagnose({ name: "试验戒指", category: "戒指", scene: "送礼", channel: "小红书" });
  assert.match(result.truth, /未知/);
  assert.match(result.styling, /包装/);
  assert.match(result.shots, /镶口/);
  assert.match(result.limitation, /不会识别/);
});

test("three examples produce distinct product and scene guidance", () => {
  const results = presets.map(diagnose);
  assert.equal(new Set(results.map(x => x.title)).size, 3);
  assert.match(results[1].message, /赠礼/);
  assert.match(results[2].shots, /双耳/);
});
