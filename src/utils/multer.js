import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config()

async function ensureDir (directory) {
  try {
    await fs.promises.access(directory, fs.constants.F_OK)
  } catch (e) {
    await fs.promises.mkdir(directory, { recursive: true })
    console.log('errors', e)
  }
}

const storage = multer.diskStorage({
  destination (req, file, cb) {
    const dir = 'images_container'
    ensureDir(dir)
    cb(null, dir)
  },
  filename (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname)
  }
})

const upload = multer({ storage: storage })
export const uploaded = upload.fields([
  { name: 'receipt', maxCount: 1 },
  { name: 'agreement', maxCount: 1 },
  { name: ' idOrPassport', maxCount: 1 },
  { name: 'landDocument', maxCount: 1 },
  { name: 'codeFile', maxCount: 1 },
  { name: 'images', maxCount: 20 }
])

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
