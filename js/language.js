// Acki shared language system.
// Use data-en / data-th for text, data-en-html / data-th-html for HTML,
// data-en-placeholder / data-th-placeholder for inputs, and data-en-title / data-th-title for tooltips.

function getCurrentLanguage() {
    return localStorage.getItem("acki-language") || "en";
}

function setLanguage(lang) {
    const nextLang = lang === "th" ? "th" : "en";
    localStorage.setItem("acki-language", nextLang);
    applyLanguage();

    window.dispatchEvent(new CustomEvent("acki-language-change", {
        detail: { lang: nextLang }
    }));
}

function toggleLanguage() {
    const current = getCurrentLanguage();
    setLanguage(current === "en" ? "th" : "en");
}

function applyLanguage() {
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-en], [data-th]").forEach((el) => {
        const text = el.getAttribute(`data-${lang}`);
        if (text !== null) el.textContent = text;
    });

    document.querySelectorAll("[data-en-html], [data-th-html]").forEach((el) => {
        const html = el.getAttribute(`data-${lang}-html`);
        if (html !== null) el.innerHTML = html;
    });

    document.querySelectorAll("[data-en-placeholder], [data-th-placeholder]").forEach((el) => {
        const placeholder = el.getAttribute(`data-${lang}-placeholder`);
        if (placeholder !== null) el.setAttribute("placeholder", placeholder);
    });

    document.querySelectorAll("[data-en-title], [data-th-title]").forEach((el) => {
        const title = el.getAttribute(`data-${lang}-title`);
        if (title !== null) el.setAttribute("title", title);
    });

    document.querySelectorAll(".lang-toggle").forEach((btn) => {
        // แสดงภาษาปัจจุบัน
        btn.textContent = lang === "en" ? "EN" : "TH";

        // Tooltip บอกว่าตอนนี้กำลังใช้ภาษาอะไร
        btn.setAttribute(
            "aria-label",
            lang === "en"
                ? "Current language: English"
                : "ภาษาปัจจุบัน: ไทย"
        );
    });
}

function t(enText, thText) {
    return getCurrentLanguage() === "th" ? thText : enText;
}

document.addEventListener("DOMContentLoaded", applyLanguage);
