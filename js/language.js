
function getCurrentLanguage() {
    return localStorage.getItem("acki-language") || "en";
}

function setLanguage(lang) {
    localStorage.setItem("acki-language", lang);
    applyLanguage();
}

function toggleLanguage() {
    const current = getCurrentLanguage();
    const next = current === "en" ? "th" : "en";
    setLanguage(next);
}

function applyLanguage() {
    const lang = getCurrentLanguage();

    document.querySelectorAll("[data-en]").forEach((el) => {
        el.textContent = el.dataset[lang];
    });

    const btn = document.querySelector(".lang-toggle");
    if (btn) {
        btn.textContent = lang === "en" ? "TH" : "EN";
    }
}

document.addEventListener("DOMContentLoaded", applyLanguage);