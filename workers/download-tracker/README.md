# EmbryoLock download tracker (Cloudflare Worker)

Dual surface for **EmbryoLock** (EL-WP-1.2):

1. **Human software** — black/gold Worker UI, Everblooming sigil, counted `/download`.
2. **Agent / MCP** — OpenAPI + `GET`/`POST /mcp` pointer to aziel-runtime FragGate slug `embryolock`.

This Worker is **human UI + download tracker**. It is not a second FragGate door.

Author: **Aziel Eliab** only.

Do **not** deploy from this PR. First deploy binds KV `EMBRYOLOCK_DOWNLOADS` as `DOWNLOADS`.

## Law

- FragGate is THE single door. Agents: `fraggate_list` → `fraggate_describe` → `fraggate_call` with slug `embryolock`.
- Destructive vault ops (`wipe`, `scorch`, `unlock`, `encrypt`, …) are **local-only**. This Worker **refuses** them and never executes them on the public mesh.
- LIVE public on this Worker: `health`, `skill`, `policy`, `doctor` / `verify`, counted `/download`.
- Softwares framing: **Vault/Custody** (domain 01), sibling to The ARK. Plain→Gate→Lock listing is handled by hubs/runtime.
- Suite mesh default OFF. `GET /v1/mesh` never enables.

## Routes

| Method | Path | Behavior |
|--------|------|----------|
| GET | `/` | Isolated homepage. Increment views. Live Nodes strip. |
| GET | `/download` | Increment downloads. Serve gzip via `ASSETS` (HTTP 200, no 302). |
| GET | `/count` | `{project, views, downloads, total}` |
| GET | `/v1/health` | Liveness. No KV increment. |
| GET | `/v1/skill` | Skill markdown. |
| GET | `/v1/policy` | Public policy. |
| GET | `/v1/doctor` | Worker-local self-check. |
| GET\|POST | `/v1/verify` | Same self-check. Refuses destructive execute. |
| GET | `/mcp` | MCP docs + FragGate pointer. |
| POST | `/mcp` | JSON-RPC (`initialize`, `tools/list`, `tools/call`). |
| GET | `/v1/mesh` | PROXY suite mesh. Default OFF. GET never enables. |
| GET\|POST | `/v1/fraggate/*` | PROXY to aziel-runtime via `AZIEL_RUNTIME`. |

`/v1`, `/mcp`, and `/v1/mesh/*` do **not** increment downloads.

## Bindings

| Binding | Type | Purpose |
|---------|------|---------|
| `DOWNLOADS` | KV | Counters keyed `project\|owner\|repo\|branch\|fork` |
| `ASSETS` | assets | Sigil + release tarball |
| `AZIEL_RUNTIME` | service | FragGate + suite mesh PROXY |

## Verify (no deploy)

```bash
cd workers/download-tracker
node scripts/verify-dual-surface.mjs
```
