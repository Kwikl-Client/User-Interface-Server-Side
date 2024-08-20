import Multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the 'temp' directory exists
const tempDir = path.join(process.cwd(), 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const upload = Multer({
  storage: Multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'C:\\Users\\Kwik L\\Desktop\\backend node\\temp'); // Your temp directory
    },
    filename: (req, file, cb) => {
      cb(null, `image_${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export default upload;