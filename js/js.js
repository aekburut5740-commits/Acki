// Deprecated: Acki JavaScript has been split into smaller files.
// See: navigation.js, language.js, community.js, notification.js, contact.js, theme.js, weather.js
function showComingSoon(featureName) {
    const popup = document.getElementById("comingSoonPopup");
    const title = document.getElementById("comingSoonTitle");
    const lang = typeof getCurrentLanguage === "function" ? getCurrentLanguage() : "en";

    const featureNames = {
        "Notification": { en: "Notification", th: "การแจ้งเตือน" },
        "Edit Post": { en: "Edit Post", th: "แก้ไขโพสต์" },
        "Delete Post": { en: "Delete Post", th: "ลบโพสต์" }
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
    closeComment();
    closeCreatePost();
    closeShareBox();

    if (typeof closeNotificationPanels === "function") {
        closeNotificationPanels();
    }
}

function toggleSettingsMenu() {
    document.getElementById("settingsMenu")?.classList.toggle("show");
}

function setThemeMode(mode) {
    document.body.classList.remove("theme-light", "theme-dark");

    if (mode === "dark") {
        document.body.classList.add("theme-dark");
    } else {
        document.body.classList.add("theme-light");
    }

    localStorage.setItem("acki-theme", mode);
}

function toggleSceneBackground() {
    document.body.classList.toggle("scene-off");

    const isOff = document.body.classList.contains("scene-off");
    localStorage.setItem("acki-scene-off", isOff ? "true" : "false");
}

function toggleWeather() {
    document.body.classList.toggle("weather-off");

    const isOff = document.body.classList.contains("weather-off");
    localStorage.setItem("acki-weather-off", isOff ? "true" : "false");
}
function openRule() {
    document.getElementById("ruleModal")?.classList.add("show");
}

function closeRule() {
    document.getElementById("ruleModal")?.classList.remove("show");
}