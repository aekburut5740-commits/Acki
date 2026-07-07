/* ============================================================================
   Acki Ambient Weather / Time-of-Day Events (community.html only)
   ---------------------------------------------------------------------------
   TEST MODE:
   - Set WEATHER_TEST_MODE = true to preview one effect while editing.
   - Change TEST_WEATHER to: "sun", "fog", "cloud", "rain", "wind", "leaf", "firefly".
   - Change WEATHER_INTENSITY from 0.2 to 1.0 to test light/heavy versions.

   NORMAL MODE:
   - Set WEATHER_TEST_MODE = false.
   - Acki will pick a weather event immediately and then every real-world :00/:30.

   Notes:
   - All weather elements render inside #weatherEvents, behind posts and panels.
   - Sunshine uses a separate .sunshine-warm-layer so it can tint the whole page softly.
   ========================================================================== */

const WEATHER_TEST_MODE = false; // true = test one effect, false = normal random weather
const TEST_WEATHER = "rain";  // "sun", "fog", "cloud", "rain", "wind", "leaf", "firefly"
/* 0.2 = very light, 0.5 = normal, 0.8 = strong, 1 = heavy */
const WEATHER_INTENSITY = 0.7; // ความเยอะของเอฟเฟกต์
const WEATHER_CHANCE = 0.85;    // โอกาสเกิด weather ในรอบนั้น

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

    function randomInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    function intensity(min, max) {
        return Math.round(min + (max - min) * WEATHER_INTENSITY);
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
        const fogCount = intensity(2, 5);

        for (let i = 0; i < fogCount; i++) {
            const band = document.createElement("div");
            band.className = "weather-fog-band";
            band.style.top = `${10 + i * (70 / fogCount)}%`;
            band.style.animationDuration = `${rand(55, 95)}s`;
            band.style.animationDelay = `${rand(-35, 0)}s`;
            band.style.opacity = rand(0.28, 0.55 + WEATHER_INTENSITY * 0.2);
            weatherLayer.appendChild(band);
        }
    }

    function spawnCloud() {
        const groupCount = intensity(2, 5);

        for (let i = 0; i < groupCount; i++) {
            const group = document.createElement("div");
            group.className = "weather-cloud-group";

            const topPercent = rand(4, 24);
            const scale = rand(0.7, 1.25 + WEATHER_INTENSITY * 0.35);
            const duration = rand(95, 180);

            group.style.top = `${topPercent}%`;
            group.style.animationDuration = `${duration}s`;
            group.style.animationDelay = `${rand(-duration, 0)}s`;
            group.style.setProperty("--cloud-scale", scale.toFixed(2));
            group.style.setProperty("--cloud-opacity", rand(0.38, 0.66 + WEATHER_INTENSITY * 0.18).toFixed(2));
            group.style.setProperty("--cloud-blur", `${rand(3.5, 7.5)}px`);

            const puffCount = randomInt(4, 8);
            for (let p = 0; p < puffCount; p++) {
                const puff = document.createElement("span");
                puff.className = "weather-cloud-puff";
                puff.style.left = `${rand(0, 170)}px`;
                puff.style.top = `${rand(0, 42)}px`;
                puff.style.width = `${rand(70, 150)}px`;
                puff.style.height = `${rand(32, 74)}px`;
                puff.style.opacity = rand(0.72, 1).toFixed(2);
                group.appendChild(puff);
            }

            weatherLayer.appendChild(group);
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
        const dropCount = intensity(35, 95);

        for (let i = 0; i < dropCount; i++) {
            const drop = document.createElement("div");
            drop.className = "weather-rain-drop";
            drop.style.left = `${rand(0, 100)}%`;
            drop.style.animationDuration = `${rand(0.75, 1.55)}s`;
            drop.style.animationDelay = `${rand(0, 2)}s`;
            drop.style.opacity = rand(0.42, 0.85).toFixed(2);
            weatherLayer.appendChild(drop);
        }
    }

    function spawnLeaf() {
        const leafCount = intensity(7, 24);
        const leaves = ["🍂", "🍃"];

        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement("div");
            leaf.className = "weather-leaf";
            leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.left = `${rand(0, 100)}%`;
            leaf.style.fontSize = `${rand(13, 22)}px`;
            leaf.style.animationDuration = `${rand(9, 17)}s`;
            leaf.style.animationDelay = `${rand(0, 12)}s`;
            leaf.style.setProperty("--leaf-drift", `${rand(-90, 90)}px`);
            weatherLayer.appendChild(leaf);
        }
    }

    function spawnFirefly() {
        const flyCount = intensity(8, 26);

        for (let i = 0; i < flyCount; i++) {
            const fly = document.createElement("div");
            fly.className = "weather-firefly";
            fly.style.left = `${rand(4, 96)}%`;
            fly.style.top = `${rand(38, 94)}%`;
            fly.style.setProperty("--fly-x1", `${rand(-18, 26)}px`);
            fly.style.setProperty("--fly-y1", `${rand(-22, 16)}px`);
            fly.style.setProperty("--fly-x2", `${rand(-30, 24)}px`);
            fly.style.setProperty("--fly-y2", `${rand(-28, 22)}px`);
            fly.style.animationDuration = `${rand(14, 28)}s, ${rand(3.5, 7)}s`;
            fly.style.animationDelay = `${rand(-20, 0)}s, ${rand(-5, 0)}s`;
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
        clearWeather();

        if (Math.random() > WEATHER_CHANCE) {
            lastEvent = null;
            return;
        }

        const event = pickEvent();
        const spawn = spawners[event];

        if (spawn) spawn();
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
