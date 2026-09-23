(function () {
  const path = (location.pathname.split("/").pop() || "index.html").replace(/^\s*$/, "index.html");
  const links = [
    ["index.html", "Home"],
    ["sales.html", "System"],
    ["workflows.html", "Workflows"],
    ["hubspot.html", "HubSpot"],
    ["docs.html", "Docs"],
    ["prompts.html", "Prompts"],
    ["launch.html", "Launch"],
  ];
  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <a class="skip" href="#main">Skip to content</a>
      <div class="wrap nav">
        <a class="brand" href="index.html">AI Revenue <span>Product Factory</span></a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
        <nav class="nav-links" id="nav-links">
          ${links.map(([href, label]) => `<a href="${href}"${href === path || (path === "" && href === "index.html") ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="btn btn-primary nav-cta" href="index.html#audit">Request audit</a>
        </nav>
      </div>`;
    const btn = header.querySelector(".nav-toggle");
    const nav = header.querySelector(".nav-links");
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }
  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `<div class="wrap site-footer">
      <div>AI Revenue Product Factory · Find the leak before buying more leads.</div>
      <div>No invented results. Evidence first.</div>
    </div>`;
  }
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const sel = btn.getAttribute("data-copy");
      const el = document.querySelector(sel);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.innerText);
        btn.textContent = "Copied";
        setTimeout(() => { btn.textContent = "Copy"; }, 1600);
      } catch {
        btn.textContent = "Select text";
      }
    });
  });
})();
