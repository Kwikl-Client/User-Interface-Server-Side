import Multer from "multer";

const upload = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, `${process.cwd()}/temp`);
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;