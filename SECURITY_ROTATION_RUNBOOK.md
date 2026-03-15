# Security Rotation Runbook

This runbook covers the remaining operational security actions that must be done outside the repository.

## 1) Rotate Firebase Admin service account credentials

1. Open Google Cloud Console for the production project.
2. Go to IAM & Admin > Service Accounts.
3. Locate the account used by `FIREBASE_ADMIN_CLIENT_EMAIL`.
4. Create a new key only if strictly needed (prefer Workload Identity if available).
5. Update runtime secrets:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`
6. Redeploy application.
7. Revoke and delete old keys.

## 2) Rotate and verify public Firebase client config values

1. Update runtime environment values for:
   - `NEXT_PUBLIC_CENTRAL_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_CENTRAL_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_CENTRAL_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_CENTRAL_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_CENTRAL_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_CENTRAL_FIREBASE_APP_ID`
2. Validate auth, tenant loading, and admin flows in production.

## 3) Verify repository for accidental secrets

Use this command from repository root:

```powershell
rg -n "AIza[0-9A-Za-z_-]{20,}|BEGIN PRIVATE KEY|FIREBASE_ADMIN_PRIVATE_KEY|client_email|private_key" .
```

Expected result after cleanup:
- Only local ignored artifacts (`.env.local`, `.next`) may show runtime values.
- No hardcoded secrets in tracked source or docs.

## 4) Protect CI/CD secret handling

1. Add all production secrets to GitHub Actions Secrets (or your CI secret manager).
2. Do not commit `.env.production` with real values.
3. Keep `.env.local` local-only.

## 5) Post-rotation validation

1. Run `npm run lint:critical`.
2. Run `npm run build:ci`.
3. Smoke test:
   - `/login`
   - `/admin`
   - `/tenant-admin/products`
   - `/tenant-admin/categories`
   - `/tenant-admin/settings`
   - `/api/admin/audit`
