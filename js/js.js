function openRule() {
    document.getElementById("ruleModal").classList.add("show");
}
function goCommunity() {
    window.location.href = "page/community.html";
}
function goGoogle() {
    window.location.href = "https://www.google.com";
}
function closeRule() {
    document.getElementById("ruleModal").classList.remove("show");
}
const translations = {
    en: {
        box1: "You know?",
        box2: "There is only one rule here.",
        box3: "Be yourself",
        box4: "Alright?",
        btnnah: "Nah ?",
        btnunderstand: "Understand !",
        title: "Welcome to Acki",
        subtitle: "talk and share your ideas with the community. have fun and make new friends.Let's get started!",
        btnno: "No ?",
        btngotit: "Got It !",
        abouttext: "| Welcome to Acki.This website was created with one simple idea: everyone has something worth sharing.Acki is a place where people can freely post their ideas, thoughts, stories, artwork, questions, oranything that comes to mind.There are no expectations to be perfect, and there is no pressure toimpress anyone.Sometimes the smallest idea can become the beginning of an interesting conversation.Since this is only the first version of Acki, the community is still small and simple.You won't findcountless features or complicated menus here yet.Instead, the focus is on what matters most—sharingideas and enjoying what other people create.As Acki continues to grow, more features and improvements will be added over time.But for now, this iswhere the journey begins.Take your time, explore the community, and maybe leave behind an idea that someone else will neverforget. | ",
        footertext1: "© 2026 Acki. All rights reserved.",
        footertext2: "| not at all.",
        title: "Welcome to Acki",
        subtitle: "talk and share your ideas with the community. have fun and make new friends. Let's get started!",
        gotit: "Got It !",
        no: "No ?"
    },
    th: {
        box1: "รู้อะไรมั้ย?",
        box2: "ที่นี่มีกฎอยู่เพียงแค่กฏเดียวเท่านั้น",
        box3: "จงเป็นตัวเอง",
        box4: "ตามนั้นนะ?",
        btnnah: "เฮอะ ?",
        btnunderstand: "เข้าใจแล้ว !",
        title: "ยินดีต้อนรับสู่ Acki",
        subtitle: "พูดคุยและแชร์ประสบการณ์ต่างๆและไอเดียของคุณไปกับคอมมูนิตี้นี้ สนุกไปด้วยกันและทำความรู้จักเพื่อนใหม่ๆ เริ่มกันเลยดีกว่า!",
        btnno: "ไม่อะ ?",
        btngotit: "ได้เลย !",
        abouttext: "| ยินดีต้อนรับสู่ Acki เว็บไซต์แห่งนี้ถูกสร้างขึ้นจากแนวคิดง่าย ๆ เพียงอย่างเดียว นั่นคือ ทุกคนล้วนมีบางสิ่งที่ควรค่าแก่การแบ่งปัน Acki คือพื้นที่ที่ผู้คนสามารถโพสต์ไอเดีย ความคิด เรื่องราว งานศิลปะ คำถาม หรืออะไรก็ตามที่ผุดขึ้นมาในใจได้อย่างอิสระที่นี่ไม่มีความคาดหวังว่าคุณจะต้องสมบูรณ์แบบ และไม่มีแรงกดดันที่จะต้องทำให้ใครประทับใจ เพราะบางครั้ง ไอเดียเล็ก ๆ เพียงหนึ่งเดียว ก็อาจกลายเป็นจุดเริ่มต้นของบทสนทนาที่น่าสนใจได้เนื่องจากนี่เป็นเพียงเวอร์ชันแรกของ Acki ชุมชนแห่งนี้จึงยังคงเล็กและเรียบง่าย คุณจะยังไม่พบฟีเจอร์มากมายหรือเมนูที่ซับซ้อนในตอนนี้สิ่งที่เราให้ความสำคัญคือสิ่งที่สำคัญที่สุด นั่นคือ การแบ่งปันความคิด และการเพลิดเพลินไปกับสิ่งที่ผู้อื่นสร้างสรรค์เมื่อ Acki เติบโตขึ้น ฟีเจอร์ใหม่ ๆ และการปรับปรุงต่าง ๆ จะค่อย ๆ ถูกเพิ่มเข้ามาตามกาลเวลาแต่ในตอนนี้... นี่คือจุดเริ่มต้นของการเดินทางค่อย ๆ ใช้เวลาของคุณ สำรวจชุมชนแห่งนี้ และบางที... คุณอาจทิ้งไอเดียบางอย่างไว้ ซึ่งจะกลายเป็นสิ่งที่ใครสักคนไม่มีวันลืม |",
        footertext1: "© 2026 Acki. สงวนลิขสิทธิ์",
        footertext2: "| ยังไม่สมบูรณ์",
        title: "ยินดีต้อนรับสู่ Acki",
        subtitle: "พูดคุยและแบ่งปันไอเดียกับชุมชน สนุกและสร้างเพื่อนใหม่ มาเริ่มกันเลย!",
        gotit: "รับทราบ !",
        no: "ไม่ ?"
    }
};

