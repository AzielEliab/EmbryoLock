/**
 * EmbryoLock product homepage — black/gold software UI, not a downloads shell.
 * Author: Aziel Eliab only. Destructive vault ops refuse on this Worker.
 */

import { AUTHOR, DOMAIN, HONEST, LIMITATION, NAME, SPEC, VERSION } from "./engine.js";

export const HOST = "https://embryolock-download-tracker.vibelock.workers.dev";
export const GITHUB_REPO = "https://github.com/AzielEliab/EmbryoLock";
export const GITHUB_LATEST = "https://github.com/AzielEliab/EmbryoLock/releases/latest";
export const CATALOG = "https://aziel-runtime.vibelock.workers.dev/";
export const CATALOG_PRODUCT = "https://aziel-runtime.vibelock.workers.dev/p/embryolock/";
export const ARK_HOST = "https://ark-download-tracker.vibelock.workers.dev";
export const TITLE = "EmbryoLock — Aziel Eliab";
export const DEFAULT_ASSET = "embryolock-1.2.0.tar.gz";
export const INSTALL_LINE = "curl -fsSL https://embryolock-download-tracker.vibelock.workers.dev/install.sh | bash";
export const DESCRIPTION =
  "EmbryoLock is Aziel Eliab software: a local destructive-by-design file vault in Vault/Custody. Hosted Worker is human UI + counted download. Wipe/scorch never execute on the public mesh.";
export const HOW_TO_CITE =
  "Eliab, Aziel. (2026). EmbryoLock 1.2.0 [Software]. https://github.com/AzielEliab/EmbryoLock · https://embryolock-download-tracker.vibelock.workers.dev/";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, mcp-session-id, User-Agent, Authorization, X-Aziel-Runtime-Token",
  };
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function citePayload() {
  return {
    author: AUTHOR,
    title: NAME,
    version: VERSION,
    spec: SPEC,
    homepage: HOST + "/",
    github: GITHUB_REPO,
    download: HOST + "/download",
    install: HOST + "/install.sh",
    openapi: HOST + "/openapi.json",
    skill: HOST + "/v1/skill",
    policy: HOST + "/v1/policy",
    mcp: HOST + "/mcp",
    catalog_mcp: CATALOG + "mcp",
    catalog: CATALOG,
    catalog_product: CATALOG_PRODUCT,
    domain: DOMAIN,
    sibling: ARK_HOST,
    license: "see repository LICENSE",
    one_line: DESCRIPTION,
    how_to_cite: HOW_TO_CITE,
    apa: "Eliab, A. (2026). EmbryoLock (Version 1.2.0) [Computer software]. https://embryolock-download-tracker.vibelock.workers.dev/",
    bibtex:
      "@software{eliab_embryolock_2026, author = {Eliab, Aziel}, title = {EmbryoLock}, version = {1.2.0}, year = {2026}, url = {https://embryolock-download-tracker.vibelock.workers.dev/}, publisher = {GitHub}, howpublished = {\\url{https://github.com/AzielEliab/EmbryoLock}}}",
    zenodo_status: "placeholder_no_doi_invented",
    software_deposit_needed: true,
    note: "No DOI is invented here. Cite GitHub and this Worker. Identity is Aziel Eliab only. Destructive vault ops stay local.",
    identity: "Aziel Eliab only",
    forks: "welcome",
  };
}

export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: NAME,
    alternateName: TITLE,
    applicationCategory: "SecurityApplication",
    operatingSystem: "Linux, macOS, Windows, Cloudflare Workers",
    softwareVersion: VERSION,
    author: { "@type": "Person", name: AUTHOR, url: "https://github.com/AzielEliab" },
    creator: { "@type": "Person", name: AUTHOR, url: "https://github.com/AzielEliab" },
    codeRepository: GITHUB_REPO,
    downloadUrl: HOST + "/download",
    installUrl: HOST + "/install.sh",
    url: HOST + "/",
    description: DESCRIPTION,
    keywords: "EmbryoLock, local vault, Vault/Custody, destructive vault, Aziel Eliab, EL-WP-1.2",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    sameAs: [GITHUB_REPO, CATALOG_PRODUCT],
  };
}

