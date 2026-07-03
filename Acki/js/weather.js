/* ============================================================================
   Ambient Weather / Time-of-Day Events (community.html only)
   ---------------------------------------------------------------------------
   TEST MODE:
   - Set WEATHER_TEST_MODE = true to preview one effect while editing.
   - Change TEST_WEATHER to: "sun", "fog", "cloud", "rain", "leaf", "firefly".

   NORMAL MODE:
   - Set WEATHER_TEST_MODE = false.
   - Acki will pick a weather event immediately and then every real-world :00/:30.
   ========================================================================== */

const WEATHER_TEST_MODE = true;
const TEST_WEATHER = "cloud";

(function () {
    const weatherLayer = document.getElementById("weatherEvents");
    if (!weatherLayer) return; // Only run on community.html

    const DAY_EVENTS = ["fog", "cloud", "sun", "rain", "leaf"];
    const NIGHT_EVENTS = ["cloud", "rain", "leaf", "firefly"];

    let lastEvent = null;

    function isDaytime() {
        const hour = new Date().getHours();
        return hour >= 5 && hour < 19;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function clearWeather() {
        weatherLayer.innerHTML = "";
        document.querySelectorAll(".sunshine-warm-layer").forEach((el) => el.remove());
        document.body.classList.remove("sunshine-mode");
    }

    function pickEvent() {
        const pool = isDaytime() ? DAY_EVENTS : NIGHT_EVENTS;
        const choices = pool.filter((e) => e !== lastEvent);
        const list = choices.length ? choices : pool;
        const chosen = list[Math.floor(Math.random() * list.length)];
        lastEvent = chosen;
        return chosen;
    }

    function spawnFog() {
        for (let i = 0; i < 3; i++) {
            const band = document.createElement("div");
            band.className = "weather-fog-band";
            band.style.top = `${15 + i * 25}%`;
            band.style.animationDuration = `${rand(50, 80)}s`;
            band.style.animationDelay = `${rand(-30, 0)}s`;
            band.style.opacity = rand(0.4, 0.8);
            weatherLayer.appendChild(band);
        }
    }

    function spawnCloud() {
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement("div");
            cloud.className = "weather-cloud";
            cloud.style.top = `${rand(5, 40)}%`;
            cloud.style.animationDuration = `${rand(50, 100)}s`;
            cloud.style.animationDelay = `${rand(-80, 0)}s`;
            cloud.style.opacity = rand(0.22, 0.45);
            cloud.style.setProperty("--cloud-scale", rand(0.7, 1.4).toFixed(2));
            weatherLayer.appendChild(cloud);
        }
    }

    function spawnSun() {
        document.body.classList.add("sunshine-mode");

        let layer = document.querySelector(".sunshine-warm-layer");
        if (!layer) {
            layer = document.createElement("div");
            layer.className = "sunshine-warm-layer";
            document.body.appendChild(layer);
        }

        requestAnimationFrame(() => {
            layer.classList.add("show");
        });
    }

    function spawnRain() {
        for (let i = 0; i < 60; i++) {
            const drop = document.createElement("div");
            drop.className = "weather-rain-drop";
            drop.style.left = `${rand(0, 100)}%`;
            drop.style.animationDuration = `${rand(0.6, 1.4)}s`;
            drop.style.animationDelay = `${rand(0, 2)}s`;
            weatherLayer.appendChild(drop);
        }
    }

    function spawnLeaf() {
        const emojis = ["🍂", "🍃"];
        for (let i = 0; i < 14; i++) {
            const leaf = document.createElement("div");
            leaf.className = "weather-leaf";
            leaf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            leaf.style.left = `${rand(0, 100)}%`;
            leaf.style.fontSize = `${rand(14, 24)}px`;
            leaf.style.animationDuration = `${rand(7, 13)}s`;
            leaf.style.animationDelay = `${rand(0, 10)}s`;
            leaf.style.setProperty("--leaf-drift", `${rand(-60, 60)}px`);
            weatherLayer.appendChild(leaf);
        }
    }

    function spawnFirefly() {
        for (let i = 0; i < 18; i++) {
            const fly = document.createElement("div");
            fly.className = "weather-firefly";
            fly.style.left = `${rand(0, 100)}%`;
            fly.style.top = `${rand(30, 95)}%`;
            fly.style.animationDuration = `${rand(6, 12)}s, ${rand(2, 4)}s`;
            fly.style.animationDelay = `${rand(0, 6)}s, ${rand(0, 4)}s`;
            weatherLayer.appendChild(fly);
        }
    }

    const spawners = {
        fog: spawnFog,
        cloud: spawnCloud,
        sun: spawnSun,
        rain: spawnRain,
        leaf: spawnLeaf,
        firefly: spawnFirefly
    };

    function startWeather(type) {
        clearWeather();
        const spawn = spawners[type];
        if (spawn) spawn();
    }

    function triggerWeatherEvent() {
        startWeather(pickEvent());
    }

    function msUntilNextHalfHour() {
        const now = new Date();
        const next = new Date(now);

        if (now.getMinutes() < 30) {
            next.setMinutes(30, 0, 0);
        } else {
            next.setHours(now.getHours() + 1, 0, 0, 0);
        }

        return next.getTime() - now.getTime();
    }

    function startNormalWeatherSystem() {
        triggerWeatherEvent();

        setTimeout(function scheduleNext() {
            triggerWeatherEvent();
            setInterval(triggerWeatherEvent, 30 * 60 * 1000);
        }, msUntilNextHalfHour());
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (WEATHER_TEST_MODE) {
            startWeather(TEST_WEATHER);
        } else {
            startNormalWeatherSystem();
        }
    });
})();