let currentLang = "en";

function toggleLang() {
    currentLang = currentLang === "en" ? "th" : "en";
    const t = translations[currentLang];

    document.getElementById("box1").textContent = t.box1;
    document.getElementById("box2").textContent = t.box2;
    document.getElementById("box3").textContent = t.box3;
    document.getElementById("box4").textContent = t.box4;
    document.getElementById("btnnah").textContent = t.btnnah;
    document.getElementById("btnunderstand").textContent = t.btnunderstand;
    document.getElementById("title").textContent = t.title;
    document.getElementById("subtitle").textContent = t.subtitle;
    document.getElementById("btnno").textContent = t.btnno;
    document.getElementById("btngotit").textContent = t.btngotit;
    document.getElementById("abouttext").textContent = t.abouttext;
    document.getElementById("footertext1").textContent = t.footertext1;
    document.getElementById("footertext2").textContent = t.footertext2;
    document.getElementById("lang-btn").textContent = currentLang === "en" ? "TH" : "EN";
}
let activePost = null;
let activePostId = null;

const commentsData = {
    1: [{ user: "Visitor", text: "Nice first post!" }],
    2: [{ user: "Visitor", text: "This second post looks good." }],
    3: [{ user: "Visitor", text: "I like this one." }]
};

function openComment(button) {
    closeAllPanels();

    const post = button.closest(".post");
    const postId = post.dataset.postId;

    activePost = post;
    activePostId = postId;

    document.getElementById("commentTitle").textContent = "Comments for Post #" + postId;

    renderComments(postId);

    document.querySelectorAll(".post").forEach((p) => {
        if (p !== post) {
            p.classList.add("dimmed");
        }
    });

    post.classList.add("focus");

    document.getElementById("focusOverlay").classList.add("show");
    document.getElementById("commentPanel").classList.add("show");
}

function renderComments(postId) {
    const commentList = document.getElementById("commentList");
    commentList.innerHTML = "";

    const comments = commentsData[postId] || [];

    comments.forEach((comment) => {
        const item = document.createElement("div");
        item.className = "comment-item";

        const user = document.createElement("span");
        user.className = "comment-user";

        const message = document.createElement("span");
        message.className = "comment-message";

        if (typeof comment === "string") {
            user.textContent = "Visitor:";
            message.textContent = comment.replace("Visitor:", "").trim();
        } else {
            user.textContent = comment.user + ":";
            message.textContent = comment.text;
        }

        item.appendChild(user);
        item.appendChild(message);
        commentList.appendChild(item);
    });
}

function commentEnter(event) {
    if (event.key === "Enter") {
        sendComment();
    }
}

function closeComment() {
    if (activePost) {
        activePost.classList.remove("focus");
        activePost = null;
    }

    activePostId = null;

    document.querySelectorAll(".post").forEach((p) => {
        p.classList.remove("dimmed");
    });

    document.getElementById("focusOverlay").classList.remove("show");
    document.getElementById("commentPanel").classList.remove("show");
}
function sendComment() {
    const input = document.getElementById("commentInput");
    const text = input.value.trim();

    if (text === "" || !activePostId) {
        return;
    }

    if (!commentsData[activePostId]) {
        commentsData[activePostId] = [];
    }

    commentsData[activePostId].push("Visitor: " + text);

    addNotification("comment", "Visitor commented on your post.", activePostId);

    renderComments(activePostId);

    updateCommentCount(activePostId);

    input.value = "";
}
function commentEnter(event) {
    if (event.key === "Enter") {
        sendComment();
    }
}
function toggleCreatePost() {
    const createPost = document.getElementById("createPost");
    const isOpen = createPost.classList.contains("show");

    closeAllPanels();

    if (!isOpen) {
        createPost.classList.add("show");
    }
}
function closeCreatePost() {
    document.getElementById("createPost").classList.remove("show");
}

