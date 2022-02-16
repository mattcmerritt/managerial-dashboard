var express = require("express");
var router = express.Router();
var multer = require("multer");

var fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  }
});

var upload = multer({storage: fileStorageEngine });

router.post('/single', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.send('File upload successful');
});

module.exports = router;