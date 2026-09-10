/**
 * EmbryoLock Worker runtime — dual surface.
 * Human: /v1 live ops + homepage. Agent: GET/POST /mcp pointer + FragGate slug embryolock.
 * Author: Aziel Eliab only.
 */

import { classifyV1Path, doorTargetUrl, isDoorPath } from "./door.js";
import {
  AUTHOR,
  DOMAIN,
  doctor,
  example,
  FRAGGATE_POINTER_OPS,
  health,
  HONEST,
  isRefusedOp,
  LIMITATION,
  MOTTO,
  NAME,
  policy,
  PRODUCT,
  refuseDestructive,
  REFUSED_OPS,
  ROLE,
  SLUG,
  SPEC,
  VERSION,
  verify,
  WORKER_LIVE_OPS,
} from "./engine.js";
import {
  attachQnsCd,
  isMeshPath,
  meshOpenApiPaths,
  meshPointer,
  runMeshProxy,
} from "./mesh.js";

const HOST = "https://embryolock-download-tracker.vibelock.workers.dev";
const CATALOG = "https://aziel-runtime.vibelock.workers.dev";
const FRAGGATE_CALL = CATALOG + "/v1/fraggate/call";
const CATALOG_MCP = CATALOG + "/mcp";
const MCP_OPS = WORKER_LIVE_OPS.slice();
const MCP_TOOLS = MCP_OPS.map((op) => "embryolock_" + op);

export const SKILL = `---
name: EmbryoLock
description: Use when opening EmbryoLock hosted /v1 or installing the local vault. Dual surface: Worker /v1 + GET/POST /mcp, or aziel-runtime FragGate slug embryolock. This Worker is human UI + counted download. Destructive vault ops (wipe/scorch/unlock/encrypt) are local-only and refuse on the public Worker. This Worker /v1/fraggate/* and /v1/mesh/* PROXY to aziel-runtime via AZIEL_RUNTIME. Suite mesh default OFF. GET never enables. QNM-BUILD-1.0 live|locked|isolated. QNS-CD-1.0 photon QNS1 hub cite (local qnsd in qnm-node). Vault/Custody domain. Author Aziel Eliab.
---

# EmbryoLock

Local destructive-by-design file vault. Failed authentication can permanently destroy the only copy. Author: **Aziel Eliab**.

**THIS IS:** a local vault in Vault/Custody. Loss is preferable to later compromise.

**THIS IS NOT:** a hosted vault, a recovery tool, a remote kill switch, or a replacement for audited encryption. Hosted /v1 never stores phrases or vaults and never executes wipe/scorch.

Always send \`User-Agent: Mozilla/5.0\`. Cloudflare Workers may 403 an empty agent.

## Endpoints (this Worker)

Host: \`${HOST}\`

| Method | Path | What |
|--------|------|------|
| GET | \`/v1/health\` | Liveness. Does not increment downloads. |
| GET | \`/v1/skill\` | This markdown. Does not increment downloads. |
| GET | \`/v1/policy\` | Public policy. Vault/Custody framing. Destructive ops local-only. |
| GET | \`/v1/doctor\` | Worker-local self-check (no writes, no vault). |
| GET\\|POST | \`/v1/verify\` | Same self-check. Refuses a destructive execute request. |
| GET | \`/v1/example\` | Sample calls. Does not increment downloads. |
| GET | \`/v1/fraggate/list\` | PROXY to aziel-runtime GET /v1/fraggate/list via AZIEL_RUNTIME. |
| GET | \`/v1/fraggate/describe\` | PROXY to aziel-runtime GET /v1/fraggate/describe. |
| POST | \`/v1/fraggate/call\` | PROXY to aziel-runtime POST /v1/fraggate/call. |
| GET | \`/v1/mesh\` | PROXY suite mesh status. Default OFF. GET never enables. |
| GET | \`/v1/mesh/nodes\` | PROXY Live Nodes roster (5-minute presence). |
| POST | \`/v1/mesh/{enable,disable,join,heartbeat,leave,broadcast}\` | PROXY. Bearer required to enable. |
| GET | \`/mcp\` | Dual-surface MCP docs + FragGate pointer. |
| POST | \`/mcp\` | JSON-RPC MCP-over-HTTP. Thin doubles of health/skill/policy/doctor/verify. |

OpenAPI: \`${HOST}/openapi.json\`

Catalog OpenAPI: \`${CATALOG}/openapi.json\`

This Worker MCP: \`POST ${HOST}/mcp\`

Catalog MCP: \`POST ${CATALOG_MCP}\` (FragGate slug \`embryolock\`)

FragGate kernel: https://github.com/AzielEliab/fraggate

## How to call (Mozilla/5.0)

\`\`\`bash
curl -s -A 'Mozilla/5.0' ${HOST}/v1/health
curl -s -A 'Mozilla/5.0' ${HOST}/v1/policy
curl -s -A 'Mozilla/5.0' -X POST ${HOST}/v1/verify -H 'content-type: application/json' -d '{}'
curl -s -A 'Mozilla/5.0' ${HOST}/v1/skill
curl -s -A 'Mozilla/5.0' ${HOST}/v1/mesh
\`\`\`

Worker LIVE: health, skill, policy, doctor, verify.
Refused on this Worker: wipe, scorch, unlock, encrypt, decrypt, burn, destroy.
Agents: \`fraggate_list\` → \`fraggate_describe\` slug=embryolock → \`fraggate_call\`. Catalog may still list stub until aziel-runtime is updated. This Worker remains the human UI + counted download.

Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants.

## Local (after one-click install)

\`\`\`bash
curl -fsSL ${HOST}/install.sh | bash
\`\`\`

Then run the local Python vault on this computer only. Wipe/scorch stay on that machine.

## Honest banner

${HONEST}

Cite the GitHub repository and this Worker. No Zenodo DOI is invented here.

## Catalog + local UI

- Product homepage (workspace + counted download): ${HOST}/
- Catalog product (when listed): ${CATALOG}/p/embryolock/
- Catalog OpenAPI: ${CATALOG}/openapi.json
- Catalog MCP: \`POST ${CATALOG_MCP}\`
- This Worker MCP (dual surface): \`POST ${HOST}/mcp\`
- This Worker skill: \`GET ${HOST}/v1/skill\`
- This Worker OpenAPI: ${HOST}/openapi.json

Counted download (gzip HTTP 200, no 302): ${HOST}/download?asset=embryolock-1.2.0.tar.gz
GitHub: https://github.com/AzielEliab/EmbryoLock
`;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, mcp-session-id, User-Agent, Authorization, X-Aziel-Runtime-Token",
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
  });
}

