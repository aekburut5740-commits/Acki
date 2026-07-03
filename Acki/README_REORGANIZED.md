# Acki reorganized JS/CSS

ไฟล์ JavaScript ถูกแยกออกเป็นส่วนเล็ก ๆ แล้ว:

- `js/navigation.js` — ฟังก์ชันเปลี่ยนหน้า เช่น Home, Community, Contact, About
- `js/language.js` — modal และระบบเปลี่ยนภาษาในหน้าแรก
- `js/community.js` — post, comment, like, save, share
- `js/notification.js` — notification mini/full panel
- `js/contact.js` — contact mail form
- `js/theme.js` — เปลี่ยนพื้นหลังตามเวลา
- `js/weather.js` — event สภาพอากาศและ Test Mode

CSS Weather ถูกย้ายไปที่:

- `css/weather.css`

วิธีทดสอบ Weather:

เปิด `js/weather.js` แล้วแก้สองบรรทัดบนสุด:

```js
const WEATHER_TEST_MODE = true;
const TEST_WEATHER = "cloud";
```

เปลี่ยน `TEST_WEATHER` เป็น `sun`, `fog`, `cloud`, `rain`, `wind`, `leaf`, หรือ `firefly` ได้เลย

เมื่อพร้อมให้สุ่มจริงทุก 30 นาที ให้แก้เป็น:

```js
const WEATHER_TEST_MODE = false;
```
