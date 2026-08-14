const { Pool } = require("pg");
require("dotenv").config();

/*
  รองรับสองสถานการณ์:

  1) รันบน Render (production) — ถ้ามี DATABASE_URL ตั้งไว้ใน
     Environment Variables ของ Render dashboard ให้ใช้ตัวนั้น
     (เป็น connection string ของ cloud PostgreSQL เช่น Render Postgres,
     Supabase, ฯลฯ) เปิด ssl ไว้เพราะ cloud DB ส่วนใหญ่บังคับ ssl

  2) รันในเครื่องตัวเอง (local dev) — ถ้าไม่มี DATABASE_URL
     จะ fallback ไปใช้ DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD
     จาก .env แทน ปิด ssl เพราะ local Postgres ปกติไม่ได้เปิด ssl

  สำคัญ: local PostgreSQL ในเครื่องคุณ (DB_HOST=localhost) ต่อจาก
  Render ไม่ได้เด็ดขาด เพราะเป็นคนละเครื่องกัน ถ้าจะรันจริงบน Render
  ต้องมี cloud PostgreSQL (เช่น Render Postgres) แล้วเอา connection
  string ของมันมาตั้งเป็น DATABASE_URL ใน Render Environment Variables
*/
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: false
    });

module.exports = pool;