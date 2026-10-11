/* SmartPickShop measurement adapter.
 * This file does NOT install a Google tag or send data on its own.
 * GA4 needs an authorized property, configured tag, and site consent signal.
 * No emails, names, form fields or other personal data are sent.
 * A mailto launch is only contact_intent; NEVER generate_lead.
 * Purchases must come from the payment provider's confirmed transaction.
 */
(function (root) {
  "use strict";
  function permitted() {
    return root.SPS_ANALYTICS_CONSENT === true && typeof root.gtag === "function";
  }
  function event(name, params) {
    if (!permitted()) return false;
    if (name !== "contact_intent" && name !== "select_content") return false;
    root.gtag("event", name, params);
    return true;
  }
  function contactIntent() {
    return event("contact_intent", {
      method: "mailto",
      form_id: "revenue_leak_audit",
      outcome: "email_client_requested_not_lead"
    });
  }
  function offerInterest() {
    return event("select_content", {
      content_type: "offer",
      item_id: "revenue_leak_recovery"
    });
  }
  function bind(doc) {
    if (!doc || typeof doc.addEventListener !== "function") return;
    doc.addEventListener("submit", function (ev) {
      var form = ev.target;
      if (form && typeof form.matches === "function" &&
          form.matches('form[action^="mailto:"]')) {
        contactIntent(); // Success is NOT known. It is NOT a lead.
      }
    });
    doc.addEventListener("click", function (ev) {
      var link = ev.target && ev.target.closest && ev.target.closest("a[href]");
      if (!link) return;
      var dest = link.getAttribute("href") || "";
      if (/(^|\/)sales\.html(?:[?#]|$)/.test(dest)) offerInterest();
    });
  }
  root.SPSMeasurement = Object.freeze({
    contactIntent: contactIntent,
    offerInterest: offerInterest,
    ga4Ready: permitted
  });
  bind(root.document);
})(typeof window === "object" ? window : globalThis);
