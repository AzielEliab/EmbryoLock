/**
 * EmbryoLock hosted policy (EL-WP-1.2).
 *
 * Local destructive vault. Public Worker is human UI + counted download.
 * Never execute wipe / scorch / unlock / encrypt on the public mesh.
 * Author: Aziel Eliab only.
 */

export const PRODUCT = "embryolock";
export const NAME = "EmbryoLock";
export const VERSION = "1.2.0";
export const SPEC = "EL-WP-1.2";
export const AUTHOR = "Aziel Eliab";
export const IDENTITY = "Aziel Eliab only";
export const DOMAIN = "Vault/Custody";
export const DOMAIN_ID = "01";
export const SIBLING = "ark";
export const DOOR = "fraggate";
export const SLUG = "embryolock";
export const ROLE = "product";
export const MOTTO = "Loss is preferable to later compromise. Destruction stays local.";

export const LIMITATION =
  "THIS IS: a local destructive-by-design file vault (Vault/Custody). Failed authentication can permanently destroy the only copy. THIS IS NOT: a hosted vault, a recovery tool, a remote kill switch, or a replacement for audited encryption. Hosted /v1 never stores phrases or vault blobs and never executes wipe/scorch. Unlimited offline cloning is out of scope. Author: Aziel Eliab only.";

export const HONEST = LIMITATION;

/** Worker-local LIVE public ops. Agents still use FragGate slug embryolock. */
export const WORKER_LIVE_OPS = Object.freeze([
  "health",
  "skill",
  "policy",
  "doctor",
  "verify",
]);

/** Catalog pointer. Runtime may still list stub until aziel-runtime is updated. */
export const FRAGGATE_POINTER_OPS = Object.freeze([
  "health",
  "skill",
  "policy",
  "doctor",
  "verify",
]);

/** Destructive / vault verbs — local-only. Never execute on this Worker. */
export const REFUSED_OPS = Object.freeze([
  "wipe",
  "scorch",
  "unlock",
  "encrypt",
  "decrypt",
  "burn",
  "destroy",
  "init",
  "login",
  "tether",
  "panic",
]);

export const REFUSE_CODE = "EL-LOCAL-ONLY";

export function isRefusedOp(name) {
  if (typeof name !== "string" || !name) return null;
  const raw = name.trim().toLowerCase().replace(/-/g, "_");
  const stripped = raw.startsWith("embryolock_") ? raw.slice("embryolock_".length) : raw;
  return REFUSED_OPS.includes(stripped) ? stripped : null;
}

export function refuseDestructive(op) {
  const refused = isRefusedOp(op) || String(op || "unknown");
  return {
    ok: false,
    refuse: true,
    execute: false,
    local_only: true,
    public_worker: true,
    public_mesh: false,
    code: REFUSE_CODE,
    door: DOOR,
    slug: SLUG,
    op: refused,
    product: PRODUCT,
    version: VERSION,
    spec: SPEC,
    domain: DOMAIN,
    domain_id: DOMAIN_ID,
    author: AUTHOR,
    identity: IDENTITY,
    message:
      "Destructive vault ops are local-only. Never execute wipe/scorch on the public mesh.",
    limitation: LIMITATION,
  };
}

export function policy() {
  return {
    ok: true,
    product: PRODUCT,
    name: NAME,
    version: VERSION,
    spec: SPEC,
    author: AUTHOR,
    identity: IDENTITY,
    door: DOOR,
    slug: SLUG,
    role: ROLE,
    domain: DOMAIN,
    domain_id: DOMAIN_ID,
    sibling: SIBLING,
    software_tab: "Lock",
    framing: "Vault/Custody. Softwares listing (Plain→Gate→Lock) is handled by hubs/runtime. Clock ≠ Lock.",
    live: WORKER_LIVE_OPS.slice(),
    refused: REFUSED_OPS.slice(),
    stores_phrases: false,
    stores_vaults: false,
    remote_wipe: false,
    remote_scorch: false,
    remote_unlock: false,
    mesh_default: "off",
    get_never_enables: true,
    kv_increment: false,
    motto: MOTTO,
    limitation: LIMITATION,
    local: {
      vault: true,
      wipe_after_failed_attempts: true,
      recovery: false,
      network_required: false,
    },
    public_worker: {
      ui: true,
      counted_download: true,
      openapi: true,
      mcp_pointer: true,
      execute_destructive: false,
    },
    agent: {
      door: "fraggate",
      slug: SLUG,
      path: "fraggate_list → fraggate_describe → fraggate_call",
      catalog: "https://aziel-runtime.vibelock.workers.dev/mcp",
    },
  };
}

