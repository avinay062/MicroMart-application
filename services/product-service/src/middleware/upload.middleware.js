import multer from 'multer';

const storage = multer.memoryStorage(); 

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extname) {
        return cb(null, true); 
    } else {
        cb(new Error('Only .jpeg, .jpg, .png, and .gif formats are allowed!'));
    }
};

// Multer Instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
});

export default upload;