const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // 1️⃣ সব tab unselect
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));

    // 2️⃣ সব panel লুকানো
    panels.forEach((p) => (p.hidden = true));

    // 3️⃣ ক্লিক করা tab select
    tab.setAttribute("aria-selected", "true");

    // 4️⃣ এই tab কোন panel-এর?
    const associatedPanel = tab.getAttribute("aria-controls");

    // 5️⃣ ওই panel খুঁজে বের করা
    const panel = document.getElementById(associatedPanel);

    // 6️⃣ ওই panel দেখানো 🎉
    panel.hidden = false;
  });
});
