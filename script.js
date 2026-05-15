const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("[data-contact-form]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const status = contactForm.querySelector("[data-form-status]");
  const email = String(formData.get("email") || "").trim();
  const emailConfirm = String(formData.get("emailConfirm") || "").trim();

  status?.classList.remove("is-success");

  if (!contactForm.checkValidity()) {
    status.textContent = "必須項目を入力してください。";
    contactForm.reportValidity();
    return;
  }

  if (email !== emailConfirm) {
    status.textContent = "メールアドレスと確認用メールアドレスが一致していません。";
    return;
  }

  const fields = [
    ["内容", formData.get("category")],
    ["会社名", formData.get("company")],
    ["お名前", formData.get("name")],
    ["電話番号", formData.get("tel")],
    ["メールアドレス", email],
    ["車両台数", formData.get("vehicleCount")],
    ["希望時期", formData.get("schedule")],
    ["本文", formData.get("message")]
  ];

  const body = fields
    .map(([label, value]) => `${label}: ${String(value || "").trim() || "未入力"}`)
    .join("\n");
  const subject = `お問い合わせ: ${formData.get("category")}`;

  status.textContent = "メールソフトを開きます。内容をご確認のうえ送信してください。";
  status.classList.add("is-success");
  window.location.href = `mailto:info@daiko-shoun.co.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
