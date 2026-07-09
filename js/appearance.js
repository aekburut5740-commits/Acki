// Acki shared appearance/settings system.
// Handles: Auto/Light/Dark theme, stage background, and weather visibility.

const ACKI_THEME_KEY = "acki-theme";
const ACKI_SCENE_OFF_KEY = "acki-scene-off";
const ACKI_WEATHER_OFF_KEY = "acki-weather-off";

function getThemeMode() {
    return localStorage.getItem(ACKI_THEME_KEY) || "auto";
}

function removeTimeBackgroundClasses() {
    document.body.classList.remove(
        "bg-morning",
        "bg-afternoon",
        "bg-evening",
        "bg-night",
        "bg-midnight"
    );
}

function applyTimeBackgroundTheme() {
    removeTimeBackgroundClasses();

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) {
        document.body.classList.add("bg-morning");
    } else if (hour >= 11 && hour < 16) {
        document.body.classList.add("bg-afternoon");
    } else if (hour >= 16 && hour < 19) {
        document.body.classList.add("bg-evening");
    } else if (hour >= 19 && hour <= 23) {
        document.body.classList.add("bg-night");
    } else {
        document.body.classList.add("bg-midnight");
    }
}

function applyThemeMode() {
    const mode = getThemeMode();

    document.body.classList.remove("theme-light", "theme-dark");

    if (mode === "light") {
        removeTimeBackgroundClasses();
        document.body.classList.add("theme-light");
    } else if (mode === "dark") {
        removeTimeBackgroundClasses();
        document.body.classList.add("theme-dark");
    } else {
        applyTimeBackgroundTheme();
    }

    updateAppearanceMenuState();
}

function setThemeMode(mode) {
    const safeMode = ["auto", "light", "dark"].includes(mode) ? mode : "auto";
    localStorage.setItem(ACKI_THEME_KEY, safeMode);
    applyThemeMode();
}

function toggleSceneBackground() {
    document.body.classList.toggle("scene-off");

    const isOff = document.body.classList.contains("scene-off");
    localStorage.setItem(ACKI_SCENE_OFF_KEY, isOff ? "true" : "false");

    updateAppearanceMenuState();
}

function applySceneBackgroundState() {
    const isOff = localStorage.getItem(ACKI_SCENE_OFF_KEY) === "true";
    document.body.classList.toggle("scene-off", isOff);
    updateAppearanceMenuState();
}

function toggleWeather() {
    document.body.classList.toggle("weather-off");

    const isOff = document.body.classList.contains("weather-off");
    localStorage.setItem(ACKI_WEATHER_OFF_KEY, isOff ? "true" : "false");

    updateAppearanceMenuState();

    window.dispatchEvent(new CustomEvent("acki-weather-change", {
        detail: { isOff }
    }));
}

function applyWeatherState() {
    const isOff = localStorage.getItem(ACKI_WEATHER_OFF_KEY) === "true";
    document.body.classList.toggle("weather-off", isOff);
    updateAppearanceMenuState();
}

function toggleSettingsMenu() {
    document.getElementById("settingsMenu")?.classList.toggle("show");
}

function updateAppearanceMenuState() {
    const mode = getThemeMode();

    document.querySelectorAll("[data-theme-option]").forEach((button) => {
        button.classList.toggle("active", button.dataset.themeOption === mode);
    });

    document.querySelectorAll("[data-setting-state='scene']").forEach((el) => {
        const isOff = document.body.classList.contains("scene-off");
        el.textContent = isOff
            ? (typeof t === "function" ? t("Off", "ปิด") : "Off")
            : (typeof t === "function" ? t("On", "เปิด") : "On");
    });

    document.querySelectorAll("[data-setting-state='weather']").forEach((el) => {
        const isOff = document.body.classList.contains("weather-off");
        el.textContent = isOff
            ? (typeof t === "function" ? t("Off", "ปิด") : "Off")
            : (typeof t === "function" ? t("On", "เปิด") : "On");
    });
}

function applyAppearanceSettings() {
    applyThemeMode();
    applySceneBackgroundState();
    applyWeatherState();
}

document.addEventListener("DOMContentLoaded", () => {
    applyAppearanceSettings();

    setInterval(() => {
        if (getThemeMode() === "auto") {
            applyTimeBackgroundTheme();
        }
    }, 60000);

    document.addEventListener("click", (event) => {
        const menu = document.getElementById("settingsMenu");
        const wrap = event.target.closest?.(".settings-wrap");
        if (menu && !wrap) menu.classList.remove("show");
    });
});

window.addEventListener("acki-language-change", updateAppearanceMenuState);
