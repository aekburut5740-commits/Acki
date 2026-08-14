const { Pool } = require("pg");
require("dotenv").config();

/*
  ต่อ database ด้วยค่าที่แยกกันใน .env
  (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
  แทนการใช้ DATABASE_URL ตัวเดียว เพราะ .env ของโปรเจกต์นี้
  เก็บค่าแยกกันอยู่แล้ว

  ssl ปิดไว้เพราะต่อ PostgreSQL แบบ local (DB_HOST=localhost)
  ถ้าย้ายไป deploy บน cloud DB ในอนาคต (เช่น Render, Railway, Supabase)
  ค่อยเปิด ssl: { rejectUnauthorized: false } กลับมา
*/
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

module.exports = pool;