function sitemapXml() {
  const paths = ["/", "/download", "/install.sh", "/v1/skill", "/v1/health", "/v1/policy", "/v1/doctor", "/v1/verify", "/v1/fraggate/list", "/v1/mesh", "/openapi.json", "/mcp", "/cite.json", "/llms.txt", "/ai"];
  const urls = paths.map((p) => `  <url><loc>${HOST}${p === "/" ? "/" : p}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
  <url><loc>${GITHUB_REPO}</loc></url>
</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: ${HOST}/sitemap.xml
`;
}

function llmsTxt() {
  return `# EmbryoLock

Author: Aziel Eliab
One-line: ${DESCRIPTION}
GitHub: ${GITHUB_REPO}
Homepage: ${HOST}/
Download: ${HOST}/download
Install: ${HOST}/install.sh
OpenAPI: ${HOST}/openapi.json
Skill: ${HOST}/v1/skill
Policy: ${HOST}/v1/policy
Doctor / Verify: ${HOST}/v1/doctor · ${HOST}/v1/verify
MCP: ${HOST}/mcp
Catalog MCP: ${CATALOG}mcp (FragGate slug embryolock)
Cite: ${HOST}/cite.json
Domain: Vault/Custody (sibling The ARK)
Ops: GET /v1/health, GET /v1/skill, GET /v1/policy, GET /v1/doctor, GET|POST /v1/verify
Refused on this Worker: wipe, scorch, unlock, encrypt, decrypt, burn, destroy
FragGate proxy: GET /v1/fraggate/list, GET /v1/fraggate/describe, POST /v1/fraggate/call (via AZIEL_RUNTIME)
Suite mesh: GET ${HOST}/v1/mesh PROXY to aziel-runtime. Default OFF. GET never enables. QNM-BUILD-1.0 live|locked|isolated. Catalog MCP mesh_* + FragGate slug=mesh.
Identity: Aziel Eliab only
DOI: none invented; software deposit still needed.

Indexing, metadata scrape, and AI grounding of public pages are allowed.
`;
}

export function handleSeoRoutes(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const headers = { ...corsHeaders(), "Cache-Control": "private, no-store" };
  if (url.pathname === "/cite.json" || url.pathname === "/cite.json/") {
    return new Response(JSON.stringify(citePayload(), null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
    });
  }
  if (url.pathname === "/sitemap.xml" || url.pathname === "/sitemap.xml/") {
    return new Response(sitemapXml(), { status: 200, headers: { "Content-Type": "application/xml; charset=utf-8", ...headers } });
  }
  if (url.pathname === "/robots.txt" || url.pathname === "/robots.txt/") {
    return new Response(robotsTxt(), { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", ...headers } });
  }
  if (url.pathname === "/llms.txt" || url.pathname === "/ai.txt") {
    return new Response(llmsTxt(), { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", ...headers } });
  }
  return null;
}

function breakdownList(stats) {
  const rows = stats.breakdown || [];
  if (!rows.length) return "<li>none yet</li>";
  return rows
    .map((b) => `<li><code>${escapeHtml(b.owner)}/${escapeHtml(b.repo)}</code> branch <code>${escapeHtml(b.branch)}</code> fork=${escapeHtml(b.fork)} → ${escapeHtml(b.count)}</li>`)
    .join("");
}

export function renderHome(stats) {
  const views = Number(stats.views) || 0;
  const downloads = Number(stats.downloads != null ? stats.downloads : stats.total) || 0;
  const v = views.toLocaleString("en-US");
  const n = downloads.toLocaleString("en-US");
  const ld = JSON.stringify(jsonLd());
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<meta name="description" content="${escapeHtml(DESCRIPTION)}">
<meta name="author" content="${AUTHOR}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${HOST}/">
<link rel="sitemap" type="application/xml" href="${HOST}/sitemap.xml">
<link rel="icon" type="image/png" href="/sigil.png">
<meta property="og:type" content="website">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${escapeHtml(DESCRIPTION)}">
<meta property="og:url" content="${HOST}/">
<meta property="og:site_name" content="Aziel Eliab">
<meta property="og:image" content="${HOST}/sigil.png">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${escapeHtml(DESCRIPTION)}">
<meta name="twitter:image" content="${HOST}/sigil.png">
<script type="application/ld+json">${ld}</script>
<style>
  :root {
    color-scheme: dark;
    --bg: #0b0b0b; --panel: #141414; --ink: #e8e0d0; --muted: #9aa3b2;
    --line: #2a2414; --gold: #c9a227; --gold-dim: #c9a227; --pass: #3dba7a; --bad: #d4534b; --focus: #e6d19a;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); }
  body { font: 16px/1.5 system-ui, "Segoe UI", sans-serif; }
  a { color: #e6d19a; }
  code, pre, .mono { font-family: ui-monospace, Menlo, Consolas, monospace; }
  .wrap { max-width: 58rem; margin: 0 auto; padding: 1.4rem 1.2rem 4.5rem; }
  .brandrow { display: flex; align-items: center; gap: 12px; margin: 0 0 12px; }
  .brandmark { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; flex: 0 0 auto; box-shadow: 0 0 0 1px #d4af3733; }
  .stamp { margin: 0; color: var(--gold); font-size: .88rem; letter-spacing: .02em; }
  .appbar { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
  h1 { font-size: 2rem; letter-spacing: .02em; margin: 0 0 .2rem; }
  .motto { color: var(--gold); font-style: italic; margin: 0 0 .7rem; }
  .lede { color: var(--muted); margin: 0 0 1rem; max-width: 46rem; }
  .pill { font: 650 .78rem/1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--line); border-radius: 999px; padding: .4rem .7rem; color: var(--muted); background: #101010; }
  .pill.ok { color: var(--pass); border-color: #2f6b48; }
  .pill.bad { color: var(--bad); border-color: #7a2f2c; }
  nav.toc { display: flex; flex-wrap: wrap; gap: .55rem; margin: 0 0 1.1rem; }
  nav.toc a { text-decoration: none; color: var(--ink); border: 1px solid var(--line); background: var(--panel); border-radius: 999px; padding: .35rem .75rem; font-size: .88rem; }
  .banner { border: 1px solid #5c4a1a; background: #241c0d; color: #f0d78c; padding: .9rem 1rem; border-radius: 10px; margin: 0 0 1.15rem; font-size: .94rem; }
  .card, .workspace, .cite { border: 1px solid var(--line); border-radius: 14px; padding: 1.15rem 1.2rem 1.25rem; background: var(--panel); margin: 0 0 1.1rem; }
  .workspace { box-shadow: 0 0 0 1px #d4af3714, 0 16px 40px #0006; }
  h2 { font-size: 1.12rem; margin: 0 0 .45rem; letter-spacing: .04em; }
  .kicker { display: block; font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); margin-bottom: .15rem; font-family: ui-monospace, Menlo, Consolas, monospace; }
  .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin: .95rem 0 .2rem; }
  button, a.btn { font: 700 .88rem/1.1 ui-monospace, Menlo, Consolas, monospace; letter-spacing: .03em; padding: .72rem .9rem; border-radius: 9px; border: 1px solid transparent; cursor: pointer; text-decoration: none; display: inline-block; }
  button.gold, a.btn.gold { background: var(--gold-dim); color: #14110a; }
  button.ink, a.btn.ink { background: var(--ink); color: var(--bg); }
  button.ghost, a.btn.ghost { background: transparent; color: var(--ink); border-color: var(--line); }
  button.danger { background: transparent; color: var(--bad); border-color: #7a2f2c; }
  button.copied { background: var(--pass); color: #0e1014; }
  .status { margin: .8rem 0 0; padding: .75rem .85rem; border-radius: 10px; border: 1px solid var(--line); background: #101010; color: var(--muted); white-space: pre-wrap; }
  .status.ok { color: var(--pass); border-color: #2f6b48; }
  .status.bad { color: var(--bad); border-color: #7a2f2c; }
  .nums { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem; margin: 0 0 1rem; }
  .count { font-size: 2.1rem; font-variant-numeric: tabular-nums; font-weight: 700; margin: 0; }
  .count span { display: block; font-size: .92rem; font-weight: 500; color: var(--muted); }
  .btns { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin: 0 0 .85rem; }
  @media (max-width: 520px) { .btns { grid-template-columns: 1fr; } }
  a.btn.block, button.btn.block { display: block; width: 100%; text-align: center; font-size: 1.15rem; padding: 1rem 1.1rem; }
  a.btn.primary { background: #e8eaef; color: #0e1014; }
  button.btn.install { background: var(--gold-dim); color: #14110a; }
  pre { background: #0e0e0e; padding: .75rem .9rem; overflow: auto; border-radius: 8px; font-size: .82rem; }
  .meta { margin-top: 1rem; color: var(--muted); font-size: .92rem; }
  .iso { margin-top: .75rem; font-size: .85rem; color: #7d8696; }
  footer { color: var(--muted); font-size: .9rem; }
  #meshStrip { border: 1px solid var(--gold); border-radius: 14px; padding: .85rem 1rem; background: var(--panel); margin: 0 0 1.1rem; display: flex; flex-wrap: wrap; align-items: center; gap: .7rem 1rem; font-size: .88rem; color: var(--muted); }
  #meshStrip .live { color: var(--ink); }
  #meshStrip .live b { color: var(--gold); font-size: 1.35rem; margin-right: .35rem; }
  #meshStrip .rollup b { color: var(--gold); }
  #meshStrip button { font: 700 .78rem/1 ui-monospace, Menlo, Consolas, monospace; height: 2rem; padding: 0 .75rem; border-radius: 8px; background: #101010; color: var(--ink); border: 1px solid var(--gold); cursor: pointer; }
  #meshStrip button:hover { background: #241c0d; color: var(--gold); }
  #meshStrip input { width: 10rem; padding: .4rem .55rem; border: 1px solid var(--gold); border-radius: 8px; background: #0e0e0e; color: var(--ink); font: inherit; }
  #meshProducts { flex-basis: 100%; margin: 0; }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="brandrow">
        <img class="brandmark" src="/sigil.png" width="40" height="40" alt="" decoding="async">
      </div>
      <div class="appbar">
        <div>
          <h1>EmbryoLock</h1>
          <p class="motto">Local destructive vault. Public Worker never wipes.</p>
        </div>
        <p class="pill" id="api-pill">API · checking</p>
      </div>
      <p class="lede">v${VERSION} (${SPEC}) software by <strong>${AUTHOR}</strong> only. Vault/Custody domain — sibling to <a href="${ARK_HOST}/">The ARK</a>. Softwares listing (Plain→Gate→Lock) lives on hubs/runtime. FragGate is THE single door. Agents use slug <code>embryolock</code>.</p>
      <nav class="toc" aria-label="Product sections">
        <a href="#workspace">Use UI</a>
        <a href="#meshStrip">Live Nodes</a>
        <a href="#install">Download / install</a>
        <a href="#cite">Cite</a>
        <a href="/v1/skill">Skill</a>
        <a href="/v1/policy">Policy</a>
        <a href="/mcp">MCP</a>
        <a href="/openapi.json">OpenAPI</a>
        <a href="${GITHUB_REPO}">GitHub</a>
      </nav>
      <p class="banner">${escapeHtml(HONEST)}</p>
    </header>

    <div id="meshStrip" aria-label="Suite Live Nodes">
      <div class="live"><b id="meshLiveCount">0</b> Live Nodes</div>
      <div id="meshLine">Suite mesh: off (default). QNM-BUILD-1.0. QNS-CD-1.0. Not an anonymity network.</div>
      <div class="rollup">live <b id="qnmLive">0</b> · locked <b id="qnmLocked">0</b> · isolated <b id="qnmIsolated">0</b></div>
      <div>No Node Gate · GET never enables · No auto-heal · Aziel Eliab only</div>
      <div>
        <input id="meshBearer" type="text" maxlength="80" placeholder="bearer (required to enable)" aria-label="mesh bearer">
        <button id="meshEnable" type="button" title="Enable suite mesh. Declared bearer required. Default off.">Enable</button>
        <button id="meshDisable" type="button" title="Disable suite mesh (always allowed)">Disable</button>
        <button id="meshJoin" type="button" title="Join as embryolock. Refused while mesh is OFF.">Join</button>
        <button id="meshLeave" type="button" title="Leave this node. No auto-heal.">Leave</button>
      </div>
      <div id="meshProducts">Catalog MCP mesh_* · FragGate slug=mesh · /v1/mesh/* PROXY · QNS-CD-1.0 photon QNS1 (qnm-node local qnsd; hub cite only) · not AnonBroadcast · not a Node Gate · not a Softwares-tab product</div>
    </div>

    <section class="workspace" id="workspace">
      <h2><span class="kicker">Live software</span>Vault / Custody desk</h2>
      <p class="lede">Public LIVE: Health / Skill / Policy / Doctor / Verify. Wipe and Scorch are shown so you can see the refuse. They never execute here. Agents: catalog MCP FragGate slug <code>embryolock</code>.</p>
      <div class="actions">
        <button type="button" class="gold" id="btn-health">Health</button>
        <button type="button" class="ink" id="btn-skill">Skill</button>
        <button type="button" class="ghost" id="btn-policy">Policy</button>
        <button type="button" class="ghost" id="btn-doctor">Doctor</button>
        <button type="button" class="ghost" id="btn-verify">Verify</button>
        <button type="button" class="danger" id="btn-wipe" title="Local-only. Refused on this Worker.">Wipe (refuse)</button>
        <button type="button" class="danger" id="btn-scorch" title="Local-only. Refused on this Worker.">Scorch (refuse)</button>
      </div>
      <pre class="status" id="ws-status" role="status">Ready. Live ops do not increment downloads.</pre>
    </section>

    <section class="card" id="install">
      <h2><span class="kicker">Counted download</span>Install the local vault</h2>
      <div class="nums">
        <p class="count">${v}<span>Views</span></p>
        <p class="count">${n}<span>Downloads</span></p>
      </div>
      <p class="lede">Download saves the gzip (the Downloads number goes up). One-click install copies a Terminal command. After it finishes, run the local Python vault on this computer only. The Worker does not unlock anything.</p>
      <div class="btns">
        <a class="btn primary block" href="/download?asset=${DEFAULT_ASSET}">Download</a>
        <button type="button" class="btn install block" id="install-btn">One-click install</button>
      </div>
      <pre id="install-cmd">${INSTALL_LINE}</pre>
      <p class="meta">The download count ticks on the Download click. The Worker serves the gzip (HTTP 200). No 302 to GitHub. ${DEFAULT_ASSET} — ${n} counted.</p>
      <p class="iso">Isolated counter: Worker <code>embryolock-download-tracker</code>, project <code>embryolock</code>, KV <code>EMBRYOLOCK_DOWNLOADS</code>. /v1, /mcp, and /v1/mesh/* do not increment downloads.</p>
      <p class="meta"><a href="/stats">JSON stats</a> · <a href="/count">/count</a> · <a href="/openapi.json">OpenAPI</a> · <a href="/mcp">MCP</a> · <a href="/v1/mesh">/v1/mesh</a> · <a href="/v1/skill">Skill</a> · <a href="/ai">AI runtime</a> · <a href="${GITHUB_REPO}">GitHub</a> · <a href="${GITHUB_LATEST}">releases</a></p>
      <h2>Per repo / branch / fork</h2>
      <ul>${breakdownList(stats)}</ul>
    </section>

    <section class="cite" id="cite">
      <h2>How to cite</h2>
      <p>${escapeHtml(HOW_TO_CITE)}</p>
      <p><a href="${CATALOG}">Catalog</a> · <a href="${GITHUB_REPO}">GitHub</a> · <a href="${HOST}/download">Download</a> · <a href="${HOST}/cite.json">cite.json</a></p>
    </section>
    <footer>
      <p>Identity: Aziel Eliab only. FragGate is THE single door. Mesh default off. ${escapeHtml(LIMITATION)}</p>
    </footer>
  </div>
  <script>
    (function () {
      function $(id) { return document.getElementById(id); }
      function paintStatus(ok, text) {
        var el = $("ws-status");
        if (!el) return;
        el.textContent = text;
        el.className = "status " + (ok ? "ok" : "bad");
      }
      async function api(path, opts) {
        var r = await fetch(path, Object.assign({ headers: { "user-agent": "Mozilla/5.0", accept: "application/json" } }, opts || {}));
        var text = await r.text();
        var data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }
        return { ok: r.ok && data && data.ok !== false && data.refuse !== true, status: r.status, data: data, text: text };
      }
      $("btn-health").onclick = async function () {
        var out = await api("/v1/health");
        $("api-pill").textContent = out.ok ? "API · live" : "API · refuse";
        $("api-pill").className = "pill " + (out.ok ? "ok" : "bad");
        paintStatus(out.ok, JSON.stringify(out.data, null, 2));
      };
      $("btn-skill").onclick = async function () {
        var r = await fetch("/v1/skill", { headers: { "user-agent": "Mozilla/5.0" } });
        var text = await r.text();
        paintStatus(r.ok, text.slice(0, 2400));
      };
      $("btn-policy").onclick = async function () {
        var out = await api("/v1/policy");
        paintStatus(out.ok, JSON.stringify(out.data, null, 2));
      };
      $("btn-doctor").onclick = async function () {
        var out = await api("/v1/doctor");
        paintStatus(out.ok, JSON.stringify(out.data, null, 2));
      };
      $("btn-verify").onclick = async function () {
        var out = await api("/v1/verify", { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" }, body: "{}" });
        paintStatus(out.ok && out.data && out.data.verified !== false, JSON.stringify(out.data, null, 2));
      };
      $("btn-wipe").onclick = async function () {
        var out = await api("/v1/wipe", { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" }, body: "{}" });
        paintStatus(false, JSON.stringify(out.data, null, 2));
      };
      $("btn-scorch").onclick = async function () {
        var out = await api("/v1/scorch", { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" }, body: "{}" });
        paintStatus(false, JSON.stringify(out.data, null, 2));
      };
      api("/v1/health").then(function (out) {
        $("api-pill").textContent = out.ok ? "API · live" : "API · down";
        $("api-pill").className = "pill " + (out.ok ? "ok" : "bad");
      }).catch(function () {
        $("api-pill").textContent = "API · down";
        $("api-pill").className = "pill bad";
      });

      var cmd = ${JSON.stringify(INSTALL_LINE)};
      var btn = $("install-btn");
      var pre = $("install-cmd");
      if (btn) btn.addEventListener("click", function () {
        function done(ok) {
          btn.textContent = ok ? "Copied! Paste in Terminal" : "Select the command and copy it";
          btn.classList.add("copied");
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cmd).then(function () { done(true); }).catch(function () { done(false); });
        } else {
          done(false);
          if (pre && window.getSelection) {
            var r = document.createRange();
            r.selectNodeContents(pre);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(r);
          }
        }
      });

      function meshNum() {
        for (var i = 0; i < arguments.length; i++) {
          var raw = arguments[i];
          if (raw == null || raw === "") continue;
          var n = typeof raw === "number" ? raw : Number(String(raw).replace(/,/g, ""));
          if (Number.isFinite(n) && n >= 0) return Math.floor(n);
        }
        return 0;
      }
      function unwrapMesh(j) {
        if (!j || typeof j !== "object") return {};
        if (j.result && typeof j.result === "object") return Object.assign({}, j, j.result);
        if (j.mesh && typeof j.mesh === "object") return Object.assign({}, j, j.mesh);
        return j;
      }
      function paintMesh(raw) {
        var j = unwrapMesh(raw);
        var on = j.enabled === true || j.enabled === 1 || String(j.status || "").toLowerCase() === "on";
        var r = (j.rollup && typeof j.rollup === "object") ? j.rollup : {};
        var live = on ? meshNum(r.live, j.live_nodes, j.live) : 0;
        var locked = on ? meshNum(r.locked, j.locked_nodes, j.locked) : 0;
        var isolated = on ? meshNum(r.isolated, j.isolated_nodes, j.isolated) : 0;
        if ($("meshLiveCount")) $("meshLiveCount").textContent = String(live);
        if ($("qnmLive")) $("qnmLive").textContent = String(live);
        if ($("qnmLocked")) $("qnmLocked").textContent = String(locked);
        if ($("qnmIsolated")) $("qnmIsolated").textContent = String(isolated);
        var line = $("meshLine");
        if (line) {
          if (on) line.textContent = "Suite mesh: on · live " + live + " · locked " + locked + " · isolated " + isolated + ". QNS-CD-1.0. Not an anonymity network.";
          else if (j.status === "unavailable" || (j.ok === false && j.error)) line.textContent = "Suite mesh: off (unavailable). QNM-BUILD-1.0. QNS-CD-1.0. Not an anonymity network.";
          else line.textContent = "Suite mesh: off (default). QNM-BUILD-1.0. QNS-CD-1.0. Not an anonymity network.";
        }
        var products = j.products_present || j.products || [];
        var names = Array.isArray(products) ? products.map(function (p) { return typeof p === "string" ? p : (p && (p.product || p.slug)) || ""; }).filter(Boolean) : [];
        var extra = names.length ? " · products " + names.join(", ") : "";
        if ($("meshProducts")) $("meshProducts").textContent = "Catalog MCP mesh_* · FragGate slug=mesh · /v1/mesh/* PROXY · QNS-CD-1.0 cite · GET never enables · not a Node Gate" + extra;
      }
      async function meshGet(path) {
        var r = await fetch(path, { headers: { "user-agent": "Mozilla/5.0", accept: "application/json" } });
        return r.json();
      }
      async function meshPost(path, payload) {
        var r = await fetch(path, { method: "POST", headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0" }, body: JSON.stringify(payload || {}) });
        return r.json();
      }
      async function refreshMesh() {
        try {
          var status = await meshGet("/v1/mesh");
          var merged = status;
          var inner = unwrapMesh(status);
          var on = inner.enabled === true;
          if (on) {
            try {
              var nodes = await meshGet("/v1/mesh/nodes");
              merged = Object.assign({}, inner, unwrapMesh(nodes));
            } catch (e) { /* status is enough */ }
          }
          paintMesh(merged);
          var nodeId = sessionStorage.getItem("embryolock_mesh_node");
          if (on && nodeId) {
            try { await meshPost("/v1/mesh/heartbeat", { node_id: nodeId }); } catch (e) { /* no auto-heal */ }
          }
        } catch (e) {
          paintMesh({ ok: false, enabled: false, status: "unavailable", error: "mesh_unavailable" });
        }
      }
      if ($("meshEnable")) $("meshEnable").onclick = async function () {
        var bearer = ($("meshBearer") && $("meshBearer").value || "").trim();
        paintMesh(await meshPost("/v1/mesh/enable", bearer ? { bearer: bearer } : {}));
        refreshMesh();
      };
      if ($("meshDisable")) $("meshDisable").onclick = async function () {
        sessionStorage.removeItem("embryolock_mesh_node");
        paintMesh(await meshPost("/v1/mesh/disable", {}));
        refreshMesh();
      };
      if ($("meshJoin")) $("meshJoin").onclick = async function () {
        var j = await meshPost("/v1/mesh/join", { product: "embryolock", label: "EmbryoLock Worker" });
        var inner = unwrapMesh(j);
        var id = inner.node_id || inner.id || (inner.session && inner.session.node_id);
        if (id) sessionStorage.setItem("embryolock_mesh_node", String(id));
        paintMesh(j);
        refreshMesh();
      };
      if ($("meshLeave")) $("meshLeave").onclick = async function () {
        var id = sessionStorage.getItem("embryolock_mesh_node");
        if (id) await meshPost("/v1/mesh/leave", { node_id: id });
        sessionStorage.removeItem("embryolock_mesh_node");
        refreshMesh();
      };
      window.addEventListener("pagehide", function () {
        var id = sessionStorage.getItem("embryolock_mesh_node");
        if (!id || typeof navigator.sendBeacon !== "function") return;
        try { navigator.sendBeacon("/v1/mesh/leave", new Blob([JSON.stringify({ node_id: id })], { type: "application/json" })); } catch (e) { /* leave expires */ }
      });
      refreshMesh();
      setInterval(refreshMesh, 30000);
      document.addEventListener("visibilitychange", function () { if (!document.hidden) refreshMesh(); });
    })();
  </script>
</body>
</html>`;
}
