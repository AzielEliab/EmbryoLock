#!/usr/bin/env bash
# Pack the counted EmbryoLock product tarball (EL-WP-1.2).
# Product source only — exclude workers/ and .git as sibling Lock peers do.
# Author: Aziel Eliab only.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
VERSION="$(tr -d '[:space:]' < "${ROOT}/VERSION")"
NAME="embryolock-${VERSION}"
OUT="${ROOT}/workers/download-tracker/public/${NAME}.tar.gz"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "${TMP}/${NAME}" "${ROOT}/workers/download-tracker/public"

cd "$ROOT"
# Tracked product files plus any new root install.sh not yet committed.
while IFS= read -r -d '' f; do
  case "$f" in
    workers/*|.git/*|.git) continue ;;
  esac
  dest="${TMP}/${NAME}/${f}"
  mkdir -p "$(dirname "$dest")"
  cp -a "$f" "$dest"
done < <(git ls-files -z)
if [ -f "${ROOT}/install.sh" ] && [ ! -f "${TMP}/${NAME}/install.sh" ]; then
  cp -a "${ROOT}/install.sh" "${TMP}/${NAME}/install.sh"
fi

# Never nest the release asset or Worker tree in the product tarball.
rm -rf "${TMP}/${NAME}/workers" "${TMP}/${NAME}/.git"

tar -C "$TMP" -czf "$OUT" "$NAME"
python3 - <<PY
import gzip, sys, tarfile
path = "${OUT}"
with gzip.open(path, "rb") as fh:
    fh.read(2)
with tarfile.open(path, "r:gz") as tf:
    names = tf.getnames()
assert any(n.startswith("${NAME}/") for n in names), names[:8]
assert not any("/.git/" in n or n.endswith("/.git") for n in names)
assert not any(n == "${NAME}/workers" or n.startswith("${NAME}/workers/") for n in names)
print("packed", path, "members", len(names))
PY
