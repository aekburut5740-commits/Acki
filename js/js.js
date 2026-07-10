// Shared helpers used by multiple Acki pages.
// Most feature-specific code lives in smaller files:
// navigation.js, language.js, community.js, notification.js, contact.js,
// appearance.js, theme.js, weather.js

function showComingSoon(featureName) {
    const popup = document.getElementById("comingSoonPopup");
    const title = document.getElementById("comingSoonTitle");
    const lang = typeof getCurrentLanguage === "function" ? getCurrentLanguage() : "en";

    const featureNames = {
        "Notification": { en: "Notification", th: "การแจ้งเตือน" },
        "Edit Post": { en: "Edit Post", th: "แก้ไขโพสต์" },
        "Delete Post": { en: "Delete Post", th: "ลบโพสต์" },
        "Save": { en: "Save", th: "บันทึกโพสต์" }
    };

    const translatedFeature = featureNames[featureName]?.[lang] || featureName;

    if (title) {
        title.textContent = lang === "th"
            ? `${translatedFeature} ยังไม่เปิดใช้งาน`
            : `${translatedFeature} Coming Soon`;
    }

    popup?.classList.add("show");
}

function closeComingSoon() {
    document.getElementById("comingSoonPopup")?.classList.remove("show");
}

function closeAllPanels() {
    if (typeof closeComment === "function") closeComment();
    if (typeof closeCreatePost === "function") closeCreatePost();
    if (typeof closeShareBox === "function") closeShareBox();

    if (typeof closeNotificationPanels === "function") {
        closeNotificationPanels();
    }
}

function openRule() {
    document.getElementById("ruleModal")?.classList.add("show");
}

function closeRule() {
    document.getElementById("ruleModal")?.classList.remove("show");
}
