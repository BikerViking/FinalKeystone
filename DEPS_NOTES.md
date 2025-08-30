# Dependency Notes

This project forces modern, non-deprecated transitive dependencies using **npm overrides** to avoid warnings and known issues (e.g., `inflight` memory leak, old `glob`/`rimraf`).

Overrides are defined in **client/package.json** and **server/package.json**:
```json
{
  "overrides": {
    "glob": "^10.3.12",
    "rimraf": "^5.0.5",
    "minimatch": "^9.0.5",
    "brace-expansion": "^2.0.1"
  }
}
```

## Verify after a clean install

Run in **client/** and then **server/**:
```bash
npm ci
npm ls glob inflight rimraf || true
```

You should NOT see:
- `inflight@1.x`
- `glob@7.x`
- `rimraf@2.x` or `3.x`

If you adopt pnpm or Yarn in the future, use `pnpm.overrides` or Yarn `resolutions` to mirror the same constraints.
