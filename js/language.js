// Index page modal + language switcher.

function openRule() {
    const modal = document.getElementById("ruleModal");
    if (modal) modal.classList.add("show");
}

function closeRule() {
    const modal = document.getElementById("ruleModal");
    if (modal) modal.classList.remove("show");
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
        subtitle: "talk and share your ideas with the community. have fun and make new friends. Let's get started!",
        btnno: "No ?",
        btngotit: "Got It !",
        abouttext: "| Welcome to Acki. This website was created with one simple idea: everyone has something worth sharing. Acki is a place where people can freely post their ideas, thoughts, stories, artwork, questions, or anything that comes to mind. There are no expectations to be perfect, and there is no pressure to impress anyone. Sometimes the smallest idea can become the beginning of an interesting conversation. Since this is only the first version of Acki, the community is still small and simple. You won't find countless features or complicated menus here yet. Instead, the focus is on what matters most—sharing ideas and enjoying what other people create. As Acki continues to grow, more features and improvements will be added over time. But for now, this is where the journey begins. Take your time, explore the community, and maybe leave behind an idea that someone else will never forget. |",
        footertext1: "© 2026 Acki. All rights reserved.",
        footertext2: "| not at all."
    },
    th: {
        box1: "รู้อะไรมั้ย?",
        box2: "ที่นี่มีกฎอยู่เพียงแค่กฏเดียวเท่านั้น",
        box3: "จงเป็นตัวเอง",
        box4: "ตามนั้นนะ?",
        btnnah: "เฮอะ ?",
        btnunderstand: "เข้าใจแล้ว !",
        title: "ยินดีต้อนรับสู่ Acki",
        subtitle: "พูดคุยและแบ่งปันไอเดียกับชุมชน สนุกและสร้างเพื่อนใหม่ มาเริ่มกันเลย!",
        btnno: "ไม่ ?",
        btngotit: "รับทราบ !",
        abouttext: "| ยินดีต้อนรับสู่ Acki เว็บไซต์แห่งนี้ถูกสร้างขึ้นจากแนวคิดง่าย ๆ เพียงอย่างเดียว นั่นคือ ทุกคนล้วนมีบางสิ่งที่ควรค่าแก่การแบ่งปัน Acki คือพื้นที่ที่ผู้คนสามารถโพสต์ไอเดีย ความคิด เรื่องราว งานศิลปะ คำถาม หรืออะไรก็ตามที่ผุดขึ้นมาในใจได้อย่างอิสระ ที่นี่ไม่มีความคาดหวังว่าคุณจะต้องสมบูรณ์แบบ และไม่มีแรงกดดันที่จะต้องทำให้ใครประทับใจ เพราะบางครั้ง ไอเดียเล็ก ๆ เพียงหนึ่งเดียว ก็อาจกลายเป็นจุดเริ่มต้นของบทสนทนาที่น่าสนใจได้ เนื่องจากนี่เป็นเพียงเวอร์ชันแรกของ Acki ชุมชนแห่งนี้จึงยังคงเล็กและเรียบง่าย คุณจะยังไม่พบฟีเจอร์มากมายหรือเมนูที่ซับซ้อนในตอนนี้ สิ่งที่เราให้ความสำคัญคือสิ่งที่สำคัญที่สุด นั่นคือ การแบ่งปันความคิด และการเพลิดเพลินไปกับสิ่งที่ผู้อื่นสร้างสรรค์ เมื่อ Acki เติบโตขึ้น ฟีเจอร์ใหม่ ๆ และการปรับปรุงต่าง ๆ จะค่อย ๆ ถูกเพิ่มเข้ามาตามกาลเวลา แต่ในตอนนี้... นี่คือจุดเริ่มต้นของการเดินทาง ค่อย ๆ ใช้เวลาของคุณ สำรวจชุมชนแห่งนี้ และบางที... คุณอาจทิ้งไอเดียบางอย่างไว้ ซึ่งจะกลายเป็นสิ่งที่ใครสักคนไม่มีวันลืม |",
        footertext1: "© 2026 Acki. สงวนลิขสิทธิ์",
        footertext2: "| ยังไม่สมบูรณ์"
    }
};

let currentLang = "en";

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function toggleLang() {
    currentLang = currentLang === "en" ? "th" : "en";
    const t = translations[currentLang];

    setText("box1", t.box1);
    setText("box2", t.box2);
    setText("box3", t.box3);
    setText("box4", t.box4);
    setText("btnnah", t.btnnah);
    setText("btnunderstand", t.btnunderstand);
    setText("title", t.title);
    setText("subtitle", t.subtitle);
    setText("btnno", t.btnno);
    setText("btngotit", t.btngotit);
    setText("abouttext", t.abouttext);
    setText("footertext1", t.footertext1);
    setText("footertext2", t.footertext2);
    setText("lang-btn", currentLang === "en" ? "TH" : "EN");
}
