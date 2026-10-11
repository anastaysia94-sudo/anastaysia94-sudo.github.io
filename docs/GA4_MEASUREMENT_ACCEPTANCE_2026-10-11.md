# [ChatGPT - anastaysia94] 2026-10-11 PT — Verified-measurement activation and acceptance

## Truth boundary
Source implementation is not Google Analytics deployment or proof of paid sales. Shopify API returned `operation_not_allowed` on 2026-10-11. No connected GA4 property ID, owner-confirmed payments, HubSpot form ID, customer consent, live Realtime event receipt, or revenue attribution was verified in this change. Do not label any of those PASS.

## Step A — Restore the *correct* Shopify store (account owner)
1. Sign in at https://admin.shopify.com/ and identify each store by its exact `.myshopify.com` URL. Do not confuse `htbjqk-9u.myshopify.com` (historical My Store) and `mysmartpickshop.myshopify.com` (historical SmartPickShop).
2. View Settings > Billing and the store-status banner. Verify *current* unpaid invoices, paused/frozen/deactivated status, and subscription terms. September 2026 failed and successful charge emails do **not** prove October status.
3. If frozen, only the owner can authorize and settle any balance; if deactivated, review available subscriptions and costs before reactivating. Do not assume a past $1 promo is still active. If already paid yet still frozen after a short sync, contact Shopify Support with paid receipt and error message.
4. Restore authorized API connection to the intended store and verify get-shop-info, 90-day orders, visits, checkouts, and sales. **Unknown is not zero.** No billing or store-switch action was performed by this PR.
Shopify documentation: https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/frozen-store

## Step B — Recommended official Shopify measurement
1. In the active store install/open the **Google & YouTube** app, link the correct Google account and an existing/new GA4 property with Editor access.
2. Verify the installed Google tag *once*. Remove/migrate duplicate Google Ads/GA4 pixel tags; do not blindly add a second checkout `purchase` emitter.
3. Use the app's customer/conversion-event settings for `view_item`, `add_to_cart`, `begin_checkout`, and `purchase` mappings as applicable. Where event value is sent, use `currency` such as `USD`. Each confirmed order requires a unique `transaction_id`. Never emit purchase for test/created-only or unpaid orders as actual earnings.
4. Verify consent/cookie notices and permitted tag collection under applicable requirements. Debug with Tag Assistant and GA4 Realtime/DebugView. Then compare one authorized test transaction in Shopify order history to exactly one GA4 purchase receipt and a non-duplicated order ID. Test transactions are excluded from realized revenue.
Official implementation references:
- https://support.google.com/google-ads/answer/13494537
- https://support.google.com/merchants/answer/16267554
- https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference/events

## Step C — Public AI Revenue Product Factory site
The site's current `index.html#audit` form uses `mailto:`; opening a mail client is **not** a successful form submission, actual email delivery, or CRM lead. The small `assets/measurement.js` adapter records only:
- `contact_intent` on a user-submitted mailto form, with `outcome=email_client_requested_not_lead`;
- `select_content` when a visitor chooses the offer detail page.

Both are emitted only when *an existing GA4 gtag is present* **and** `window.SPS_ANALYTICS_CONSENT === true` is set through the properly configured consent flow. The adapter does not itself load Google scripts, collect personal data, create a lead, or emit a purchase. Do not set consent to true merely to make reporting work.
To obtain genuine leads, replace mailto with an owner-authorized HubSpot/native form and a verified server/CRM submission acknowledgement. Send `generate_lead` only after the successful acknowledgment and check CRM lead ID and timestamp.
To obtain genuine paid conversions, instrument the authorized processor's confirmed order/completed payment integration, deduplicating stable transaction IDs. **Never** fire `purchase` from a button click, page visit, mailto action, or an unconfirmed checkout.

## Step D — GA4 + Search Console measurement reconciliation
Track separately:
- Search Console impressions, clicks, query, landing page; verified property and date range.
- GA4 `sessions`, `engaged_sessions`, source/medium, page/location; same domain/date/time zone.
- `contact_intent` = *micro-event*, not a qualified lead.
- `generate_lead` = only successful form/CRM acknowledgment (must be implemented and tested separately).
- `purchase` = confirmed order id, event `transaction_id`, `value`, `currency`.
- Booked/paid net profit = actual paid receipts minus discounts, refunds, transaction/platform fees, direct costs, ads, and labor (tracked separately).
Search Console clicks and GA4 sessions are not identical: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console

## Minimum acceptance evidence to mark measured/complete
| Gate | PASS only with | State as of this commit |
|---|---|---|
| Shopify access | Shop info + orders/analytics APIs succeed for intended shop | BLOCKED |
| GA4 active | Property ID, authorized data stream, tag assistant and realtime receipt | UNKNOWN |
| Search Console | Verified domain property, impressions/clicks export for a dated window | UNKNOWN |
| Public site's intent tag | Source tests plus actual GA4 consented event receipt | SOURCE ONLY |
| Lead | Approved form, real CRM acceptance ID, no PII in analytics | NOT IMPLEMENTED |
| Purchase | Real processor order receipt, one GA4 event with matching tx ID | NOT VERIFIED |
| Economic margin | Matched receipts, refunds, fees, fulfillment and labor log | UNKNOWN |
| Owner decisions | Store billing/payment, GA4 property, consent text, official form, pricing | NEEDS OWNER |

## Source validation commands
Run `node --test tests/measurement.test.cjs` and `node --check assets/measurement.js`; inspect browser privacy consent and Tag Assistant. No automatic production release claim from passing Node tests.
