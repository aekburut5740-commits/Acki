// Time-of-day background theme.

function updateBackgroundTheme() {
    const hour = new Date().getHours();

    document.body.classList.remove(
        "bg-morning",
        "bg-afternoon",
        "bg-evening",
        "bg-night",
        "bg-midnight"
    );

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

document.addEventListener("DOMContentLoaded", () => {
    updateBackgroundTheme();
    setInterval(updateBackgroundTheme, 60000);
});