function closeAllPanels() {
    closeComment();
    closeCreatePost();
    closeShareBox();
}

let nextPostId = 4;

function createNewPost() {
    const textarea = document.getElementById("createText");
    const text = textarea.value.trim();

    if (text === "") {
        return;
    }

    const content = document.querySelector(".content");

    const post = document.createElement("div");
    post.className = "post";
    post.dataset.postId = nextPostId;
    post.dataset.createdAt = Date.now();

    post.innerHTML = `
    <div class="post-header">
        <img src="../pic/sss.jpg" class="post-avatar" alt="Visitor">
        <div>
            <p class="post-name">Visitor</p>
            <p class="post-time">just now</p>
        </div>
    </div>

    <div class="post-body">
        <p></p>
    </div>

    <div class="post-active">
        <button class="ti ti-heart btn-like" onclick="toggleLike(this)">
            <span class="like-count">0</span>
        </button>
        <button class="ti ti-message-circle btn-comment" onclick="openComment(this)">
            <span class="comment-count">0</span>
        </button>
        <button class="ti ti-bookmark btn-save" onclick="toggleSave(this)"></button>
        <button class="ti ti-share-3 btn-share" onclick="sharePost(this)"></button>
    </div>
`;

    post.querySelector(".post-body p").textContent = text;

    const firstPost = document.querySelector(".post");
    content.insertBefore(post, firstPost);

    updatePostTimes();

    commentsData[nextPostId] = [];

    nextPostId++;

    textarea.value = "";
    closeCreatePost();
}
function autoResizePost(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}
function toggleLike(button) {
    const countSpan = button.querySelector(".like-count");
    let count = Number(countSpan.textContent);

    if (button.classList.contains("liked")) {
        button.classList.remove("liked");
        button.classList.remove("ti-heart-filled");
        button.classList.add("ti-heart");
        count--;
    } else {
        button.classList.add("liked");
        button.classList.remove("ti-heart");
        button.classList.add("ti-heart-filled");
        count++;

        const post = button.closest(".post");
        addNotification("like", "Visitor liked your post.", post.dataset.postId);
    }

    countSpan.textContent = count;
}
function updateCommentCount(postId) {
    const post = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!post) return;

    const countSpan = post.querySelector(".comment-count");
    if (!countSpan) return;

    const count = commentsData[postId] ? commentsData[postId].length : 0;
    countSpan.textContent = count;
}

function timeAgo(time) {
    const now = Date.now();
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return "just now";

    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return minutes + " min ago";

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + " hr ago";

    const days = Math.floor(hours / 24);
    return days + " day ago";
}
function updatePostTimes() {
    document.querySelectorAll(".post").forEach((post) => {
        const createdAt = Number(post.dataset.createdAt);
        if (!createdAt) return;

        const timeText = post.querySelector(".post-time");
        timeText.textContent = timeAgo(createdAt);
    });
}

document.querySelectorAll(".post").forEach((post) => {
    if (!post.dataset.createdAt) {
        post.dataset.createdAt = Date.now();
    }
});

updatePostTimes();
setInterval(updatePostTimes, 30000);

function toggleSave(button) {
    if (button.classList.contains("saved")) {
        button.classList.remove("saved");
        button.classList.remove("ti-bookmark-filled");
        button.classList.add("ti-bookmark");
    } else {
        button.classList.add("saved");
        button.classList.remove("ti-bookmark");
        button.classList.add("ti-bookmark-filled");
    }
}

function sharePost(button) {
    const shareBox = document.getElementById("shareBox");
    const shareOverlay = document.getElementById("shareOverlay");

    const post = button.closest(".post");
    const postId = post.dataset.postId;

    const isOpen = shareBox.classList.contains("show");
    const currentPost = shareBox.closest(".post");

    closeAllPanels();

    post.classList.add("share-active");

    if (isOpen && currentPost === post) {
        return;
    }

    addNotification("share", "Your post was shared.", postId);

    const link = `${window.location.origin}${window.location.pathname}?post=${postId}`;
    document.getElementById("shareLink").value = link;

    post.appendChild(shareBox);

    const postRect = post.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();

    shareBox.style.left = (btnRect.left - postRect.left + 40) + "px";
    shareBox.style.top = (btnRect.top - postRect.top - 20) + "px";

    shareBox.classList.add("show");
    shareOverlay.classList.add("show");
}