function originOf(request) {
  try {
    return new URL(request.url).origin;
  } catch {
    return HOST;
  }
}

function openapiSpec(request) {
  const origin = originOf(request);
  return {
    openapi: "3.1.0",
    info: {
      title: "EmbryoLock runtime",
      version: VERSION,
      summary: "Local destructive vault. Hosted API never wipes. Vault/Custody.",
      description: LIMITATION + " Suite mesh /v1/mesh/* PROXY to aziel-runtime (AZIEL_RUNTIME). Default OFF. GET never enables. QNM-BUILD-1.0 live|locked|isolated. No Node Gate. No auto-heal. Not anonymity. Aziel Eliab only.",
    },
    servers: [{ url: origin }],
    paths: {
      "/v1/health": { get: { operationId: "embryolock_health", summary: "Liveness. Does not increment download KV.", responses: { "200": { description: "ok" } } } },
      "/v1/skill": { get: { operationId: "embryolock_skill", summary: "Return skill markdown. Does not increment downloads.", responses: { "200": { description: "markdown" } } } },
      "/v1/policy": { get: { operationId: "embryolock_policy", summary: "Public policy. Destructive ops local-only. Vault/Custody framing.", responses: { "200": { description: "policy" } } } },
      "/v1/doctor": { get: { operationId: "embryolock_doctor", summary: "Worker-local self-check. No writes. No vault.", responses: { "200": { description: "doctor" } } } },
      "/v1/verify": {
        get: { operationId: "embryolock_verify_get", summary: "Worker-local verify (alias of doctor).", responses: { "200": { description: "verify" } } },
        post: { operationId: "embryolock_verify", summary: "Worker-local verify. Refuses destructive execute.", requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "verify" } } },
      },
      "/v1/example": { get: { operationId: "embryolock_example", summary: "Sample calls. Does not increment downloads.", responses: { "200": { description: "example" } } } },
      "/v1/fraggate/list": { get: { operationId: "embryolock_fraggate_list_proxy", summary: "PROXY to aziel-runtime GET /v1/fraggate/list via AZIEL_RUNTIME. Not a local op.", responses: { "200": { description: "hashed registry" } } } },
      "/v1/fraggate/describe": { get: { operationId: "embryolock_fraggate_describe_proxy", summary: "PROXY to aziel-runtime GET /v1/fraggate/describe.", responses: { "200": { description: "describe" } } } },
      "/v1/fraggate/call": { post: { operationId: "embryolock_fraggate_call_proxy", summary: "PROXY to aziel-runtime POST /v1/fraggate/call.", requestBody: { content: { "application/json": { schema: { type: "object" } } } }, responses: { "200": { description: "FragGate ResultEnvelope" } } } },
      ...meshOpenApiPaths(),
      "/mcp": {
        get: { operationId: "embryolock_mcp_docs", summary: "Dual-surface MCP docs + FragGate pointer (slug embryolock).", responses: { "200": { description: "docs" } } },
        post: { operationId: "embryolock_mcp", summary: "JSON-RPC MCP-over-HTTP. Thin doubles of health/skill/policy/doctor/verify.", responses: { "200": { description: "rpc" } } },
      },
    },
  };
}

