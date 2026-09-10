## EmbryoLock

EmbryoLock is a local file vault that intentionally prioritizes **data destruction over recovery** after failed authentication attempts.

**v1.2.0** adds the GitBaby dual surface (Worker UI + counted `/download` + OpenAPI/MCP pointer to FragGate). Public identity is **Aziel Eliab** only. FragGate is THE single door — agents use aziel-runtime slug `embryolock`. This Worker is human UI + download tracker. Destructive vault ops (wipe / scorch) are local-only and refuse on the public Worker.

- Product Worker (do not treat as deployed from this PR): `https://embryolock-download-tracker.vibelock.workers.dev/`
- Skill: `/v1/skill` · Policy: `/v1/policy` · Doctor/Verify: `/v1/doctor` · `/v1/verify`
- OpenAPI: `/openapi.json` · MCP pointer: `/mcp` · Catalog MCP: `POST https://aziel-runtime.vibelock.workers.dev/mcp`
- Softwares framing: **Vault/Custody** (sibling to The ARK). Plain→Gate→Lock listing is handled by hubs/runtime.
- Mesh default off. `GET /v1/mesh` never enables.

It is designed for a narrow threat model where:
- Post-unlock theft
- Delayed access
- Casual forensic inspection

are higher risks than accidental data loss.

This project does **not** attempt to defend against unlimited offline cloning or brute-force attacks. If an attacker can freely duplicate the vault and retry indefinitely, security reduces to the strength of the password and KDF alone.

This tool exists to explore whether catastrophic failure can meaningfully reduce real-world access windows in certain scenarios — not to replace established, audited encryption systems.

---

## Threat Model

### In scope
- Post-unlock device theft
- Delayed or opportunistic access
- Casual or non-expert forensic inspection
- Scenarios where **loss is preferable to later compromise**

### Out of scope
- Unlimited offline cloning
- Live malware, keyloggers, or memory inspection
- Attackers with long-term interactive access
- Nation-state or forensic-lab adversaries

> If an attacker can freely clone the vault and attempt passwords indefinitely,
> security reduces to the strength of the password/KDF alone.

---

## What This Is
- A **destructive-by-design** vault
- A risk-reduction tool for **specific scenarios**
- A learning and exploration project

## What This Is Not
- A replacement for standard encryption tools
- Protection against determined offline brute-force
- Safe against user error

---

## Documentation
- [DESIGN.md](DESIGN.md)
- [LIMITATIONS.md](LIMITATIONS.md)
- [USAGE.md](USAGE.md)
- [FAQ.md](FAQ.md)
- [SECURITY.md](SECURITY.md)

---

## Warning

This tool can permanently destroy data.
Use only if you understand and accept that risk.