function copyShareLink() {
    const input = document.getElementById("shareLink");
    input.select();
    navigator.clipboard.writeText(input.value);
}

function closeShareBox() {
    document.getElementById("shareBox").classList.remove("show");
    document.getElementById("shareOverlay").classList.remove("show");

    document.querySelectorAll(".post").forEach((post) => {
        post.classList.remove("share-active");
    });
}
window.addEventListener("load", () => {
    setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("post");

        if (!postId) return;

        const post = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (!post) return;

        post.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        setTimeout(() => {
            const commentBtn = post.querySelector(".btn-comment");
            openComment(commentBtn);
        }, 500);

    }, 300);
});

function goHome() {
    window.location.href = "../index.html";
}
function goAbout() {
    window.location.href = "about.html";
}
function goContact() {
    window.location.href = "contact.html";
}

function sendContactMail() {
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value.trim();

    if (message === "") {
        alert("Please write your message first.");
        return;
    }

    const body = `From: ${email || "Not provided"}\n\n${message}`;

    window.location.href =
        `mailto:aekburut5740@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function goNotification() {
    window.location.href = "notification.html";
}
let notifications = [
    { type: "comment", text: "Visitor commented on your post.", time: "just now", postId: "1" },
    { type: "like", text: "Visitor liked your post.", time: "2 min ago", postId: "2" },
    { type: "share", text: "Your post was shared.", time: "5 min ago", postId: "3" }
];

let currentNotificationFilter = "all";

function showNotificationDot() {
    document.getElementById("notificationDot").classList.add("show");
}

function hideNotificationDot() {
    document.getElementById("notificationDot").classList.remove("show");
}

function addNotification(type, text, postId) {
    notifications.unshift({
        type,
        text,
        time: "just now",
        postId
    });

    showNotificationDot();
    renderNotificationMini();
    renderNotificationFull();
}

function toggleNotificationMini() {
    const mini = document.getElementById("notificationMini");
    const full = document.getElementById("notificationFull");
    const blur = document.getElementById("notificationBlur");

    hideNotificationDot();

    if (full) full.classList.remove("show");
    if (blur) blur.classList.remove("show");

    renderNotificationMini();

    mini.classList.toggle("show");
}

function renderNotificationMini() {
    const list = document.getElementById("notificationMiniList");
    if (!list) return;

    list.innerHTML = "";

    notifications.slice(0, 3).forEach((noti) => {
        const item = document.createElement("div");
        item.className = "notification-item-mini";
        item.innerHTML = `
        ${noti.text}
        <span>${noti.time}</span>
    `;

        item.onclick = () => openPostFromNotification(noti.postId);

        list.appendChild(item);
    });
}

function openNotificationFull() {
    document.getElementById("notificationMini").classList.remove("show");
    document.getElementById("notificationBlur").classList.add("show");
    document.getElementById("notificationFull").classList.add("show");

    renderNotificationFull();
}

function closeNotificationFull() {
    document.getElementById("notificationBlur").classList.remove("show");
    document.getElementById("notificationFull").classList.remove("show");
}

function filterNotification(type) {
    currentNotificationFilter = type;

    document.querySelectorAll(".notification-tabs button").forEach((btn) => {
        btn.classList.remove("active");
    });

    event.target.classList.add("active");

    renderNotificationFull();
}

function renderNotificationFull() {
    const list = document.getElementById("notificationFullList");
    if (!list) return;

    list.innerHTML = "";

    const filtered = currentNotificationFilter === "all"
        ? notifications
        : notifications.filter((noti) => noti.type === currentNotificationFilter);

    filtered.forEach((noti) => {
        const item = document.createElement("div");
        item.className = "notification-item-full";
        item.innerHTML = `
            ${noti.text}
            <span>${noti.time}</span>
        `;

        item.onclick = () => openPostFromNotification(noti.postId);

        list.appendChild(item);
    });
}

renderNotificationMini();
renderNotificationFull();

function openPostFromNotification(postId) {
    closeNotificationFull();
    document.getElementById("notificationMini").classList.remove("show");

    const post = document.querySelector(`.post[data-post-id="${postId}"]`);
    if (!post) return;

    post.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    setTimeout(() => {
        const commentBtn = post.querySelector(".btn-comment");
        openComment(commentBtn);
    }, 500);
}

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

updateBackgroundTheme();

setInterval(updateBackgroundTheme, 60000);

function goHome() {
    window.location.href = "/index.html";
}

function goAbout() {
    window.location.href = "/page/about.html";
}

function goContact() {
    window.location.href = "/page/contact.html";
}

function goCommunity() {
    window.location.href = "/page/community.html";
}
/* ==========================================================================
   Ambient Weather / Time-of-Day Events (community.html only)
   - Guarded by #weatherEvents so this never runs/affects other pages
     (js.js is shared by index.html, about.html, contact.html too).
   - Picks a random event every real-world :00 / :30 mark ("ทุก 30 นาที").
   - Day pool (bg-morning / bg-afternoon / bg-evening): fog, cloud, sun, rain, wind, leaf
   - Night pool (bg-night / bg-midnight): cloud, rain, wind, leaf, firefly
   - Never repeats the same event twice in a row.
   - The layer itself (#weatherEvents) is fixed, z-index:0 and
     pointer-events:none, so it always renders above the theme background
     (z:-2 / z:-1) but never covers posts, nav or any UI (all z-index >= 1).
   ========================================================================== */
(function () {
    const weatherLayer = document.getElementById("weatherEvents");
    if (!weatherLayer) return; // only run on community.html

    const DAY_EVENTS = ["fog", "cloud", "sun", "rain", "wind", "leaf"];
    const NIGHT_EVENTS = ["cloud", "rain", "wind", "leaf", "firefly"];

    let lastEvent = null;

    function isDaytime() {
        const hour = new Date().getHours();
        // matches bg-morning / bg-afternoon / bg-evening range used above
        return hour >= 5 && hour < 19;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function pickEvent() {
        const pool = isDaytime() ? DAY_EVENTS : NIGHT_EVENTS;
        const choices = pool.filter((e) => e !== lastEvent);
        const list = choices.length ? choices : pool;
        const chosen = list[Math.floor(Math.random() * list.length)];
        lastEvent = chosen;
        return chosen;
    }

    function clearWeather() {
        weatherLayer.innerHTML = "";
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
            cloud.style.opacity = rand(0.4, 0.8);
            cloud.style.setProperty("--cloud-scale", rand(0.7, 1.4).toFixed(2));
            weatherLayer.appendChild(cloud);
        }
    }

    function spawnSun() {
        const glow = document.createElement("div");
        glow.className = "weather-sun-glow";
        weatherLayer.appendChild(glow);

        for (let i = 0; i < 6; i++) {
            const ray = document.createElement("div");
            ray.className = "weather-sun-ray";
            ray.style.right = `${rand(20, 320)}px`;
            ray.style.transform = `rotate(${rand(-30, 30)}deg)`;
            ray.style.animationDuration = `${rand(6, 10)}s`;
            ray.style.animationDelay = `${rand(0, 6)}s`;
            weatherLayer.appendChild(ray);
        }
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

    function spawnWind() {
        for (let i = 0; i < 10; i++) {
            const streak = document.createElement("div");
            streak.className = "weather-wind-streak";
            streak.style.top = `${rand(0, 100)}%`;
            streak.style.animationDuration = `${rand(3, 6)}s`;
            streak.style.animationDelay = `${rand(0, 5)}s`;
            weatherLayer.appendChild(streak);
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
        wind: spawnWind,
        leaf: spawnLeaf,
        firefly: spawnFirefly
    };

    function triggerWeatherEvent() {
        clearWeather();
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

    // Show an event immediately so the background isn't empty on load
    triggerWeatherEvent();

    // Then align every future change to real-world :00 / :30 marks (ทุก 30 นาที)
    setTimeout(function scheduleNext() {
        triggerWeatherEvent();
        setInterval(triggerWeatherEvent, 30 * 60 * 1000);
    }, msUntilNextHalfHour());
})();
