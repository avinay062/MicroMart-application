import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if(mimeType && extname){
        return cb(null, true); // accept file
    } else {
        cb(new Error('Only .jpeg, .jpg, .png and .gif format allowed!')); // reject file
    }
};

// Multer Instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

export default upload;