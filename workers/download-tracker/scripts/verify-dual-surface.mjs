/**
 * Offline EmbryoLock dual-surface check.
 * LIVE: health, skill, policy, doctor, verify.
 * Refuse: wipe/scorch never execute.
 * Mesh GET never enables.
 * Counted /download increments; /v1 does not.
 * Author: Aziel Eliab. Do not deploy from this check.
 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import worker from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const assetPath = join(here, "../public/embryolock-1.2.0.tar.gz");
assert.ok(existsSync(assetPath), "DEFAULT_ASSET public/embryolock-1.2.0.tar.gz must exist for ASSETS.fetch");
const gzipMagic = readFileSync(assetPath).subarray(0, 2);
assert.deepEqual(Array.from(gzipMagic), [0x1f, 0x8b], "DEFAULT_ASSET must be gzip");
{
  const sigilPath = join(here, "../public/sigil.png");
  assert.ok(existsSync(sigilPath), "official public/sigil.png must exist");
  const sigil = readFileSync(sigilPath);
  assert.deepEqual(sigil.subarray(0, 8), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  assert.ok(sigil.length > 70_000 && sigil.length < 80_000, "official ~75KB /sigil.png");
}
{
  const { execFileSync } = await import("node:child_process");
  const listing = execFileSync("tar", ["-tzf", assetPath], { encoding: "utf8" });
  assert.match(listing, /embryolock-1\.2\.0\/Open Source Code/);
  assert.match(listing, /embryolock-1\.2\.0\/install\.sh/);
  assert.doesNotMatch(listing, /embryolock-1\.2\.0\/workers\//);
  assert.doesNotMatch(listing, /\/\.git\//);
}
import {
  AUTHOR,
  DOMAIN,
  IDENTITY,
  REFUSE_CODE,
  REFUSED_OPS,
  VERSION,
  WORKER_LIVE_OPS,
  isRefusedOp,
  refuseDestructive,
} from "../src/engine.js";
import {
  DEFAULT_RUNTIME_ORIGIN,
  joinOriginUrl,
  meshPointer,
  QNS_CD,
  QNS_CD_SPEC,
} from "../src/mesh.js";

assert.equal(VERSION, "1.2.0");
assert.equal(AUTHOR, "Aziel Eliab");
assert.equal(IDENTITY, "Aziel Eliab only");
assert.equal(DOMAIN, "Vault/Custody");
assert.deepEqual(WORKER_LIVE_OPS.slice().sort(), ["doctor", "health", "policy", "skill", "verify"]);
assert.ok(REFUSED_OPS.includes("wipe"));
assert.ok(REFUSED_OPS.includes("scorch"));
assert.equal(isRefusedOp("wipe"), "wipe");
assert.equal(isRefusedOp("embryolock_scorch"), "scorch");
assert.equal(refuseDestructive("wipe").execute, false);
assert.equal(refuseDestructive("wipe").code, REFUSE_CODE);
assert.equal(meshPointer().enabled_default, false);
assert.equal(meshPointer().node_gate, false);
assert.equal(meshPointer().fraggate_slug, "mesh");
assert.equal(QNS_CD_SPEC, "QNS-CD-1.0");
assert.equal(QNS_CD.public_proxy, false);
assert.equal(joinOriginUrl(DEFAULT_RUNTIME_ORIGIN, "/v1/mesh"), `${DEFAULT_RUNTIME_ORIGIN}/v1/mesh`);
assert.match(meshPointer().note, /GET never enables/);

const store = new Map();
const seen = [];
const downloads = [];

function memoryKv() {
  return {
    async get(key) {
      return store.has(key) ? store.get(key) : null;
    },
    async put(key, value) {
      store.set(key, String(value));
    },
    async list() {
      return { keys: [...store.keys()].map((name) => ({ name })), list_complete: true };
    },
  };
}

function jsonRes(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const env = {
  DOWNLOADS: memoryKv(),
  ASSETS: {
    async fetch(request) {
      const url = new URL(request.url);
      downloads.push(url.pathname);
      if (url.pathname.endsWith(".tar.gz") || url.pathname.includes("embryolock")) {
        return new Response("gzip-bytes", {
          status: 200,
          headers: { "Content-Type": "application/gzip", "Content-Length": "10" },
        });
      }
      return new Response("missing", { status: 404 });
    },
  },
  AZIEL_RUNTIME: {
    async fetch(request) {
      const url = new URL(request.url);
      seen.push({ method: request.method, path: url.pathname });
      if ((url.pathname === "/v1/mesh" || url.pathname === "/v1/mesh/status") && request.method === "GET") {
        return jsonRes({
          ok: true,
          code: "MESH-OK",
          enabled: false,
          radios: "off",
          mesh_default: "off",
          spec: "QNM-BUILD-1.0",
          rollup: { live: 0, locked: 0, isolated: 0 },
          live_nodes: 0,
          author: "Aziel Eliab",
        });
      }
      if (url.pathname === "/v1/mesh/enable" && request.method === "POST") {
        const body = await request.json();
        if (!body.bearer) return jsonRes({ ok: false, code: "MESH-NEED-BEARER", enabled: false }, 400);
        return jsonRes({ ok: true, code: "MESH-OK", enabled: true, radios: "on", bearers: [body.bearer] });
      }
      if (url.pathname === "/v1/fraggate/list" && request.method === "GET") {
        return jsonRes({ ok: true, door: "fraggate", names: ["embryolock"] });
      }
      return jsonRes({ error: "not found" }, 404);
    },
  },
  AZIEL_RUNTIME_ORIGIN: DEFAULT_RUNTIME_ORIGIN,
};

async function call(path, init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("User-Agent")) headers.set("User-Agent", "Mozilla/5.0");
  const res = await worker.fetch(new Request("https://embryolock-download-tracker.vibelock.workers.dev" + path, { ...init, headers }), env);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { res, data, text };
}

const health = await call("/v1/health");
assert.equal(health.res.status, 200);
assert.equal(health.data.ok, true);
assert.equal(health.data.author, "Aziel Eliab");
assert.equal(health.data.slug, "embryolock");
assert.equal(health.data.domain, "Vault/Custody");
assert.equal(health.data.execute_destructive, false);
assert.equal(health.data.kv_increment, false);
assert.equal(health.data.mesh.enabled_default, false);

const skill = await call("/v1/skill");
assert.equal(skill.res.status, 200);
assert.match(skill.text, /EmbryoLock/);
assert.match(skill.text, /FragGate/);
assert.match(skill.text, /Aziel Eliab/);

const policy = await call("/v1/policy");
assert.equal(policy.res.status, 200);
assert.equal(policy.data.domain, "Vault/Custody");
assert.equal(policy.data.remote_wipe, false);
assert.equal(policy.data.get_never_enables, true);
assert.ok(policy.data.live.includes("policy"));

const doctor = await call("/v1/doctor");
assert.equal(doctor.res.status, 200);
assert.equal(doctor.data.ok, true);
assert.equal(doctor.data.writes, false);
assert.equal(doctor.data.worker_local, true);

const verifyGet = await call("/v1/verify");
assert.equal(verifyGet.res.status, 200);
assert.equal(verifyGet.data.verified, true);

const verifyPost = await call("/v1/verify", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
assert.equal(verifyPost.res.status, 200);
assert.equal(verifyPost.data.verified, true);

const verifyWipe = await call("/v1/verify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ wipe: true }) });
assert.equal(verifyWipe.data.verified, false);
assert.ok(verifyWipe.data.extra.length);

for (const op of ["wipe", "scorch", "unlock", "encrypt"]) {
  const refused = await call("/v1/" + op, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.equal(refused.res.status, 409, op);
  assert.equal(refused.data.ok, false, op);
  assert.equal(refused.data.execute, false, op);
  assert.equal(refused.data.code, REFUSE_CODE, op);
  assert.match(refused.data.message, /local-only/);
}

const mcp = await call("/mcp");
assert.equal(mcp.res.status, 200);
assert.equal(mcp.data.slug, "embryolock");
assert.equal(mcp.data.catalog_mcp, "https://aziel-runtime.vibelock.workers.dev/mcp");
assert.ok(mcp.data.tools.includes("embryolock_policy"));

const mcpList = await call("/mcp", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
});
assert.equal(mcpList.res.status, 200);
assert.ok(mcpList.data.result.tools.some((t) => t.name === "embryolock_health"));

const mcpWipe = await call("/mcp", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "embryolock_wipe", arguments: {} } }),
});
const wipePayload = JSON.parse(mcpWipe.data.result.content[0].text);
assert.equal(mcpWipe.data.result.isError, true);
assert.equal(wipePayload.execute, false);
assert.equal(wipePayload.code, REFUSE_CODE);

const openapi = await call("/openapi.json");
assert.equal(openapi.res.status, 200);
assert.equal(openapi.data.openapi, "3.1.0");
assert.ok(openapi.data.paths["/v1/policy"]);
assert.ok(openapi.data.paths["/mcp"]);

const home = await call("/");
assert.equal(home.res.status, 200);
assert.match(home.text, /src="\/sigil\.png"/);
assert.match(home.text, /<img class="brandmark" src="\/sigil\.png" width="40" height="40" alt="" decoding="async">/);
assert.doesNotMatch(home.text, /everbloom/i);
assert.doesNotMatch(home.text, /<p class="stamp">/);
assert.match(home.text, /Vault \/ Custody/);
assert.match(home.text, /Aziel Eliab/);
assert.match(home.text, /#c9a227/);

const ai = await call("/ai");
assert.equal(ai.res.status, 200);
assert.match(ai.text, /src="\/sigil\.png"/);
assert.match(ai.text, /alt=""/);
assert.doesNotMatch(ai.text, /everbloom/i);
assert.doesNotMatch(ai.text, /<p class="stamp">/);
assert.match(ai.text, /Aziel Eliab/);

const countBefore = await call("/count");
assert.equal(countBefore.data.views, 1);
assert.equal(countBefore.data.downloads, 0);

const healthAgain = await call("/v1/health");
assert.equal(healthAgain.res.status, 200);
const countMid = await call("/count");
assert.equal(countMid.data.views, 1, "/v1 must not increment views");
assert.equal(countMid.data.downloads, 0, "/v1 must not increment downloads");

const dl = await call("/download?asset=embryolock-1.2.0.tar.gz");
assert.equal(dl.res.status, 200);
assert.equal(dl.res.headers.get("content-type"), "application/gzip");
const countAfter = await call("/count");
assert.equal(countAfter.data.downloads, 1);

const mesh = await call("/v1/mesh");
assert.equal(mesh.res.status, 200);
assert.equal(mesh.data.enabled, false);
assert.ok(seen.some((s) => s.method === "GET" && (s.path === "/v1/mesh" || s.path === "/v1/mesh/status")));
assert.ok(!seen.some((s) => s.path === "/v1/mesh/enable"), "GET /v1/mesh must not call enable");

const meshEnable = await call("/v1/mesh/enable", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
assert.ok(meshEnable.data.enabled !== true);
assert.equal(meshEnable.data.code, "MESH-NEED-BEARER");

const cite = await call("/cite.json");
assert.equal(cite.data.author, "Aziel Eliab");
assert.equal(cite.data.identity, "Aziel Eliab only");

const install = await call("/install.sh");
assert.equal(install.res.status, 200);
assert.match(install.text, /Mozilla\/5.0/);
assert.match(install.text, /local/);
assert.match(install.text, /\$\{HOST\}\/download\?asset=\$\{ASSET\}/);
assert.match(install.text, /embryolock-1\.2\.0\.tar\.gz/);

const door = await call("/v1/fraggate/list");
assert.equal(door.res.status, 200);
assert.equal(door.data.door, "fraggate");

console.log("embryolock dual-surface verify: PASS");
