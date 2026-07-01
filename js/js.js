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

function sendComment() {
    const input = document.getElementById("commentInput");
    const text = input.value.trim();

    if (text === "" || !activePostId) {
        return;
    }

    if (!commentsData[activePostId]) {
        commentsData[activePostId] = [];
    }

    commentsData[activePostId].push({
        user: "Visitor",
        text: text
    });

    renderComments(activePostId);

    input.value = "";
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