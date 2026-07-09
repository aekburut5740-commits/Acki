// Deprecated compatibility wrapper.
// Appearance and time-of-day background are now handled by appearance.js.
function updateBackgroundTheme() {
    if (typeof applyThemeMode === "function") {
        applyThemeMode();
    }
}
