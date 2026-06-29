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
        footertext2:"| not at all.",
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
        footertext2:"| ยังไม่สมบูรณ์",
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