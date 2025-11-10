import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    const uploadPath = path.join(__dirname, '..', 'uploads', 'profile_pics');
    
    cb(null, uploadPath); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const userId = req.params.id || 'unknown'; 
    cb(null, `${userId}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('File is not an image!'), false); 
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: fileFilter
});

export default upload;
