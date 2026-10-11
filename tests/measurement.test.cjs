const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const adapter = fs.readFileSync(path.join(__dirname, "../assets/measurement.js"), "utf8");

function harness(consent, tagPresent = true) {
  const events = [];
  const listeners = {};
  const document = { addEventListener: (name, fn) => { listeners[name] = fn; } };
  const win = { document, SPS_ANALYTICS_CONSENT: consent };
  if (tagPresent) win.gtag = (...args) => events.push(args);
  vm.runInNewContext(adapter, { window: win });
  return { win, listeners, events };
}
test("never sends events without explicit consent", () => {
  const h = harness(false);
  h.win.SPSMeasurement.contactIntent();
  h.win.SPSMeasurement.offerInterest();
  assert.equal(h.events.length, 0);
});
test("never sends events without an existing Google tag", () => {
  const h = harness(true, false);
  assert.equal(h.win.SPSMeasurement.contactIntent(), false);
  assert.equal(h.events.length, 0);
});
test("a valid mailto form submit is contact intent, not a lead", () => {
  const h = harness(true);
  h.listeners.submit({ target: { matches: s => s === 'form[action^="mailto:"]' } });
  assert.equal(h.events.length, 1);
  assert.equal(h.events[0][1], "contact_intent");
  assert.equal(h.events[0][2].outcome, "email_client_requested_not_lead");
  assert.equal(JSON.stringify(h.events).includes("generate_lead"), false);
});
test("offer navigation is a content-selection event, not a purchase", () => {
  const h = harness(true);
  h.listeners.click({ target: { closest: () => ({ getAttribute: () => "sales.html#tiers" }) } });
  assert.equal(h.events.length, 1);
  assert.equal(h.events[0][1], "select_content");
  assert.equal(JSON.stringify(h.events).includes("purchase"), false);
});
test("never reads or transmits form fields or visitor identity", () => {
  const h = harness(true);
  const secret = "private@example.com";
  h.listeners.submit({ target: { value: secret, email: secret, matches: () => true } });
  assert.equal(JSON.stringify(h.events).includes(secret), false);
});
