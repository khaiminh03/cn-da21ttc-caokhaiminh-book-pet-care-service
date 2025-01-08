import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

// Cấu hình storage
export const storage = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = './public/img'; // Có thể dùng biến môi trường
    if (!fs.existsSync(uploadPath)) {
      try {
        fs.mkdirSync(uploadPath, { recursive: true });
      } catch (err) {
        return callback(new Error('Không thể tạo thư mục upload'), null);
      }
    }
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`; // Tên file an toàn
    callback(null, uniqueName);
  },
});

// Bộ lọc file
export const fileFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new Error('Chỉ chấp nhận các file hình ảnh'), false);
  }
};
