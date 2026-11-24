# Lab Checkout Pages

Documentation for the lab equipment checkout pages on the CSME website.
Keep this file updated when the feature changes.

Status: **Built, awaiting review by Jamar** (last updated 2026-11-19)
Requested by Jamar (VP IT) on 2026-11-09. Built by Meissa (Director IT).

---

## 1. What it does

A station on the lab's Windows desktop for lending equipment to students, built on the existing Payload inventory collections.

1. **`/checkout`, the unlock page.** The lab lead enters the shared **lab password** and the **student ID** (typed).
   Once unlocked, the station stays unlocked between students, so only the student ID is needed for the next person.
2. **`/checkout/<studentId>`, the student page.**
   - If the ID isn't in the system, a form appears to create the student's account (name required; email and phone optional).
   - Otherwise it shows:
     - a **giant red alert** if they have overdue items (warning only; it doesn't block them),
     - a red warning if their account is `suspended` / `inactive` (also not blocking),
     - **Check out / Check in** mode buttons and a scan box,
     - a table of what they currently have out (overdue rows in red),
     - their history (last 50 returns).
   - **Next student** goes back to `/checkout` with the station still unlocked. **Lock** locks it.

Linked from the site footer (Resources → "Lab Checkout"), next to Admin Portal. It is not in the top nav, and search engines are told not to index it.

## 2. Rules (decided with Jamar)

| Topic | Rule |
|---|---|
| Password | One shared lab password, set by an admin in **Payload Admin → Globals → Lab Checkout Settings** |
| Student ID | Typed. It's the `cardId` field of the `customers` collection. |
| Unknown student | Create their account on the spot |
| Overdue / suspended | Big red alert; lending is **not** blocked |
| Scanning | Separate **Check out** and **Check in** modes. Each scan = **1 unit**. |
| Loan length | The item's `maxCheckoutDays`, but **never more than 3 days** (both defaults are editable in Lab Checkout Settings) |
| Unknown barcode / out of stock | Error message (plus an error beep) |
| Undo / confirm | None; a scan is final |
| Idle timeout | After **3 min** with no activity, a **30 s countdown** appears with an "I'm still here" button. At 0 the station locks and needs the password again. (Both times are editable.) |
| Device | Lab Windows desktop + USB barcode scanner |

## 3. Admin setup (do this once)

1. Log in at `/admin`.
2. Go to **Globals → Lab Checkout Settings**.
3. Type a password in **Set new lab password** and save. The "Lab password is set" box becomes checked.
   The password is stored hashed (scrypt) and can never be read back. To change it, type a new one.
4. Optionally adjust the idle timeout, countdown, default loan days and max loan days.
5. Make sure every inventory item has a **barcode** that matches its sticker.

## 4. Files

| File | Purpose |
|---|---|
| `app/(frontend)/checkout/page.tsx` | Unlock page (password + student ID) |
| `app/(frontend)/checkout/UnlockForm.tsx` | Unlock form (client) |
| `app/(frontend)/checkout/[cardId]/page.tsx` | Student page (server): loads the student and their checkouts |
| `app/(frontend)/checkout/[cardId]/StudentStation.tsx` | Scanner UI, alerts, tables (client) |
| `app/(frontend)/checkout/[cardId]/CreateStudentForm.tsx` | New student form (client) |
| `app/(frontend)/checkout/IdleGuard.tsx` | Inactivity countdown + auto-lock (client) |
| `app/(frontend)/checkout/actions.ts` | Server actions: unlock, lock, keep-alive, create student, scan |
| `lib/labCheckout/inventory.ts` | Shared logic: settings, student lookup, check out / check in one unit |
| `lib/labCheckout/session.ts` | Signed httpOnly session cookie (`csme_lab_session`) |
| `lib/labCheckout/password.ts` | Password hashing / verification |
| `globals/LabCheckoutSettings.ts` | Payload global: password + timeouts + loan lengths |

Changed existing files:
- `payload.config.ts`: registers the `LabCheckoutSettings` global.
- `collections/Customers.ts`, `collections/Checkouts.ts`: **read access is now admins only**. Previously anyone could read every student's name, email and phone at `/api/customers`. The inventory API routes and these pages use the server-side Local API, so they aren't affected.
- `app/(frontend)/components/Footer.tsx`: adds the "Lab Checkout" link.
- `payload-types.ts`: regenerated (`npx payload generate:types`).

## 5. How it works (for developers)

- **Data:** uses the existing collections `customers` (students), `inventory-items` and `checkouts`. Nothing is duplicated.
  - Check out: creates a `checkouts` record with quantity 1 and status `checked-out`, then decrements `quantityAvailable`.
  - Check in: finds the student's **oldest** active loan of that item and marks it `returned` (if the loan has quantity > 1, it splits off 1 returned unit), then increments `quantityAvailable` (capped at `quantityTotal`).
  - Overdue is **computed on read** (`dueDate < now` and not returned), so no scheduled job is needed.
- **Security:**
  - The session is an httpOnly, `SameSite=Strict` cookie holding `<expiry>.<HMAC-SHA256(PAYLOAD_SECRET)>`. Every server action checks it, so the server enforces the timeout, not only the browser.
  - The cookie slides forward while there's activity (the client pings at most every 30 s).
  - A wrong password waits 1 s before replying, to slow guessing.
  - The `INVENTORY_API_SECRET` used by `/api/inventory/*` is **not** used or exposed by these pages.
- **Scanner:** the scanner types the barcode and presses Enter, so the scan box is a normal form. It stays focused (clicking empty space refocuses it), and scans are queued and processed in order, so fast scanning is safe. Success and error give different beeps.
- **Speed:** each scan shows up immediately as "Checking out ..." and is replaced by the result. The session cookie is only rewritten every 30 s, because writing it makes Next.js re-render the page. If the connection drops, the scan shows an error and the station stays usable.
- **Existing API routes** (`/api/inventory/*`) are untouched. They have their own copies of the checkout/checkin logic (e.g. they block suspended students and default to 7 days). They could be refactored to use `lib/labCheckout/inventory.ts` later.

## 6. Deploying

- **Database schema:** this adds a new global table (`lab_checkout_settings`). Locally, Payload creates it automatically in dev mode. For production (Turso), run the migration script with `NODE_ENV=production`: `npx tsx --env-file=.env.local scripts/migrate-lab-checkout.ts`. Dev mode no longer changes a remote database (see `push` in `payload.config.ts`).
- After deploying, set the lab password in the admin panel (section 3). Until then `/checkout` shows "No lab password has been set yet".

## 7. Running locally

Requires **Node 20.9+** (Node 22 recommended) and **pnpm** (the CI uses pnpm; don't install with npm).

```bash
nvm use 22
npx pnpm@9 install --frozen-lockfile
npx pnpm@9 dev
```

Create `.env.local` with at least `PAYLOAD_SECRET=<random string>`. Without `DATABASE_URL`, a local SQLite file (`csme-locale.db`) is used. Admin panel: `/admin`.

If you see `Cannot find native binding`, delete `node_modules` and `.next` and reinstall with pnpm.

## 8. Ideas for later

- Point the `/api/inventory/*` routes at the shared lib so there's a single copy of the logic.
- Record which lab lead was on duty (would need per-person logins instead of a shared password).
- A "lost / damaged" option on check-in (the `checkouts` collection already supports those statuses).
- Email reminders for overdue items (Resend is already a dependency).
