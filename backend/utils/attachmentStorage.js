const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

/*
  รายชื่อนามสกุลไฟล์ที่ถือว่า "น่าสงสัย/อันตราย"

  ไฟล์เหล่านี้ยังอัปโหลดได้ตามที่ระบบอนุญาต
  แต่จะถูกติดธง is_dangerous = true
  เพื่อให้ frontend แสดงคำเตือนกับผู้ใช้
*/
const DANGEROUS_EXTENSIONS = new Set([
    ".exe", ".bat", ".cmd", ".com", ".scr",
    ".msi", ".sh", ".bash", ".php", ".jar",
    ".vbs", ".vbe", ".ps1", ".psm1", ".apk",
    ".jsp", ".cgi", ".dll", ".js", ".wsf",
    ".hta", ".lnk", ".reg"
]);

/*
  นามสกุลที่จะอัปโหลดขึ้น Cloudinary
  (รูปภาพและวิดีโอ) ที่เหลือเก็บ local disk ทั้งหมด
*/
const IMAGE_VIDEO_MIME_PREFIX = ["image/", "video/"];

const LOCAL_UPLOAD_DIR = path.join(
    __dirname,
    "..",
    "uploads",
    "attachments"
);

// สร้างโฟลเดอร์ถ้ายังไม่มี
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

function isDangerousFile(originalName) {
    const extension = path.extname(originalName).toLowerCase();
    return DANGEROUS_EXTENSIONS.has(extension);
}

function isImageOrVideo(mimetype) {
    return IMAGE_VIDEO_MIME_PREFIX.some((prefix) =>
        (mimetype || "").startsWith(prefix)
    );
}

function safeLocalFileName(originalName) {
    const extension = path.extname(originalName);
    const randomId = crypto.randomBytes(16).toString("hex");
    return `attachment-${Date.now()}-${randomId}${extension}`;
}

async function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "acki/post-attachments",
                resource_type: "auto"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(file.buffer);
    });
}

function saveToLocalDisk(file) {
    const fileName = safeLocalFileName(file.originalname);
    const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return {
        fileUrl: `/uploads/attachments/${fileName}`,
        fileName
    };
}

/*
  รับไฟล์จาก multer (memoryStorage) หนึ่งไฟล์
  ตัดสินใจว่าจะเก็บที่ Cloudinary หรือ local disk
  แล้ว return ข้อมูลไฟล์แนบที่พร้อมบันทึกลง DB
*/
async function storeAttachment(file) {
    const dangerous = isDangerousFile(file.originalname);

    if (isImageOrVideo(file.mimetype)) {
        const result = await uploadToCloudinary(file);

        return {
            fileUrl: result.secure_url,
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            storageType: "cloudinary",
            isDangerous: dangerous
        };
    }

    const { fileUrl } = saveToLocalDisk(file);

    return {
        fileUrl,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storageType: "local",
        isDangerous: dangerous
    };
}

module.exports = {
    storeAttachment,
    isDangerousFile,
    LOCAL_UPLOAD_DIR
};