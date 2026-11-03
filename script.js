// Double R Digital — interactions du portfolio
document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu");
const stickyCta = document.querySelector("#sticky-cta");
const hero = document.querySelector(".hero");

/* ---------- En-tête au scroll ---------- */
function onScroll() {
  header?.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Menu mobile ---------- */
function setMenu(open) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  menu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}
menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.classList.contains("open")) {
    setMenu(false);
    menuButton?.focus();
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) setMenu(false);
});

/* ---------- Barre « Me contacter » sur mobile ---------- */
if (stickyCta && hero && "IntersectionObserver" in window) {
  const contact = document.querySelector("#contact");
  let heroVisible = true;
  let contactVisible = false;
  const update = () => {
    const show = !heroVisible && !contactVisible;
    stickyCta.classList.toggle("visible", show);
    stickyCta.setAttribute("aria-hidden", String(!show));
    stickyCta.querySelector("a")?.setAttribute("tabindex", show ? "0" : "-1");
  };
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
  if (contact) {
    new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; update(); }, { threshold: 0.15 }).observe(contact);
  }
}

/* ---------- Apparition des blocs au scroll ---------- */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

/* ---------- Année du pied de page ---------- */
const year = document.querySelector("#current-year");
if (year) year.textContent = new Date().getFullYear();

/* ---------- Formulaire de contact (FormSubmit, envoi sans recharger la page) ---------- */
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!status) return form.submit();

  const button = form.querySelector('button[type="submit"]');
  const ajaxUrl = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");

  status.className = "form-status";
  status.textContent = "Envoi en cours…";
  if (button) button.disabled = true;

  try {
    const response = await fetch(ajaxUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    form.reset();
    status.classList.add("ok");
    status.textContent = "Merci ! Votre message est bien parti, je vous réponds très vite.";
  } catch (error) {
    status.classList.add("error");
    status.innerHTML = 'Oups, l’envoi n’a pas fonctionné. Écrivez-moi directement à <a href="mailto:rickyrichard2205@gmail.com">rickyrichard2205@gmail.com</a>.';
  } finally {
    if (button) button.disabled = false;
  }
});