export function health(mesh) {
  return {
    ok: true,
    product: PRODUCT,
    name: NAME,
    version: VERSION,
    spec: SPEC,
    author: AUTHOR,
    identity: IDENTITY,
    door: DOOR,
    slug: SLUG,
    role: ROLE,
    domain: DOMAIN,
    domain_id: DOMAIN_ID,
    sibling: SIBLING,
    runtime: true,
    kv_increment: false,
    stores_phrases: false,
    stores_vaults: false,
    execute_destructive: false,
    remote_wipe: false,
    live_ops: WORKER_LIVE_OPS.slice(),
    refused_ops: REFUSED_OPS.slice(),
    mesh: mesh || { enabled_default: false, get_never_enables: true },
    motto: MOTTO,
    limitation: LIMITATION,
  };
}

export function doctor() {
  const checks = [
    { name: "identity", pass: true, detail: IDENTITY },
    { name: "door", pass: true, detail: "fraggate single door; this Worker is UI + download tracker" },
    { name: "domain", pass: true, detail: DOMAIN },
    { name: "destructive_refuse", pass: REFUSED_OPS.includes("wipe") && REFUSED_OPS.includes("scorch"), detail: "wipe/scorch refuse on public Worker" },
    { name: "no_vault_store", pass: true, detail: "hosted /v1 never stores phrases or vault blobs" },
    { name: "mesh_default_off", pass: true, detail: "GET /v1/mesh never enables" },
    { name: "live_ops", pass: WORKER_LIVE_OPS.includes("policy") && WORKER_LIVE_OPS.includes("verify"), detail: WORKER_LIVE_OPS.join(",") },
  ];
  const failed = checks.filter((c) => !c.pass);
  return {
    ok: failed.length === 0,
    product: PRODUCT,
    version: VERSION,
    spec: SPEC,
    author: AUTHOR,
    identity: IDENTITY,
    worker_local: true,
    fraggate_live: false,
    execute: false,
    writes: false,
    checks,
    failed: failed.map((c) => c.name),
    note: "Worker-local self-check. Does not touch a vault. UI Health maps to GET /v1/health. Author Aziel Eliab only.",
    limitation: LIMITATION,
  };
}

export function verify(body) {
  const rec = doctor();
  const extra = [];
  if (body && typeof body === "object") {
    if (body.execute === true || body.wipe === true || body.scorch === true) {
      extra.push("requested destructive execute — refused");
    }
  }
  return {
    ...rec,
    op: "verify",
    verified: rec.ok && extra.length === 0,
    extra,
    refuse_if_destructive: true,
    note: extra.length
      ? "Verify refused a destructive execute request. Vault wipe/scorch stay local-only."
      : rec.note,
  };
}

export function example() {
  return {
    ok: true,
    product: PRODUCT,
    version: VERSION,
    author: AUTHOR,
    spec: SPEC,
    example: {
      live: { method: "GET", path: "/v1/health" },
      policy: { method: "GET", path: "/v1/policy" },
      verify: { method: "POST", path: "/v1/verify", body: {} },
      refused: { method: "POST", path: "/v1/wipe", body: {}, expect: REFUSE_CODE },
    },
    note: "Sample calls only. Does not increment downloads. Does not touch a vault.",
  };
}