function aiHtml() {
  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>EmbryoLock — Aziel Eliab · AI runtime</title>
<style>
  :root { color-scheme: dark; }
  body { font: 16px/1.45 system-ui, sans-serif; max-width: 42rem; margin: 3rem auto; padding: 0 1.25rem 3rem; background: #0b0b0b; color: #e8e0d0; }
  code { background: #151922; padding: .15rem .4rem; border-radius: 4px; }
  a { color: #e6d19a; }
  .motto { color: #c9a227; font-style: italic; }
  .brandrow{display:flex;align-items:center;gap:12px;margin:0 0 10px}
  .brandmark{width:40px;height:40px;border-radius:10px;object-fit:cover;flex:0 0 auto;box-shadow:0 0 0 1px #d4af3733}
  .stamp{margin:0;color:#c9a227;font-size:.88rem}
  .banner { border: 1px solid #5c4a1a; background: #241c0d; color: #f0d78c; padding: .85rem 1rem; border-radius: 8px; }
</style>
<body>
  <div class="brandrow">
    <img class="brandmark" src="/sigil.png" width="40" height="40" alt="Everblooming sigil — Aziel Eliab" decoding="async">
    <p class="stamp">Everblooming sigil · Aziel Eliab</p>
  </div>
  <h1>EmbryoLock live API</h1>
  <p class="motto">${MOTTO}</p>
  <p class="banner">${LIMITATION}</p>
  <h2>Use with AI assistants</h2>
  <p>Works with ChatGPT (GPT Actions / OpenAI), Grok (xAI), Venice, Claude (Anthropic), Cursor (MCP), Glama (MCP), Perplexity, Microsoft Copilot / Bing, Google Gemini / Vertex, Mistral, Meta AI, Apple Intelligence surfaces, Amazon Q tooling, DuckAssist, You.com, Cohere, and other MCP/OpenAPI-capable assistants. Author ${AUTHOR} only.</p>
  <h2>OpenAPI import</h2>
  <p>Paste this OpenAPI URL into GPT Actions, custom HTTP tools, or any other OpenAPI-capable assistant:</p>
  <p><code>${HOST}/openapi.json</code></p>
  <h2>MCP / FragGate</h2>
  <p>This Worker doubles the human buttons: <code>POST ${HOST}/mcp</code>. Canonical catalog MCP remains <code>${CATALOG_MCP}</code> (FragGate slug <code>embryolock</code>; catalog <code>mesh_*</code> + FragGate <code>slug=mesh</code>).</p>
  <p>Suite mesh: <code>GET ${HOST}/v1/mesh</code> PROXY to aziel-runtime. Default OFF. GET never enables. Domain: ${DOMAIN}.</p>
  <p><a href="/openapi.json">openapi.json</a> · <a href="/mcp">/mcp</a> · <a href="/v1/health">health</a> · <a href="/v1/policy">policy</a> · <a href="/v1/mesh">/v1/mesh</a> · <a href="/">EmbryoLock software</a></p>
</body>
</html>`;
}

function mcpDocs() {
  return {
    ok: true,
    product: PRODUCT,
    name: NAME,
    version: VERSION,
    spec: SPEC,
    door: "fraggate",
    slug: SLUG,
    identity: "Aziel Eliab only",
    author: AUTHOR,
    domain: DOMAIN,
    transport: "JSON-RPC MCP-over-HTTP",
    endpoint: "POST /mcp",
    methods: ["initialize", "tools/list", "tools/call", "ping"],
    auth: "none (public)",
    this_worker_mcp: HOST + "/mcp",
    catalog_mcp: CATALOG_MCP,
    catalog_openapi: CATALOG + "/openapi.json",
    worker_openapi: HOST + "/openapi.json",
    agent_path: FRAGGATE_CALL,
    this_worker_fraggate: HOST + "/v1/fraggate/call",
    body: { slug: SLUG, op: "health", payload: {} },
    mesh: meshPointer(),
    mesh_body: { slug: "mesh", op: "status", payload: {} },
    ops: MCP_OPS,
    live_ops: WORKER_LIVE_OPS.slice(),
    pointer_ops: FRAGGATE_POINTER_OPS.slice(),
    refused: REFUSED_OPS.slice(),
    tools: MCP_TOOLS,
    note: "POST JSON-RPC here to double the human buttons (health/skill/policy/doctor/verify). Wipe/scorch refuse. Canonical agent path is the catalog MCP on aziel-runtime (FragGate slug embryolock). This Worker is human UI + counted download. Suite mesh default OFF. GET never enables.",
    kv_increment: false,
    kernel: "https://github.com/AzielEliab/fraggate",
  };
}

function mcpInitialize() {
  return {
    protocolVersion: "2025-03-26",
    capabilities: { tools: { listChanged: false } },
    serverInfo: { name: "embryolock", version: VERSION },
    instructions:
      "EmbryoLock EL-WP-1.2 — local destructive vault. Dual surface: human Worker UI and this MCP share health/skill/policy/doctor/verify. Wipe/scorch/unlock/encrypt refuse on the public Worker. Canonical catalog agent path is POST " +
      CATALOG_MCP +
      " or FragGate POST " +
      FRAGGATE_CALL +
      " {slug:embryolock,op,payload}. Suite mesh default OFF. GET never enables. Author Aziel Eliab only.",
  };
}

function mcpToolSchemas() {
  return [
    { name: "embryolock_health", description: "Liveness. Same as GET /v1/health. Does not increment downloads.", inputSchema: { type: "object", properties: {} } },
    { name: "embryolock_skill", description: "Return EmbryoLock skill markdown. Same as GET /v1/skill.", inputSchema: { type: "object", properties: {} } },
    { name: "embryolock_policy", description: "Public policy. Destructive ops local-only. Same as GET /v1/policy.", inputSchema: { type: "object", properties: {} } },
    { name: "embryolock_doctor", description: "Worker-local self-check. No writes. Same as GET /v1/doctor.", inputSchema: { type: "object", properties: {} } },
    { name: "embryolock_verify", description: "Worker-local verify. Refuses destructive execute. Same as POST /v1/verify.", inputSchema: { type: "object", properties: { execute: { type: "boolean" } } } },
  ];
}

function resolveMcpOp(name) {
  if (typeof name !== "string" || !name) return null;
  const raw = name.trim();
  const stripped = raw.startsWith("embryolock_") ? raw.slice("embryolock_".length) : raw;
  if (MCP_OPS.includes(stripped)) return stripped;
  return null;
}

function runLocalOp(op, body, mesh) {
  if (op === "health") return health(mesh || meshPointer());
  if (op === "skill") return { skill: SKILL };
  if (op === "policy") return policy();
  if (op === "doctor") return doctor();
  if (op === "verify") return verify(body);
  if (op === "example") return example();
  return null;
}

async function callMcpTool(name, args) {
  const refused = isRefusedOp(name);
  if (refused) {
    return {
      isError: true,
      content: [{ type: "text", text: JSON.stringify(refuseDestructive(refused), null, 2) }],
    };
  }
  const op = resolveMcpOp(name);
  if (!op) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: JSON.stringify({
          ok: false,
          error: "Unknown MCP tool. Use embryolock_health, embryolock_skill, embryolock_policy, embryolock_doctor, embryolock_verify. Canonical catalog MCP: " + CATALOG_MCP + " slug=embryolock.",
          door: "fraggate",
          slug: SLUG,
          agent_path: FRAGGATE_CALL,
        }, null, 2),
      }],
    };
  }
  if (op === "skill") return { content: [{ type: "text", text: SKILL }] };
  const data = runLocalOp(op, args, meshPointer());
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

async function handleMcpJson(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
  }
  const id = body && Object.prototype.hasOwnProperty.call(body, "id") ? body.id : null;
  const method = body && body.method;
  const params = (body && body.params) || {};
  if (method === "initialize") return json({ jsonrpc: "2.0", id, result: mcpInitialize() });
  if (method === "notifications/initialized" || method === "initialized") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (method === "ping") return json({ jsonrpc: "2.0", id, result: {} });
  if (method === "tools/list") return json({ jsonrpc: "2.0", id, result: { tools: mcpToolSchemas() } });
  if (method === "tools/call") {
    const name = params.name;
    const args = params.arguments && typeof params.arguments === "object" ? params.arguments : {};
    return json({ jsonrpc: "2.0", id, result: await callMcpTool(name, args) });
  }
  return json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found. Use initialize, tools/list, tools/call." },
  });
}

async function handleMcp(request) {
  if (request.method === "GET" || request.method === "HEAD") {
    if (request.method === "HEAD") return new Response(null, { status: 200, headers: corsHeaders() });
    return json(mcpDocs());
  }
  if (request.method === "POST") return handleMcpJson(request);
  return json({ error: "method not allowed", hint: "GET or POST /mcp" }, 405);
}

function runtimeFetcher(env) {
  if (env && env.AZIEL_RUNTIME && typeof env.AZIEL_RUNTIME.fetch === "function") return env.AZIEL_RUNTIME;
  return null;
}

function isMeshCitePath(pathname) {
  const path = String(pathname || "").replace(/\/+$/, "") || "/";
  return path === "/v1/mesh" || path === "/v1/mesh/status" || path === "/v1/mesh/nodes";
}

async function decorateMeshCite(request, pathname, res, headers) {
  if (request.method === "HEAD" || request.method !== "GET") return null;
  if (!isMeshCitePath(pathname)) return null;
  const ctype = String(headers.get("content-type") || "").toLowerCase();
  if (!ctype.includes("json")) return null;
  try {
    const body = await res.clone().json();
    headers.delete("content-length");
    headers.set("X-Aziel-Qns-Cd", "QNS-CD-1.0");
    return new Response(JSON.stringify(attachQnsCd(body), null, 2), {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  } catch {
    return null;
  }
}

async function proxyDoor(request, url, env) {
  const dest = doorTargetUrl(url.pathname, request.url, env);
  if (!dest) {
    return json({ ok: false, error: "not a door path", path: url.pathname, door: "fraggate" }, 404);
  }
  const headers = new Headers();
  const pass = ["content-type", "accept", "authorization", "user-agent", "mcp-protocol-version", "mcp-session-id", "x-aziel-runtime-token"];
  for (const name of pass) {
    const v = request.headers.get(name);
    if (v) headers.set(name, v);
  }
  if (!headers.has("User-Agent")) headers.set("User-Agent", "Mozilla/5.0 EmbryoLock/1.2.0");
  const init = { method: request.method, headers, redirect: "follow" };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    init.duplex = "half";
  }
  try {
    const fetcher = runtimeFetcher(env);
    const outbound = new Request(dest, init);
    const res = fetcher ? await fetcher.fetch(outbound) : await fetch(outbound);
    const outHeaders = new Headers(res.headers);
    for (const [k, v] of Object.entries(corsHeaders())) outHeaders.set(k, v);
    outHeaders.set("X-Aziel-Door", "proxy");
    outHeaders.set("X-Aziel-Door-Origin", dest);
    const decorated = await decorateMeshCite(request, url.pathname, res, outHeaders);
    if (decorated) return decorated;
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
  } catch (exc) {
    return json({
      ok: false,
      error: "fraggate_proxy_failed",
      detail: String(exc).slice(0, 240),
      origin: dest,
      agent_path: FRAGGATE_CALL,
      door: "fraggate",
      slug: SLUG,
    }, 502);
  }
}

export async function handleRuntimeApi(request, url, env) {
  const stripped = url.pathname.replace(/\/+$/, "") || "/";
  if (stripped === "/mcp") return handleMcp(request);

  const path = stripped;
  if (isMeshPath(path) || path === "/v1/mesh") {
    const out = await runMeshProxy(env, request, path + (url.search || ""));
    if (request.method === "HEAD") {
      return new Response(null, { status: out.status, headers: corsHeaders() });
    }
    return json(out.data, out.status);
  }

  const classified = classifyV1Path(url.pathname);
  if (classified.kind === "door" && isDoorPath(url.pathname)) {
    return proxyDoor(request, url, env);
  }

  const isApi = path === "/v1" || path.startsWith("/v1/") || path === "/openapi.json" || path === "/ai";
  if (!isApi) return null;

  if (classified.kind === "multi") {
    return json({
      ok: false,
      error: "not a local op",
      code: "NOT_LOCAL_OP",
      path: classified.path,
      hint: "Local ops are GET|POST /v1/{op} only (single segment). FragGate door is /v1/fraggate/* (proxied). Suite mesh is /v1/mesh/* (proxied; default OFF; GET never enables).",
      agent_path: FRAGGATE_CALL,
      live_ops: WORKER_LIVE_OPS.slice(),
    }, 404);
  }

  const op = classified.kind === "local" ? classified.op : null;
  if (op && isRefusedOp(op)) {
    return json(refuseDestructive(op), 409);
  }

  if (path === "/v1/health" && request.method === "GET") return json(health(meshPointer()));
  if (path === "/v1/skill" && request.method === "GET") {
    return new Response(SKILL, {
      status: 200,
      headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "private, no-store", ...corsHeaders() },
    });
  }
  if (path === "/v1/policy" && request.method === "GET") return json(policy());
  if (path === "/v1/doctor" && request.method === "GET") return json(doctor());
  if (path === "/v1/example" && request.method === "GET") return json(example());
  if (path === "/v1/verify" && (request.method === "GET" || request.method === "POST")) {
    let body = {};
    if (request.method === "POST") {
      try { body = await request.json(); } catch { body = {}; }
    }
    return json(verify(body));
  }
  if (path === "/openapi.json" && request.method === "GET") return json(openapiSpec(request));
  if (path === "/ai" && request.method === "GET") {
    return new Response(aiHtml(), { headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders() } });
  }
  if (path === "/v1" || path.startsWith("/v1/")) {
    return json({
      error: "not found",
      hint: "GET /v1/health /v1/skill /v1/policy /v1/doctor /v1/verify POST /v1/verify GET /v1/fraggate/list GET /v1/mesh",
      live_ops: WORKER_LIVE_OPS.slice(),
      refused: REFUSED_OPS.slice(),
      role: ROLE,
      motto: MOTTO,
    }, 404);
  }
  return null;
}
