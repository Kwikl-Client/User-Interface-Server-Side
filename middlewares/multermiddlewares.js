import multer from 'multer';

const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, './assets/uploadedImages/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()); // Set the filename (you can customize this)
  },
});

// Set up Multer middleware
const upload = multer({ storage: storage });

export default upload;
